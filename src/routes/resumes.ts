import { FastifyInstance } from "fastify";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Role } from "../entities/User";
import { Database } from "../datasource";
import { Resume, ResumeStatus, ResumeWorkFormat } from "../entities/Resume";
import { Brackets } from "typeorm";
import { NotificationService } from "../services/NotificationService";
import { PoolService } from "../services/PoolService";
import { ForbiddenError, NotFoundError } from "../services/ErrorService";

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
        default: ResumeWorkFormat.OFFICE,
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

interface SearchQuery {
  page: number;
  keywords?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  expFrom?: number;
  expTo?: number;
  workFormat?: ResumeWorkFormat;
  sortBy: "least_popular" | "most_popular" | "least_paid" | "most_paid" | "fresh";
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

      if (resumes.length < 1) throw new NotFoundError("Resume not found");
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
      if (!resume) {
        return res.status(404).send({ success: false, message: "Resume not found" });
      }
      if (resume.status === ResumeStatus.ARCHIVED && req.user.id !== resume.specialistId) {
        return res.status(403).send({ success: false, mmessage: "Resume archived" });
      }
      if (req.user.id === resume.specialistId) {
        return res.status(200).send({ success: true, message: "OK", data: resume });
      }
      const userPool = PoolService.getUserPool();
      const user = await userPool.findOne({ where: { id: resume.specialistId } });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
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

  fastify.get<{ Querystring: SearchQuery }>(
    "/search",
    { preHandler: fastify.authenticate, schema: searchSchema },
    async (req, res) => {
      const { keywords, city, salaryFrom, salaryTo, expFrom, expTo, workFormat, sortBy } = req.query;

      const page = Number(req.query.page) || 1;
      const limit = 7;
      const skip = (page - 1) * limit;

      const query = Database.getRepository(Resume)
        .createQueryBuilder("resume")
        .where("resume.workFormat = :workFormat", { workFormat });

      if (keywords) {
        const words = keywords.split(/\s+/).filter(Boolean);
        query.andWhere(
          new Brackets((qb) => {
            words.forEach((word, index) => {
              const paramName = `word${index}`;
              const searchPattern = `%${word}%`;

              if (index === 0) {
                qb.where("resume.profession ILIKE :word0", { word0: searchPattern }).orWhere(
                  "resume.experienceDescription ILIKE :word0",
                  { word0: searchPattern },
                );
              } else {
                qb.orWhere(`resume.profession ILIKE :${paramName}`, {
                  [paramName]: searchPattern,
                }).orWhere(`resume.experienceDescription ILIKE :${paramName}`, {
                  [paramName]: searchPattern,
                });
              }
            });
          }),
        );
      }
      query.andWhere("resume.status = :st", { st: ResumeStatus.ACTIVE });
      if (city) {
        query.andWhere("resume.city ILIKE :city", { city: `%${city}%` });
      }
      if (salaryFrom) query.andWhere("resume.desired_salary_from >= :sFrom", { sFrom: salaryFrom });
      if (salaryTo) query.andWhere("resume.desired_salary_from <= :sTo", { sTo: salaryTo });
      if (expFrom) query.andWhere("resume.experience >= :eFrom", { eFrom: expFrom });
      if (expTo) query.andWhere("resume.experience <= :eTo", { eTo: expTo });

      switch (sortBy) {
        case "most_popular":
          query.orderBy("resume.views", "DESC");
          break;
        case "least_popular":
          query.orderBy("resume.views", "ASC");
          break;
        case "most_paid":
          query.orderBy("resume.desired_salary_from", "DESC");
          break;
        case "least_paid":
          query.orderBy("resume.desired_salary_from", "ASC");
          break;
        case "fresh":
        default:
          query.orderBy("resume.createdAt", "DESC");
          break;
      }

      try {
        const [results, total] = await query.take(limit).skip(skip).getManyAndCount();

        return res.status(200).send({
          success: true,
          message: "OK",
          meta: {
            total,
            page,
            lastPage: Math.ceil(total / limit),
          },
          data: results,
        });
      } catch (e) {
        console.log(e);
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );
};
