import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "./datasource";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";

//Swagger generating
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const server = fastify({
  trustProxy: true,
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();
console.log("Server started");

server.register(cors, {
  origin: "https://ryban.ru", // Match the frontend URL exactly
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
});

if (!process.env.JWT_KEY || !process.env.COOKIE_KEY) {
  throw new Error(".env missing crucial info");
}
// ---- Swagger docs generation
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Ryban API",
      description: "API Documentation for Ryban platform",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  staticCSP: true,
  transformStaticCSP: (header) => header,
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

server.register(helmet, {
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
});

server.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    req.user = await req.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
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
