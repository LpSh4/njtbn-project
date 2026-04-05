import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  DeleteDateColumn,
} from "typeorm";
import { Specialist } from "./User";

export enum ResumeWorkFormat {
  OFFICE = "office",
  REMOTE = "remote",
  HYBRID = "hybrid",
  OTHER = "other",
}

export enum ResumeStatus {
  ACTIVE = "active",
  HIDDEN = "hidden",
  ARCHIVED = "archived",
}

@Entity("resumes")
export class Resume {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "specialist_id" })
  specialistId!: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.resumes, { onDelete: "CASCADE" })
  // One employer can manage multiple vacancies, but one vacancy can have only one manager
  @JoinColumn({
    name: "specialist_id",
  })
  specialist!: Relation<Specialist>;

  @Column({
    // Profession, including title
    type: "varchar",
    length: 100,
    nullable: false,
  })
  profession!: string;

  @Column({ type: "text", nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  surname!: string;

  @Column({
    // Job expirience, in years
    type: "int",
    default: 0,
  })
  experience!: number;

  @Column({
    // Short description of job expirience
    name: "experience_description",
    type: "text",
    nullable: true,
  })
  experienceDescription?: string;

  @Column({
    // Array of skills of specialist
    type: "text",
    array: true,
    nullable: true,
    default: "{}",
  })
  skills?: string[];

  @Column({
    // Min salary
    name: "desired_salary_from",
    type: "int",
    default: 0,
  })
  desiredSalaryFrom!: number;

  @Column({
    // Preferred city
    type: "varchar",
    length: 100,
  })
  city!: string;

  @Column({
    // Strict enum of preferred work format
    name: "work_format",
    enum: ResumeWorkFormat,
  })
  workFormat!: ResumeWorkFormat;

  @Column({
    // Resume's current status
    type: "enum",
    enum: ResumeStatus,
    default: ResumeStatus.ACTIVE,
  })
  status!: ResumeStatus;

  @Column({
    type: "int",
    default: 0,
  })
  views!: number;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // TypeORM will manage this automatically
}
