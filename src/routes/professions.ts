import { FastifyInstance } from "fastify";
import { Profession, JobTitle } from "../entities/Professions";
import { Database } from "../datasource";
import { ConflictError, NotFoundError } from "../services/ErrorService";

const professionSchema = {
  body: {
    type: "object",
    required: ["profession"],
    properties: {
      profession: { type: "string", minLength: 1 },
    },
  },
};
const jobTitleSchema = {
  body: {
    type: "object",
    required: ["jobTitle"],
    properties: {
      jobTitle: { type: "string", minLength: 1 },
    },
  },
};

const professionPool = Database.getRepository(Profession);
const jobTitlePool = Database.getRepository(JobTitle);

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { profession: string } }>(
    "/profession",
    { schema: professionSchema },
    async (req, res) => {
      if (await professionPool.findOne({ where: { professionName: req.body.profession } }))
        throw new ConflictError("Profession already exists");

      const profession = professionPool.create({ professionName: req.body.profession });
      await professionPool.save(profession);
      return res.status(201).send({ success: true, message: "Profession created", data: profession });
    },
  );

  fastify.post<{
    Body: { jobTitle: string };
    Params: { id: string };
  }>("/jobtitle/:id", { schema: jobTitleSchema }, async (req, res) => {
    const professionPool = Database.getRepository(Profession);
    if (!(await professionPool.findOne({ where: { id: req.params.id } })))
      throw new NotFoundError("Profession not found");

    if (await jobTitlePool.findOne({ where: { titleName: req.body.jobTitle } })) {
      throw new ConflictError("Profession already exists");
    }

    const jobTitle = jobTitlePool.create({
      titleName: req.body.jobTitle,
      professionId: req.params.id,
    });

    await jobTitlePool.save(jobTitle);
    return res.status(201).send({ success: true, message: "Title created", data: jobTitle });
  });

  fastify.get("/professions", async (req, res) => {
    const professions = await professionPool.find();
    return res.status(200).send({
      success: true,
      message: "OK",
      data: professions,
    });
  });

  fastify.get<{ Params: { id: string } }>("/jobtitles/:id", async (req, res) => {
    if (!(await professionPool.findOne({ where: { id: req.params.id } }))) {
      throw new NotFoundError("Profession not found");
    }
    const jobTitles = await jobTitlePool.find({
      where: {
        professionId: req.params.id,
      },
    });
    return res.status(200).send({
      success: true,
      message: "OK",
      data: jobTitles,
    });
  });
};
