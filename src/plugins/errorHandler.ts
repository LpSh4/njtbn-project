import fp from "fastify-plugin";
import { AppError } from "../services/ErrorService";
import { FastifyError, FastifyInstance } from "fastify";

module.exports = fp(async function errorPlugin(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: FastifyError, req, res) => {
    if (AppError.isAppError(error)) {
      return res.status(error.statusCode).send({
        success: false,
        message: error.message,
      });
    }

    if (error.validation) {
      return res.status(400).send({
        success: false,
        message: "Validation failed",
        errors: error.validation,
      });
    }

    fastify.log.error(error);
    res.status(error.statusCode || 500).send({
      success: false,
      message: error.message || "Internal Server Error",
    });
  });
});
