import { FastifyInstance } from "fastify";
import { Profession, JobTitle } from "../entities/Professions";
import { Database } from "../datasource";

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

interface professionBody {
  profession: string;
}

interface jobTitleBody {
  jobTitle: string;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: professionBody }>(
    "/profession",
    { schema: professionSchema },
    async (req, res) => {
      const professionPool = Database.getRepository(Profession);
      if (await professionPool.findOne({ where: { professionName: req.body.profession } })) {
        return res.status(409).send({ success: false, message: "Profession already exists" });
      }
      const profession = professionPool.create({ professionName: req.body.profession });
      try {
        await professionPool.save(profession);
        return res.status(201).send({ success: true, message: "Profession created", data: profession });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  fastify.post<{ Body: jobTitleBody; Params: { id: string } }>(
    "/jobtitle/:id",
    { schema: jobTitleSchema },
    async (req, res) => {
      const professionPool = Database.getRepository(Profession);
      if (!(await professionPool.findOne({ where: { id: req.params.id } }))) {
        return res.status(404).send({ success: false, message: "Profession not found" });
      }
      const jobTitlePool = Database.getRepository(JobTitle);
      if (await jobTitlePool.findOne({ where: { titleName: req.body.jobTitle } })) {
        return res.status(409).send({ success: false, message: "Title already exists" });
      }
      const jobTitle = jobTitlePool.create({
        titleName: req.body.jobTitle,
        professionId: req.params.id,
      });
      try {
        await jobTitlePool.save(jobTitle);
        return res.status(201).send({ success: true, message: "Title created", data: jobTitle });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal server error" });
      }
    },
  );

  fastify.get("/professions", async (req, res) => {
    const professionPool = Database.getRepository(Profession);
    const professions = await professionPool.find();
    if (professions.length === 0) {
      return res.status(404).send({ success: false, message: "No professions found" });
    }
    return res.status(200).send({
      success: true,
      message: "OK",
      data: professions,
    });
  });

  fastify.get<{ Params: { id: string } }>("/jobtitles/:id", async (req, res) => {
    const professionPool = Database.getRepository(Profession);
    if (!(await professionPool.findOne({ where: { id: req.params.id } }))) {
      return res.status(404).send({ success: false, message: "Profession not found" });
    }
    const jobTitlePool = Database.getRepository(JobTitle);
    try {
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
    } catch (e) {
      return res.status(500).send({ success: false, message: "Internal server error" });
    }
  });
};
