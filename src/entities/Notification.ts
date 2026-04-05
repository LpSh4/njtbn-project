import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";

export enum NotificationType {
  APPLICATION_NOTIFICATION = "application_notification",
  VACANCY_NOTIFICATION = "vacancy_notification",
  RESUME_NOTIFICATION = "resume_notification",
  SYSTEM_NOTIFICATION = "system_notification",
}

export enum NotificationStatus {
  PENDING = "pending",
  SENT = "sent",
  FAILED = "failed",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "sender_id", nullable: true })
  senderId?: string | null;

  @ManyToOne("User", "notificationsSent", { onDelete: "SET NULL" })
  @JoinColumn({ name: "sender_id" })
  sender?: Relation<User>;

  @Column({ name: "recipient_id", nullable: false })
  recipientId!: string;

  @ManyToOne("User", "notificationsReceived", { onDelete: "CASCADE" })
  @JoinColumn({ name: "recipient_id" })
  recipient!: Relation<User>;

  @Column({ type: "text" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string | null;

  @Column({ type: "text", enum: NotificationType })
  type!: NotificationType;

  @Column({ type: "text", enum: NotificationStatus, default: NotificationStatus.PENDING })
  status!: NotificationStatus;

  @Column({ name: "read_at", type: "timestamptz", nullable: true })
  readAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
