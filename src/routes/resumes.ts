import { FastifyInstance } from "fastify";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Role } from "../entities/User";
import { Resume, ResumeStatus, ResumeWorkFormat } from "../entities/Resume";
import { NotificationService } from "../services/NotificationService";
import { PoolService } from "../services/PoolService";
import { ForbiddenError, NotFoundError } from "../services/ErrorService";
import { ResumeSearchQuery, SearchService } from "../services/SearchService";

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
    },
  },
};

const updateSchema = {
  body: {
    type: "object",
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

const searchSchema = {
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", default: 1, minimum: 1 },
      keywords: { type: "string" },
      city: { type: "string" },
      salaryFrom: { type: "integer" },
      salaryTo: { type: "integer" },
      expFrom: { type: "integer" },
      expTo: { type: "integer" },
      workFormat: {
        type: "string",
        enum: Object.values(ResumeWorkFormat),
      },
      sortBy: {
        type: "string",
        enum: ["least_popular", "most_popular", "least_paid", "most_paid", "fresh"],
        default: "fresh",
      },
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
}

interface updateBody {
  profession?: string;
  name?: string;
  surname?: string;
  experience?: number;
  experienceDescription?: string;
  skills?: string[];
  desiredSalaryFrom?: number;
  city?: string;
  workFormat?: ResumeWorkFormat;
  status?: ResumeStatus;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: createBody }>(
    "/create",
    { preHandler: fastify.authenticate, schema: createSchema },
    async (req, res) => {
      if (req.user.role === Role.EMPLOYER) throw new ForbiddenError();

      const userPool = PoolService.getUserPool();
      const user = await userPool.findOne({ where: { id: req.user.id } });
      if (!user) throw new NotFoundError("User not found");

      const resumePool = PoolService.getResumePool();
      const resume = resumePool.create({
        ...req.body,
        specialistId: req.user.id,
        name: req.body.name ?? user.name,
        surname: req.body.surname ?? user.surname,
        city: req.body.city ?? user.city,
      });
      await resumePool.save(resume);
      await NotificationService.notifyCreatedContent("Resume", resume.profession, req.user.id);
      return res.status(201).send({ success: true, message: "Resume created", data: resume });
    },
  );

  fastify.patch<{ Body: updateBody; Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const resumePool = PoolService.getResumePool();
      const resume = await resumePool.findOne({ where: { id: req.params.id } });

      if (!resume) throw new NotFoundError("Resume not found");
      if (!req.user.id === resume.specialistId) throw new ForbiddenError();

      Object.assign(resume, req.body);
      await resumePool.save(resume);
      return res.status(204).send({ success: true, message: "OK", data: resume });
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/viewprofile/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const userPool = PoolService.getUserPool();

      const user = await userPool.findOne({ where: { id: req.params.id } });
      if (!user) throw new NotFoundError("User not found");

      const resumePool = PoolService.getResumePool();
      let resumes = await resumePool.find({
        where: {
          specialistId: req.params.id,
          ...(req.user.id !== req.params.id ? { status: ResumeStatus.ACTIVE } : {}),
        },
      });

      if (!resumes.length) throw new NotFoundError("Resumes not found");

      resumes = resumes.map((resume: Resume) => {
        const { workFormat, profession, desiredSalaryFrom, id } = resume;

        return req.user.id === user.id
          ? {
              id,
              workFormat,
              profession,
              desiredSalaryFrom,
              createdAt: resume.createdAt,
              views: resume.views,
              status: resume.status,
              city: resume.city,
              experience: resume.experience,
            }
          : {
              id,
              workFormat,
              profession,
              desiredSalaryFrom,
              city: resume.city,
              experience: resume.experience,
              experienceDescription: resume.experienceDescription,
            };
      });
      return res.status(req.user.id === user.id ? 200 : 206).send({
        success: true,
        message: "OK",
        data: resumes,
      });
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const resumePool = PoolService.getResumePool();
      const resume = await resumePool.findOne({ where: { id: req.params.id } });
      if (!resume) throw new NotFoundError("Resume not found");
      if (resume.status === ResumeStatus.ARCHIVED && req.user.id !== resume.specialistId)
        throw new ForbiddenError("Resume archived");
      if (req.user.id === resume.specialistId) {
        return res.status(200).send({ success: true, message: "OK", data: resume });
      }
      const userPool = PoolService.getUserPool();
      const user = await userPool.findOne({ where: { id: resume.specialistId } });
      if (!user) throw new NotFoundError("User not found");
      await resumePool.increment({ id: resume.id }, "views", 1);
      const compiledData = {
        user: {
          id: user.id,
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
      return res.status(206).send({ success: true, message: "OK", data: compiledData });
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const resumePool = PoolService.getResumePool();

      const resume = await resumePool.findOne({ where: { id: req.params.id } });
      if (!resume) throw new NotFoundError("Resume not found");
      if (!req.user.id === resume.specialistId) throw new ForbiddenError();

      await resumePool.softDelete(req.params.id);
      return res.status(204).send();
    },
  );

  fastify.get<{ Querystring: ResumeSearchQuery }>(
    "/search",
    { preHandler: fastify.authenticate, schema: searchSchema },
    async (req, res) => {
      const result = await SearchService.ResumeSearch(req.query);
      return res.status(200).send({ success: true, ...result });
    },
  );
};
