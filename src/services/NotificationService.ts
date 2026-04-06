import { Database } from "../datasource";
import { Notification, NotificationStatus, NotificationType } from "../entities/Notification";
import { ApplicationStatus } from "../entities/Application";

export class NotificationService {
  static async notifyNewApplication(applicantName: string, employerId: string) {
    return this.create({
      recipientId: employerId,
      title: "New Application Received",
      description: `${applicantName} has applied to your vacancy.`,
      type: NotificationType.VACANCY_NOTIFICATION,
    });
  }

  static async notifyApplicationStatusChange(recipientId: string, newStatus: string, dueDate?: string) {
    return this.create({
      recipientId,
      title: "Application Update",
      description: `${
        newStatus === ApplicationStatus.INVITED
          ? `Youve been invited to a Job Interview!${dueDate ? ` Due date: ${dueDate}` : ``}`
          : ` Your application has been ${newStatus}`
      }`,
      type: NotificationType.APPLICATION_NOTIFICATION,
    });
  }

  static async notifyCreatedContent(
    content: "Resume" | "Vacancy",
    contentName: string,
    recipientId: string,
  ) {
    return this.create({
      recipientId,
      title: `${content} created`,
      description: `Your ${contentName} ${content} has been created`,
      type: NotificationType.SYSTEM_NOTIFICATION,
    });
  }

  static async notifyValidationStatus(recipientId: string, validated: boolean) {
    return this.create({
      recipientId,
      title: "Verification update",
      description: `Your TIN verification has been ${validated ? "Completed" : "Revoked"}`,
      type: NotificationType.SYSTEM_NOTIFICATION,
    });
  }

  private static async create(data: {
    recipientId: string;
    senderId?: string | null;
    title: string;
    description?: string;
    type: NotificationType;
  }) {
    const repo = Database.getRepository(Notification);
    const notification = repo.create({
      ...data,
      status: NotificationStatus.PENDING,
      read: false,
    });
    return await repo.save(notification);
  }
}
