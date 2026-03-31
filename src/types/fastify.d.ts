import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    params: any;
    user: any;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload; // what you sign
    user: JwtPayload; // what you get in req.user
  }
}
