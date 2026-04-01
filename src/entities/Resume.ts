import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
} from "typeorm";
import { Specialist } from "./User";

export enum ResumeWorkFormat {
  OFFICE = "Office",
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  OTHER = "Other",
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

  @Column({ name: "specialist_id", nullable: true })
  specialistId?: string | null;

  @ManyToOne(() => Specialist, (specialist) => specialist.resumes)
  // One employer can manage multiple vacancies, but one vacancy can have only one manager
  @JoinColumn({
    name: "specialist_id",
  })
  specialist?: Relation<Specialist>;

  @Column({
    // Profession, including title
    type: "varchar",
    length: 100,
    nullable: false,
  })
  profession!: string;

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
    nullable: true,
  })
  desiredSalaryFrom?: number;

  @Column({
    // Max salary
    name: "desired_salary_to",
    type: "int",
    nullable: true,
  })
  desiredSalaryTo?: number;

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
}
