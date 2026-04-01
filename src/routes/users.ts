import { FastifyInstance } from "fastify";
import {
  Specialist,
  Employer,
  Role,
  User,
  Gender,
  ProfileStatus,
  EducationLevel,
} from "../entities/User";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Database } from "../datasource";
const bcrypt = require("bcrypt");

const signupSchema = {
  body: {
    type: "object",
    required: ["name", "surname", "email", "phone", "password"],
    properties: {
      name: { type: "string", minLength: 2 },
      surname: { type: "string", minLength: 2 },
      email: { type: "string", format: "email" },
      phone: { type: "string", pattern: "^89\\d{9}$" }, // Strict 89xxxxxxxxx
      password: { type: "string", minLength: 8 },
      // Employer specific
      tin: { type: "string", minLength: 10, maxLength: 12 },
    },
  },
};

const loginSchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", format: "password" },
    },
  },
};

const updateSchema = {
  body: {
    type: "object",
    required: ["phone", "gender", "city"],
    properties: {
      phone: { type: "string", pattern: "^89\\d{9}$" },
      gender: {
        type: "string",
        enum: Object.values(Gender),
      },
      city: { type: "string", minLength: 2, maxLength: 100 },
      socialLinks: {
        type: "array",
        items: { type: "string", format: "uri" },
      },
      // Employer specific
      managerPosition: { type: "string", maxLength: 150 },
      companyName: { type: "string", maxLength: 255 },
      companyWebsite: {
        type: "string",
        pattern:
          "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{2,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
      },
      // Specialist specific
      educations: {
        type: "array",
        items: {
          type: "string",
          enum: Object.values(EducationLevel),
        },
      },
      status: {
        type: "string",
        enum: Object.values(ProfileStatus),
      },
      description: { type: "string" },
      birthDate: { type: "string", format: "date" }, // Validates "YYYY-MM-DD"
      citizenship: { type: "boolean" },
    },
  },
};

interface updateBody {
  phone: string;
  gender: string;
  city: string;
  socialLinks: [];
  managerPosition?: string;
  companyName?: string;
  companyWebsite?: string;
  educations?: [];
  status?: string;
  description?: string;
  birthDate?: Date;
  citizenship?: boolean;
}

interface signupBody {
  name: string;
  surname: string;
  email: string;
  phone: string;
  password: string;
  tin?: number;
}

interface userParams {
  id: string;
  role: Role;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Params: userParams; Body: signupBody }>(
    "/signup/:role",
    { schema: signupSchema },
    async (req, res) => {
      if (!req.body) {
        return res.status(400).send({ success: false, message: "Bad request" });
      }
      const data = req.body;
      const userRepository = Database.getRepository(
        req.params.role === Role.EMPLOYER ? Employer : Specialist,
      );
      const existingUser = await Database.getRepository("User").findOne({
        where: [{ email: data.email }, { phone: data.phone }],
      });
      if (existingUser) {
        return res
          .status(409)
          .send({ success: false, message: "User with this email or phone already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 12);
      let user;
      switch (req.params.role) {
        case Role.EMPLOYER:
          if (!req.body.tin) {
            return res.status(400).send({ success: false, message: "TIN missing/invalid" });
          }
          user = userRepository.create({
            ...data,
            password: hashedPassword,
            verified: false,
          });
          break;
        case Role.SPECIALIST:
          user = userRepository.create({
            ...data,
            password: hashedPassword,
          });
          break;
        default:
          return res.status(400).send({ success: false, message: "Bad Request" });
      }

      try {
        await userRepository.save(user);
        const { password, ...userResponse } = user;
        return res.status(201).send({
          success: true,
          message: "User registered successfully",
          user: userResponse,
        });
      } catch (error) {
        fastify.log.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
      }
    },
  );

  fastify.post("/login", { schema: loginSchema }, async (req, res) => {
    const data = req.body as any;
    const userRepository = Database.getRepository(User);
    const user = await userRepository.findOne({ where: { email: data.email } });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    if (!(await bcrypt.compare(data.password, user.password))) {
      res.status(401).send({ success: false, message: "Invalid Password" });
    }
    const token = fastify.jwt.sign({ id: user.id });
    return res
      .setCookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        signed: true,
        path: "/",
      })
      .status(200)
      .send({ success: true, message: `Login successfull` });
  });

  fastify.post("/logout", { preHandler: fastify.authenticate }, async (req, res) => {
    try {
      if (!req.cookies.access_token) {
        return res.status(400).send({ success: false, message: "No cookies provided" });
      }
      res
        .clearCookie("access_token", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          signed: true,
          path: "/",
        })
        .status(200)
        .send({ success: true, message: "Logged out" });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ success: false, message: "Internal server error" });
    }
  });

  fastify.get<{ Params: userParams }>("/:id", { preHandler: fastify.authenticate }, async (req, res) => {
    const userRepository = Database.getRepository(User);
    let user;
    try {
      user = await userRepository.findOne({ where: { id: req.params.id } });
    } catch (e) {
      return res.status(500).send({ success: false, message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    const basicInfo: any = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      gender: user.gender,
      socialLinks: user.socialLinks,
      verified: user.verified,
    };
    switch (user.role) {
      case Role.EMPLOYER:
        // info only an employer has
        basicInfo.position = user.managerPosition;
        basicInfo.company = user.companyName;
        basicInfo.companyWebsite = user.companyWebsite;
        break;
      case Role.SPECIALIST:
        // info only a specialist has
        basicInfo.education = user.education;
        basicInfo.status = user.status;
        basicInfo.description = user.description;
        basicInfo.birthDate = user.birthDate;
        basicInfo.citizenship = user.citizenship;
        break;
    }

    if (req.user.id === user.id) {
      return res.status(200).send({
        success: true,
        data: {
          ...user,
        },
      });
    } else {
      return res.status(200).send({
        success: true,
        data: {
          ...basicInfo,
        },
      });
    }
  });

  fastify.patch<{ Body: updateBody }>(
    "/update",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const userRepository = Database.getRepository(User);
      const user = await userRepository.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }

      const updateData: any = req.body;
      switch (user.role) {
        case Role.EMPLOYER:
          delete updateData.educations;
          delete updateData.status;
          delete updateData.description;
          delete updateData.birthDate;
          delete updateData.citizenship;
          break;
        case Role.SPECIALIST:
          delete updateData.managerPosition;
          delete updateData.companyName;
          delete updateData.companyWebsite;
          break;
      }
      Object.assign(user, updateData);

      try {
        await userRepository.save(user);
        return res.status(200).send({ success: true, message: "Successfully Updated" });
      } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, message: "Database Error" });
      }
    },
  );
};
