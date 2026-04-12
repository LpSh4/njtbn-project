import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "./datasource";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server = fastify({
  trustProxy: true,
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();
console.log("Server started");

if (!process.env.JWT_KEY || !process.env.COOKIE_KEY) {
  throw new Error(".env missing crucial info");
}

server.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    req.user = await req.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
});

server.register(require("./plugins/errorHandler"));
server.register(fastifyCookie, {
  secret: process.env.COOKIE_KEY,
});

server.register(fastifyJwt, {
  secret: process.env.JWT_KEY,
  cookie: {
    cookieName: "access_token",
    signed: true,
  },
});

server.register(cors, {
  origin: ["https://ryban.ru", "https://www.ryban.ru", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

server.register(helmet, {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: true,
});

server.register(require("./routes/users"), { prefix: "/api/users" });
server.register(require("./routes/professions"), { prefix: "/api/professions" });
server.register(require("./routes/resumes"), { prefix: "/api/resumes" });
server.register(require("./routes/vacancies"), { prefix: "/api/vacancies" });
server.register(require("./routes/applications"), { prefix: "/api/applications" });
server.register(require("./routes/notifications"), { prefix: "/api/notifications" });

const start = async () => {
  try {
    await Database.initialize();
    server.log.info("Database initialized");

    await server.listen({
      port: 3000,
      host: "0.0.0.0",
    });

    server.log.info("Server running on port 3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
