import { FastifyInstance } from "fastify";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Role, User } from "../entities/User";
import { Database } from "../datasource";
import { Resume, ResumeStatus, ResumeWorkFormat } from "../entities/Resume";

const createSchema = {
  body: {
    type: "object",
    required: ["profession", "experience", "desiredSalaryFrom", "city", "workFormat"],
    properties: {
      profession: { type: "string", minLength: 1 },
      name: { type: "string", minLength: 1 },
      surname: { type: "string", minLength: 1 },
      experience: { type: "number" },
      experienceDescription: { type: "string", maxLength: 500 },
      skills: {
        type: "array",
        maxItems: 5,
        items: {
          type: "string",
        },
      },
      desiredSalaryFrom: { type: "number" },
      city: { type: "string", minLength: 1 },
      workFormat: { type: "string", enum: Object.values(ResumeWorkFormat) },
      status: { type: "string", enum: Object.values(ResumeStatus) },
    },
  },
};

interface createBody {
  profession: string;
  name: string;
  surname: string;
  experience: number;
  experienceDescription?: string;
  skills?: string[];
  desiredSalaryFrom: number;
  city: string;
  workFormat: ResumeWorkFormat;
  status: ResumeStatus;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: createBody }>(
    "/create",
    { preHandler: fastify.authenticate, schema: createSchema },
    async (req, res) => {
      if (req.user.role === Role.EMPLOYER) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const userPool = Database.getRepository(User);
      const user = await userPool.findOne({ where: { id: req.user.id } });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      const {
        profession,
        name,
        surname,
        experience,
        experienceDescription,
        skills,
        desiredSalaryFrom,
        city,
        workFormat,
      } = req.body;
      const resumePool = Database.getRepository(Resume);
      const resume = resumePool.create({
        specialistId: req.user.id,
        profession,
        name: name ?? user.name,
        surname: surname ?? user.surname,
        experience: experience ?? 0,
        experienceDescription,
        skills,
        desiredSalaryFrom: desiredSalaryFrom ?? 0,
        city: city ?? user.city,
        workFormat,
      });
      try {
        await resumePool.save(resume);
        return res.status(201).send({ success: true, message: "Resume created", data: resume });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/viewprofile/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const userPool = Database.getRepository(User);
      const user = await userPool.findOne({ where: { id: req.params.id } });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      const resumePool = Database.getRepository(Resume);
      let resumes = await resumePool.find({
        where: {
          specialistId: req.params.id,
          ...(req.user.id !== req.params.id ? { status: ResumeStatus.ACTIVE } : {}),
        },
      });
      if (!resumes) {
        return res.status(404).send({ success: false, message: "Resumes not found" });
      }
      resumes = resumes.map((resume: Resume) => {
        const { workFormat, profession, desiredSalaryFrom } = resume;

        return req.user.id === user.id
          ? {
              workFormat,
              profession,
              desiredSalaryFrom,
              createdAt: resume.createdAt,
              views: resume.views,
              status: resume.status,
            }
          : {
              workFormat,
              profession,
              desiredSalaryFrom,
              city: resume.city,
              experience: resume.experience,
              experienceDescription: resume.experienceDescription,
            };
      });
      return res.status(200).send({
        success: true,
        message: "OK",
        data: resumes,
      });
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/view/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const resumePool = Database.getRepository(Resume);
      const resume = await resumePool.findOne({ where: { id: req.params.id } });
      if (!resume) {
        return res.status(404).send({ success: false, message: "Resume not found" });
      }
      if (resume.status === ResumeStatus.ARCHIVED && !req.user.id === resume.specialistId) {
        return res.status(403).send({ success: false, mmessage: "Resume archived" });
      }
      if (req.user.id === resume.specialistId) {
        return res.status(200).send({ success: true, message: "OK", data: resume });
      }
      const userPool = Database.getRepository(User);
      const user = await userPool.findOne({ where: { id: resume.specialistId } });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      const compiledData = {
        user: {
          gender: user.gender,
          age: new Date().getFullYear() - new Date(user.birthDate).getFullYear(),
          city: user.city,
          updatedAt: user.updatedAt,
        },
        resume: {
          profession: resume.profession,
          experience: resume.experience,
          experienceDescription: resume.experienceDescription,
          skills: resume.skills,
          desiredSalaryFrom: resume.desiredSalaryFrom,
          city: resume.city,
          workFormat: resume.workFormat,
          educations: user.educations,
        },
      };
      return res.status(200).send({ success: true, message: "OK", data: compiledData });
    },
  );

  fastify.patch<{ Body: createBody; Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate, schema: createSchema },
    async (req, res) => {
      const resumePool = Database.getRepository(Resume);
      const resume = await resumePool.findOne({ where: { id: req.params.id } });
      if (!resume) {
        return res.status(404).send({ success: false, message: "Resume not found" });
      }

      const data = req.body;
      const update = {
        profession: data.profession ? data.profession : resume.profession,
        experience: data.experience ? data.experience : resume.experience,
        experienceDescription: data.experienceDescription,
        skills: data.skills,
        desiredSalaryFrom: data.desiredSalaryFrom,
        city: data.city ? data.city : resume.city,
        workFormat: data.workFormat ? data.workFormat : resume.workFormat,
        status: data.status ? data.status : resume.status,
      };

      Object.assign(resume, update);
      try {
        await resumePool.save(resume);
        return res.status(204).send({ success: true, message: "OK", data: resume });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const resumePool = Database.getRepository(Resume);
      const resume = await resumePool.findOne({ where: { id: req.params.id } });
      if (!resume) {
        return res.status(404).send({ success: false, message: "Resume not found" });
      }
      if (!req.user.id === resume.specialistId) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      try {
        const update = await resumePool.softDelete(req.params.id);
        return res.status(204).send({ success: true, message: "OK", data: update });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  // fastify.post("/filtersearch", { preHandler: fastify.authenticate }, async (req, res) => {
  //   const resumePool = Database.getRepository(Resume);
  // });
};
