import { FastifyInstance } from "fastify";
import { Notification, NotificationStatus } from "../entities/Notification";
import { Database } from "../datasource";

const updateSchema = {
  body: {
    type: "object",
    properties: {
      status: { type: "string", enum: Object.values(NotificationStatus) },
      read: { type: "boolean" },
    },
  },
};

interface updateBody {
  status?: NotificationStatus | undefined;
  read?: boolean | undefined;
}

module.exports = async (fastify: FastifyInstance) => {
  fastify.get("/", { preHandler: fastify.authenticate }, async (req, res) => {
    const notifications = await Database.getRepository(Notification).find({
      where: { recipientId: req.user.id },
      order: { createdAt: "DESC" },
    });
    if (!notifications.length) {
      return res.status(404).send({ success: false, message: "No notifications found" });
    }
    res.status(200).send({ success: true, message: "OK", data: notifications });
  });

  fastify.patch<{ Params: { id: string }; Body: updateBody }>(
    "/:id",
    { preHandler: fastify.authenticate, schema: updateSchema },
    async (req, res) => {
      const notificationPool = Database.getRepository(Notification);
      const notification = await notificationPool.findOne({ where: { id: req.params.id } });
      if (!notification) return res.status(404).send({ success: false, message: "Not found" });
      if (notification.recipientId !== req.user.id)
        return res.status(403).send({ success: false, message: "Forbidden" });
      if (req.user.role) req.body.status = undefined;
      Object.assign(notification, {
        read: req.body.read ? Date.now() : notification.read,
        notificationStatus: req.body.status ? req.body.status : notification.status,
      });
      try {
        await notificationPool.save(notification);
        return res.status(200).send({ success: true, message: "OK", data: notification });
      } catch (e) {
        return res.status(500).send({ success: false, message: "Internal Server Error" });
      }
    },
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (req, res) => {
      const notificationPool = Database.getRepository(Notification);
      const deleted = await notificationPool.softDelete({
        id: req.params.id,
        recipientId: req.user.id,
      });

      if (deleted.affected === 0) {
        return res.status(404).send({ success: false, message: "Not found" });
      }

      return res.status(204).send();
    },
  );
};
