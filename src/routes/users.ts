import { FastifyInstance } from "fastify";
import { Role, Gender, ProfileStatus, EducationLevel } from "../entities/User";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Database } from "../datasource";
import { ValidateTIN } from "../services/ValidateTIN";
import { NotificationService } from "../services/NotificationService";
import { PoolService } from "../services/PoolService";
import { ConflictError, NotFoundError, RequestError, UnauthorizedError } from "../services/ErrorService";
import { Type, TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const bcrypt = require("bcrypt");
const validateTIN = new ValidateTIN();

const signupSchema = {
  tags: ["Users"],
  summary: "Register a new user",
  params: Type.Object({
    role: Type.Enum(Role),
  }),
  body: Type.Object({
    name: Type.String({ minLength: 2 }),
    surname: Type.String({ minLength: 2 }),
    email: Type.String({ format: "email" }),
    phone: Type.String({ pattern: "^89\\d{9}$" }),
    password: Type.String({ minLength: 8 }),
    tin: Type.Optional(Type.String({ minLength: 10, maxLength: 12 })),
  }),
  response: {
    201: Type.Object({
      success: Type.Boolean(),
      message: Type.String(),
      data: Type.Any(), // Matches your userResponse
    }),
  },
};

const updateSchema = {
  tags: ["Users"],
  summary: "Update user profile",
  body: Type.Partial(
    Type.Object({
      phone: Type.String({ pattern: "^89\\d{9}$" }),
      gender: Type.Enum(Gender),
      city: Type.String({ minLength: 2, maxLength: 100 }),
      socialLinks: Type.Array(Type.String({ format: "uri" })),
      description: Type.String({ maxLength: 500 }),
      // Employer specific
      managerPosition: Type.String({ maxLength: 150 }),
      companyName: Type.String({ maxLength: 255 }),
      companyWebsite: Type.String({
        pattern:
          "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{2,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
      }),
      tin: Type.String({ minLength: 10, maxLength: 12 }),
      // Specialist specific
      educations: Type.Array(Type.Enum(EducationLevel)),
      status: Type.Enum(ProfileStatus),
      birthDate: Type.String({ format: "date" }),
      citizenship: Type.Boolean(),
    }),
  ),
  response: {
    204: Type.Object({
      success: Type.Boolean(),
      message: Type.String(),
    }),
    401: Type.Object({
      success: Type.Boolean(),
      message: Type.String(),
    }),
    403: Type.Object({
      success: Type.Boolean(),
      message: Type.String(),
    }),
  },
};

const loginSchema = {
  tags: ["Users"],
  summary: "Login to an account",
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean(),
      message: Type.String(),
      data: Type.Any(),
    }),
  },
};

interface userParams {
  id: string;
  role: Role;
}

module.exports = async (instance: FastifyInstance) => {
  const fastify = instance.withTypeProvider<TypeBoxTypeProvider>();

  const sanitizeUpdateData = (role: Role, data: any) => {
    const commonFields = ["phone", "gender", "city", "socialLinks", "description"];
    const employerFields = ["managerPosition", "companyName", "companyWebsite", "tin"];
    const specialistFields = ["educations", "status", "birthDate", "citizenship"];

    const sanitized: any = {};
    const allowedFields =
      role === Role.EMPLOYER
        ? [...commonFields, ...employerFields]
        : [...commonFields, ...specialistFields];

    allowedFields.forEach((field) => {
      if (data[field] !== undefined) sanitized[field] = data[field];
    });
    return sanitized;
  };

  fastify.post("/signup/:role", { schema: signupSchema }, async (req, res) => {
    const { email, phone, password: rawPassword, ...data } = req.body;
    const userPool = PoolService.getUserPool(req.params.role);
    if (
      await Database.getRepository("User").findOne({
        where: [{ email }, { phone }],
      })
    ) {
      throw new ConflictError("Email or phone already in use");
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 12);
    let user;
    Object.assign(data, { email, phone, password: hashedPassword });
    switch (req.params.role) {
      case Role.EMPLOYER:
        if (!req.body.tin) {
          throw new RequestError("TIN missing/invalid");
        }
        const valid = await validateTIN.isExists(req.body.tin.toString());
        user = userPool.create({
          ...data,
          verified: valid,
        });
        await NotificationService.notifyValidationStatus(user.id, user.verified);
        break;
      case Role.SPECIALIST:
        user = userPool.create({
          ...data,
        });
        break;
      default:
        throw new RequestError();
    }

    await userPool.save(user);
    const { password, ...userResponse } = user;
    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    return res
      .setCookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        path: "/",
      })
      .status(201)
      .send({
        success: true,
        message: "User registered successfully",
        data: userResponse,
      });
  });

  fastify.post("/login", { schema: loginSchema }, async (req, res) => {
    const data = req.body as any;
    const userPool = PoolService.getUserPool();
    const user = await userPool.findOne({ where: { email: data.email } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedError("Invalid password");
    }
    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    return res
      .setCookie("access_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        path: "/",
      })
      .status(200)
      .send({
        success: true,
        message: `Login successfull`,
        data: { role: user.role, id: user.id, name: user.name },
      });
  });

  fastify.post("/logout", { preHandler: fastify.authenticate }, async (req, res) => {
    if (!req.cookies.access_token) {
      throw new UnauthorizedError("Cookie not found");
    }
    res
      .clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        signed: true,
        path: "/",
      })
      .status(200)
      .send({ success: true, message: "Logged out" });
  });

  fastify.get<{ Params: userParams }>("/:id", { preHandler: fastify.authenticate }, async (req, res) => {
    const userPool = PoolService.getUserPool();
    let user = await userPool.findOne({ where: { id: req.params.id } });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (req.user.id === req.params.id) {
      const { password, ...fullData } = user as any;
      return res.status(200).send({ success: true, message: "OK", data: fullData });
    }

    const basicInfo: any = {
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      description: user.description,
      socialLinks: user.socialLinks,
      verified: user.verified,
    };
    switch (user.role) {
      case Role.EMPLOYER:
        // info only an employer has
        Object.assign(basicInfo, {
          position: user.managerPosition,
          company: user.companyName,
          companyWebsite: user.companyWebsite,
          vacancies: user.vacancies,
        });
        break;
      case Role.SPECIALIST:
        // info only a specialist has
        Object.assign(basicInfo, {
          education: user.education,
          status: user.status,
          birthDate: user.birthDate,
          citizenship: user.citizenship,
          resumes: user.resumes,
        });
        break;
    }
    return res.status(200).send({
      success: true,
      data: {
        ...basicInfo,
      },
    });
  });

  fastify.patch(
    "/update",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const userPool = PoolService.getUserPool(req.user.role);
      const user = await userPool.findOne({ where: { id: req.user.id } });

      if (!user) throw new NotFoundError("User not found");

      const sanitizedData = sanitizeUpdateData(req.user.role, req.body);

      if (req.user.role === Role.EMPLOYER && sanitizedData.tin) {
        user.verified = await validateTIN.isExists(sanitizedData.tin);
        await NotificationService.notifyValidationStatus(user.id, user.verified);
      }

      Object.assign(user, sanitizedData);
      await userPool.save(user);
      return res.status(204).send({ success: true, message: "Successfully Updated" });
    },
  );
};
