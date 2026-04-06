import { FastifyInstance } from "fastify";
// noinspection ES6UnusedImports
import { fastifyCookie } from "@fastify/cookie";
import { Role, User } from "../entities/User";
import { Database } from "../datasource";
import { Vacancy, VacancyStatus, WorkFormat, WorkingHours, WorkSchedule } from "../entities/Vacancy";
import { Brackets, Not } from "typeorm";
import { NotificationService } from "../services/NotificationService";

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

interface SearchQuery {
  page: number;
  keywords?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  expFrom?: number;
  expTo?: number;
  workFormat?: WorkFormat;
  workSchedule?: string;
  workingHours?: string;
  sortBy: "least_popular" | "most_popular" | "least_paid" | "most_paid" | "fresh";
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: createBody }>(
    "/create",
    { preHandler: fastify.authenticate, schema: createSchema },
    async (req, res) => {
      const vacancyPool = Database.getRepository(Vacancy);
      const {
        profession,
        workFormat,
        workSchedule,
        workingHours,
        salaryFrom,
        salaryTo,
        experience,
        city,
        description,
        deadLine,
        requiredSkills,
      } = req.body;
      if (req.user.role === Role.SPECIALIST) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const vacancy = vacancyPool.create({
        managerId: req.user.id,
        profession,
        workFormat,
        workSchedule,
        workingHours,
        experience,
        salaryFrom: salaryFrom ? salaryFrom : null,
        salaryTo: salaryTo ? salaryTo : null,
        city,
        description: description ?? "",
        deadLine: deadLine,
        requiredSkills: requiredSkills ? requiredSkills : [],
      });

      try {
        await vacancyPool.save(vacancy);
        await NotificationService.notifyCreatedContent("Vacancy", vacancy.profession, req.user.id);
        return res.status(201).send({ success: true, message: "OK", data: vacancy });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  fastify.patch<{ Params: { id: string }; Body: updateBody }>(
    "/:id",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const vacancyPool = Database.getRepository(Vacancy);
      const vacancy = await vacancyPool.findOne({
        where: { id: req.params.id },
      });

      if (!vacancy) {
        return res.status(404).send({ success: false, message: "Not Found" });
      }
      if (req.user.id !== vacancy.managerId) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }

      const {
        profession,
        workFormat,
        workSchedule,
        workingHours,
        salaryFrom,
        salaryTo,
        experience,
        city,
        description,
        deadLine,
        requiredSkills,
        status,
      } = req.body;
      const update = {
        profession: profession ? profession : vacancy.profession,
        workFormat: workFormat ? workFormat : vacancy.workFormat,
        workSchedule: workSchedule ? workSchedule : vacancy.workSchedule,
        workingHours: workingHours ? workingHours : vacancy.workingHours,
        salaryFrom: salaryFrom ? salaryFrom : vacancy.salaryFrom,
        salaryTo: salaryTo ? salaryTo : vacancy.salaryTo,
        experience: experience ? experience : vacancy.experience,
        city: city ? city : vacancy.city,
        description: description ? description : vacancy.description,
        deadLine: deadLine ? deadLine : vacancy.deadLine,
        requiredSkills: requiredSkills ? requiredSkills : vacancy.requiredSkills,
        status: status ? status : vacancy.status,
      };

      Object.assign(vacancy, update);

      try {
        await vacancyPool.save(vacancy);
        return res.status(200).send({ success: true, message: "OK", data: vacancy });
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
      const vacancyPool = Database.getRepository(Vacancy);
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
      const vacancyPool = Database.getRepository(Vacancy);
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

  fastify.get<{ Querystring: SearchQuery }>("/search", { schema: searchSchema }, async (req, res) => {
    const {
      page,
      keywords,
      city,
      salaryFrom,
      salaryTo,
      expFrom,
      expTo,
      workFormat,
      workSchedule,
      workingHours,
      sortBy,
    } = req.query;

    const limit = 12;
    const skip = (Number(page) - 1) * limit;

    const vacancyPool = Database.getRepository(Vacancy);
    const query = vacancyPool
      .createQueryBuilder("vacancy")
      .where("vacancy.workFormat = :workFormat", { workFormat: workFormat || WorkFormat.OFFICE });

    if (keywords) {
      const words = keywords.split(/\s+/).filter(Boolean);
      query.andWhere(
        new Brackets((qb) => {
          words.forEach((word, index) => {
            const param = `word${index}`;
            const pattern = `%${word}%`;
            if (index === 0) {
              qb.where("vacancy.profession ILIKE :word0", { word0: pattern }).orWhere(
                "vacancy.description ILIKE :word0",
                { word0: pattern },
              );
            } else {
              qb.orWhere(`vacancy.profession ILIKE :${param}`, { [param]: pattern }).orWhere(
                `vacancy.description ILIKE :${param}`,
                { [param]: pattern },
              );
            }
          });
        }),
      );
    }
    query.andWhere("vacancy.status = :st", { st: VacancyStatus.OPEN });
    if (city) {
      query.andWhere("vacancy.city ILIKE :city", { city: `%${city}%` });
    }
    if (salaryFrom) query.andWhere("vacancy.salary_from >= :sFrom", { sFrom: salaryFrom });
    if (salaryTo) query.andWhere("vacancy.salary_to <= :sTo", { sTo: salaryTo });
    if (expFrom) query.andWhere("vacancy.experience >= :eFrom", { eFrom: expFrom });
    if (expTo) query.andWhere("vacancy.experience <= :eTo", { eTo: expTo });
    if (workFormat) query.andWhere("vacancy.work_format = :wf", { wf: workFormat });
    if (workSchedule) query.andWhere("vacancy.work_schedule = :ws", { ws: workSchedule });
    if (workingHours) query.andWhere("vacancy.working_hours = :wh", { wh: workingHours });

    switch (sortBy) {
      case "most_popular":
        query.orderBy("vacancy.views", "DESC");
        break;
      case "least_popular":
        query.orderBy("vacancy.views", "ASC");
        break;
      case "most_paid":
        query.orderBy("vacancy.salary_to", "DESC");
        break;
      case "least_paid":
        query.orderBy("vacancy.salary_from", "ASC");
        break;
      case "fresh":
      default:
        query.orderBy("vacancy.createdAt", "DESC");
        break;
    }

    try {
      const [results, total] = await query.take(limit).skip(skip).getManyAndCount();

      return res.status(200).send({
        success: true,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit) || 0,
        },
        data: results,
      });
    } catch (e) {
      fastify.log.error(e);
      return res.status(500).send({ success: false, message: "Internal server error" });
    }
  });
};
