import { FastifyInstance } from "fastify";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Role, User } from "../entities/User";
import { Database } from "../datasource";
import { Vacancy, VacancyStatus, WorkFormat, WorkingHours, WorkSchedule } from "../entities/Vacancy";
import { Not } from "typeorm";
import { NotificationService } from "../services/NotificationService";
import { PoolService } from "../services/PoolService";
import { ForbiddenError, NotFoundError } from "../services/ErrorService";
import { SearchService, VacancySearchQuery } from "../services/SearchService";

const createSchema = {
  body: {
    type: "object",
    required: [
      "profession",
      "workFormat",
      "workSchedule",
      "workingHours",
      "experience",
      "city",
      "deadLine",
      "requiredSkills",
    ],
    properties: {
      profession: { type: "string", minLength: 1 },
      workFormat: { type: "string", enum: Object.values(WorkFormat) },
      workSchedule: { type: "string", enum: Object.values(WorkSchedule) },
      workingHours: { type: "string", enum: Object.values(WorkingHours) },
      salaryFrom: { type: "number" },
      salaryTo: { type: "number" },
      experience: { type: "number", default: 0 },
      city: { type: "string", minLength: 1 },
      description: { type: "string", maxLength: 1000 },
      deadLine: { type: "string", format: "date" }, // Validates "YYYY-MM-DD"
      requiredSkills: { type: "array", items: { type: "string" } },
    },
  },
};

const updateSchema = {
  body: {
    type: "object",
    properties: {
      profession: { type: "string", minLength: 1 },
      workFormat: { type: "string", enum: Object.values(WorkFormat) },
      workSchedule: { type: "string", enum: Object.values(WorkSchedule) },
      workingHours: { type: "string", enum: Object.values(WorkingHours) },
      salaryFrom: { type: "number" },
      salaryTo: { type: "number" },
      experience: { type: "number", default: 0 },
      city: { type: "string", minLength: 1 },
      description: { type: "string", maxLength: 1000 },
      deadLine: { type: "string", format: "date" }, // Validates "YYYY-MM-DD"
      requiredSkills: { type: "array", items: { type: "string" } },
      status: { type: "string", enum: Object.values(VacancyStatus) },
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
      workFormat: { type: "string", enum: Object.values(WorkFormat) },
      workSchedule: { type: "string", enum: Object.values(WorkSchedule) },
      workingHours: { type: "string", enum: Object.values(WorkingHours) },
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
  workFormat: string;
  workSchedule: string;
  workingHours: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience: number;
  city: string;
  description?: string;
  deadLine?: string;
  requiredSkills: [];
}

interface updateBody {
  profession?: string;
  workFormat?: string;
  workSchedule?: string;
  workingHours?: string;
  salaryFrom?: number;
  salaryTo?: number;
  experience?: number;
  city?: string;
  description?: string;
  deadLine?: string;
  requiredSkills?: [];
  status?: VacancyStatus;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: createBody }>(
    "/create",
    { preHandler: fastify.authenticate, schema: createSchema },
    async (req, res) => {
      const vacancyPool = PoolService.getVacancyPool();

      if (req.user.role === Role.SPECIALIST) throw new ForbiddenError();

      const vacancy = vacancyPool.create({
        ...req.body,
        managerId: req.user.id,
        salaryFrom: req.body.salaryFrom ? req.body.salaryFrom : null,
        salaryTo: req.body.salaryTo ? req.body.salaryTo : null,
        description: req.body.description ?? "",
        requiredSkills: req.body.requiredSkills ? req.body.requiredSkills : [],
      });

      await vacancyPool.save(vacancy);
      await NotificationService.notifyCreatedContent("Vacancy", vacancy.profession, req.user.id);
      return res.status(201).send({ success: true, message: "OK", data: vacancy });
    },
  );

  fastify.patch<{ Params: { id: string }; Body: updateBody }>(
    "/:id",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const vacancyPool = PoolService.getVacancyPool();
      const vacancy = await vacancyPool.findOne({
        where: { id: req.params.id },
      });

      if (!vacancy) throw new NotFoundError("Vacancy not found");
      if (req.user.id !== vacancy.managerId) throw new ForbiddenError();

      Object.assign(vacancy, req.body);
      await vacancyPool.save(vacancy);
      return res.status(200).send({ success: true, message: "OK", data: vacancy });
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
      const vacancyPool = PoolService.getVacancyPool();
      let vacancies = await vacancyPool.find({
        where: {
          managerId: req.params.id,
          ...(req.user.id !== req.params.id ? { status: Not(VacancyStatus.CLOSED) } : {}),
        },
      });
      if (vacancies.length < 1) {
        return res.status(404).send({ success: false, message: "Vacancies not found" });
      }
      vacancies = vacancies.map((vacancy: Vacancy) => {
        const { id, profession, workFormat, city, salaryFrom, salaryTo } = vacancy;

        return req.user.id === user.id
          ? {
              id,
              profession,
              workFormat,
              city,
              salaryFrom,
              salaryTo,
              status: vacancy.status,
              views: vacancy.views,
              workSchedule: vacancy.workSchedule,
              workingHours: vacancy.workingHours,
              description: vacancy.description,
            }
          : {
              id,
              profession,
              workFormat,
              city,
              salaryFrom,
              salaryTo,
              workSchedule: vacancy.workSchedule,
              workingHours: vacancy.workingHours,
              description: vacancy.description,
            };
      });
      return res.status(req.user.id === user.id ? 200 : 206).send({
        success: true,
        message: "OK",
        data: vacancies,
      });
    },
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const vacancyPool = PoolService.getVacancyPool();
      const vacancy = await vacancyPool.findOne({ where: { id: req.params.id } });
      if (!vacancy) {
        return res.status(404).send({ success: false, message: "Vacancy not found" });
      }
      if (vacancy.status === VacancyStatus.CLOSED && req.user.id !== vacancy.managerId) {
        return res.status(403).send({ success: false, message: "Vacancy is closed" });
      }
      if (req.user.id === vacancy.managerId) {
        return res.status(200).send({ success: true, message: "OK", data: vacancy });
      }
      const userPool = Database.getRepository(User);
      const user = await userPool.findOne({ where: { id: vacancy.managerId } });
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      await vacancyPool.increment({ id: vacancy.id }, "views", 1);
      const compiledData = {
        profession: vacancy.profession,
        salaryFrom: vacancy.salaryFrom,
        salaryTo: vacancy.salaryTo,
        experience: vacancy.experience,
        workSchedule: vacancy.workSchedule,
        workingHours: vacancy.workingHours,
        workFormat: vacancy.workFormat,
        city: vacancy.city,
        requiredSkills: vacancy.requiredSkills,
        status: vacancy.status,
        companyName: user.companyName,
        companyWebsite: user.companyWebsite,
        phoneNumber: user.phoneNumber,
        id: user.id,
        name: user.name,
      };
      return res.status(206).send({ success: true, message: "OK", data: compiledData });
    },
  );

  fastify.get<{ Querystring: VacancySearchQuery }>(
    "/search",
    { schema: searchSchema },
    async (req, res) => {
      const results = await SearchService.VacancySearch(req.query);
      return res.status(200).send({ success: true, message: "OK", ...results });
    },
  );
};
