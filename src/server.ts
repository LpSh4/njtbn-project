import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "./datasource";
import fastifyJwt from "@fastify/jwt";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";

const server = fastify({
  // trustProxy: true,
  logger: true,
});
console.log("Server started");

if (!process.env.JWT_KEY || !process.env.COOKIE_KEY) {
  throw new Error(".env missing crucial info");
}

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
});

server.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = ["http://localhost:3000", "https://ryban.ru"];
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
      return;
    }
    cb(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

server.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    req.user = await req.jwtVerify();
  } catch {
    return reply.status(401).send({ message: "Unauthorized" });
  }
});

server.register(require("./routes/users"), { prefix: "/api/users" });

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
