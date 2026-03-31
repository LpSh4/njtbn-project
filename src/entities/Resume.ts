import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";

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
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id: string;

  @Column({ name: "specialist_id", type: "bigint", nullable: false })
  specialistId: string;

  @ManyToOne(() => SpecialistProfile)
  @JoinColumn({ name: "specialist_id" })
  specialist: SpecialistProfile;

  @Column({ type: "varchar", length: 255, nullable: false })
  title: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  profession: string;

  @Column({ type: "int", default: 0 })
  experience: number;

  @Column({
    name: "experience_description",
    type: "text",
    nullable: true,
  })
  experienceDescription?: string;

  @Column({
    name: "short_description",
    type: "text",
    nullable: true,
  })
  shortDescription?: string;

  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
  })
  skills?: string;

  @Column({ name: "desired_salary_from", type: "int", nullable: true })
  desiredSalaryFrom?: number;

  @Column({ name: "desired_salary_to", type: "int", nullable: true })
  desiredSalaryTo?: number;

  @Column({ type: "varchar", length: 100, nullable: true })
  city?: string;

  @Column({
    name: "work_format",
    type: "enum",
    enum: ResumeWorkFormat,
    nullable: true,
  })
  workFormat?: ResumeWorkFormat;

  @Column({
    type: "enum",
    enum: ResumeStatus,
    default: ResumeStatus.ACTIVE,
  })
  status: ResumeStatus;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
