const DataSource = require("typeorm").DataSource;
import dotenv from "dotenv";
import { Resume } from "./entities/Resume";
import { Specialist, Employer, User } from "./entities/User";
import { Application } from "./entities/Application";
import { Vacancy } from "./entities/Vacancy";

dotenv.config();

export const Database = new DataSource({
  type: "postgres",
  host: process.env.PSQL_ADDRESS! || "localhost",
  port: Number(process.env.PSQL_PORT)! || 5432,
  username: process.env.PSQL_LOGIN! || "postgres",
  password: process.env.PSQL_PASSWORD! || "postgres",
  database: process.env.PSQL_DATABASE! || "postgres",
  entities: [User, Employer, Specialist, Vacancy, Resume, Application],
  synchronize: true,
  logging: false,
});
