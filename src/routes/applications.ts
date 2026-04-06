import { FastifyInstance } from "fastify";
import { Vacancy, VacancyStatus } from "../entities/Vacancy";
import { Role, User } from "../entities/User";
import { Database } from "../datasource";
import { Application, ApplicationStatus } from "../entities/Application";
import { NotificationService } from "../services/NotificationService";

interface viewQuery {
  status: ApplicationStatus;
}

module.exports = (fastify: FastifyInstance) => {
  fastify.post<{ Params: { vacancyId: string } }>(
    "/apply/:vacancyId",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      if (req.user.role === Role.EMPLOYER) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const vacancyPool = Database.getRepository(Vacancy);
      const vacancy = await vacancyPool.findOne({ where: { id: req.params.vacancyId } });
      if (!vacancy) {
        return res.status(404).send({ success: false, message: "Vacancy not found" });
      }
      if ([VacancyStatus.CLOSED, VacancyStatus.PAUSED].includes(vacancy.status)) {
        return res.status(409).send({ success: false, message: "Invalid Vacancy Status" });
      }
      const applicantId = req.user.id;
      const userPool = Database.getRepository(User);
      const user = await userPool.findOne({ where: { id: applicantId } });
      if (!user) {
        return res.status(404).send({ success: false, message: "Specialist not found" });
      }
      const employerId = vacancy.managerId;
      if (!(await userPool.findOne({ where: { id: employerId } }))) {
        return res.status(404).send({ success: false, message: "User not found" });
      }
      const applicationPool = Database.getRepository(Application);
      if (
        await applicationPool.findOne({
          where: { applicantId: req.user.id, vacancyId: req.params.vacancyId },
        })
      ) {
        return res.status(409).send({ success: false, message: "Application already exists" });
      }
      const application = applicationPool.create({
        applicantId,
        employerId,
        vacancyId: vacancy.id,
      });

      try {
        await applicationPool.save(application);
        await NotificationService.notifyNewApplication(user.name, employerId);
        return res.status(201).send({ success: true, message: "Created", data: application });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    },
  );

  fastify.get<{ Params: { vacancyId: string } }>(
    "/view/:vacancyId",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const vacancyRepo = Database.getRepository(Vacancy);
      const vacancy = await vacancyRepo.findOne({
        where: { id: req.params.vacancyId },
      });
      if (!vacancy) {
        return res.status(404).send({ success: false, message: "Vacancy not found" });
      }
      if (req.user.id !== vacancy.managerId) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const applicationRepo = Database.getRepository(Application);
      const applications = await applicationRepo.find({
        where: { vacancyId: req.params.vacancyId },
        relations: ["applicant"],
      });

      if (applications.length === 0) {
        return res.status(404).send({ success: false, message: "No applications found" });
      }

      const data = applications.map((app: Application) => {
        const user = app.applicant;
        let age = null;

        if (user?.birthDate) {
          const birthYear = new Date(user.birthDate).getFullYear();
          age = new Date().getFullYear() - birthYear;
        }

        return {
          ...app,
          applicantName: user?.name ?? "Unknown",
          applicantSurname: user?.surname ?? "",
          applicantAge: age,
          applicant: undefined,
        };
      });
      return res.status(200).send({ success: true, message: "OK", data });
    },
  );

  fastify.get<{ Querystring: viewQuery }>(
    "/",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const applicationPool = Database.getRepository(Application);
      let data: any, applications: any;
      switch (req.user.role) {
        case Role.EMPLOYER:
          applications = await applicationPool.find({
            where: {
              employerId: req.user.id,
              status: req.query.status ? req.query.status : undefined,
            },
            relations: ["vacancy"],
          });
          data = applications.map((app: Application) => {
            const vacancy = app.vacancy;

            return {
              ...app,
              profession: vacancy.profession,
              workFormat: vacancy.workFormat,
              vacancy: undefined,
            };
          });
          return res.status(200).send({ success: true, message: "OK", data: data });
        case Role.SPECIALIST:
          applications = await applicationPool.find({
            where: { applicantId: req.user.id },
            relations: ["vacancy", "employer"],
            status: req.query.status ? req.query.status : undefined,
          });
          data = applications.map((app: Application) => {
            const vacancy = app.vacancy;
            const employer = app.employer;
            return {
              ...app,
              profession: vacancy.profession,
              workFormat: vacancy.workFormat,
              salaryFrom: vacancy.salaryFrom,
              salaryTo: vacancy.salaryTo,
              manager: employer.name,
              companyName: employer.companyName,
              vacancy: undefined,
              employer: undefined,
            };
          });
          return res.status(200).send({ success: true, message: "OK", data: data });
      }
      return res.status(500).send({ success: false, message: "Internal Server Error" });
    },
  );

  fastify.patch<{ Body: { status: ApplicationStatus; dueDate?: string }; Params: { id: string } }>(
    "/:id",
    {
      preHandler: fastify.authenticate,
      schema: {
        body: {
          type: "object",
          required: ["status"],
          properties: { status: { type: "string", enum: Object.values(ApplicationStatus) } },
        },
      },
    },
    async (req, res) => {
      if (req.user.role !== Role.EMPLOYER) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const applicationPool = Database.getRepository(Application);
      const application = await applicationPool.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!application) {
        return res.status(404).send({ success: false, message: "Not Found" });
      }
      if (application.employerId !== req.user.id) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      Object.assign(application, { status: req.body.status ? req.body.status : application.status });

      try {
        await applicationPool.save(application);
        await NotificationService.notifyApplicationStatusChange(
          application.applicantId,
          application.status,
          req.body.dueDate ? req.body.dueDate : undefined,
        );
        return res.status(200).send({ success: true, message: "OK", data: application });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      if (req.user.role === Role.EMPLOYER) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      const applicationPool = Database.getRepository(Application);
      const application = await applicationPool.findOne({
        where: { id: req.params.id },
      });
      if (!application) {
        return res.status(404).send({ success: false, message: "Not Found" });
      }
      if (req.user.id !== application.applicantId) {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
      try {
        await applicationPool.softDelete(application.id);
        return res.status(204).send({ success: true, message: "OK", data: application });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    },
  );
};
