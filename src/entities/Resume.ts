import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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
    type: "array",
    length: 255,
    nullable: true,
    default: [],
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
