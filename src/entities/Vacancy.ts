import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum WorkSchedule {
  SIX_ONE = "6/1",
  FIVE_TWO = "5/2",
  FOUR_FOUR = "4/4",
  FOUR_THREE = "4/3",
  FOUR_TWO = "4/2",
  THREE_THREE = "3/3",
  THREE_TWO = "3/2",
  TWO_TWO = "2/2",
  TWO_ONE = "2/1",
  ONE_THREE = "1/3",
  ONE_TWO = "1/2",
  WEEKENDS = "weekends",
  FLEXIBLE = "flexible",
  NEGOTIABLE = "negotiable",
}

export enum WorkingHours {
  H2 = "2",
  H3 = "3",
  H4 = "4",
  H5 = "5",
  H6 = "6",
  H7 = "7",
  H8 = "8",
  H9 = "9",
  H10 = "10",
  H11 = "11",
  H12 = "12",
  H24 = "24",
  NEGOTIABLE = "negotiable",
}

export enum WorkFormat {
  OFFICE = "Office",
  REMOTE = "Remote",
  HYBRID = "Hybrid",
  OTHER = "Other",
}

export enum VacancyStatus {
  OPEN = "Open",
  CLOSED = "Closed",
  PAUSED = "Paused",
}

@Entity("vacancies")
export class Vacancy {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    // Vacancy title (Should include the job title, etc)
    type: "varchar",
    length: 255,
    nullable: false,
  })
  title!: string;

  @Column({
    // Job specialization (Profession)
    type: "varchar",
    length: 150,
    nullable: true,
  })
  specialization?: string;

  @Column({
    // Preferred expirience (in years)
    type: "int",
    nullable: true,
  })
  experience?: number;

  @Column({
    // Work schedule (days)
    name: "work_schedule",
    enum: WorkSchedule,
    nullable: false,
    default: WorkSchedule.NEGOTIABLE,
  })
  workSchedule!: WorkSchedule;

  @Column({
    // Working hours (hours)
    name: "working_hours",
    enum: WorkingHours,
    nullable: false,
    default: WorkingHours.NEGOTIABLE,
  })
  workingHours!: WorkingHours;

  @Column({
    // Work format (Workplace for specialist)
    name: "work_format",
    enum: WorkFormat,
    nullable: true,
    default: WorkFormat.OFFICE,
  })
  workFormat!: WorkFormat;

  @Column({
    // Vacancy's city (For filtering)
    type: "varchar",
    length: 100,
    nullable: true,
  })
  city?: string;

  @Column({
    // Min salary
    name: "salary_from",
    type: "int",
    nullable: true,
  })
  salaryFrom?: number;

  @Column({
    // Max salary
    name: "salary_to",
    type: "int",
    nullable: true,
  })
  salaryTo?: number;

  @Column({
    // Job description, company description
    type: "text",
    nullable: true,
  })
  description?: string;

  @Column({
    // Array of required skills. Just for observation, for now
    name: "required_skills",
    type: "array",
    length: 255,
    nullable: true,
  })
  requiredSkills?: string[];

  @Column({
    // Vacancy status. Can be changed by employer
    enum: VacancyStatus,
    default: VacancyStatus.OPEN,
  })
  status!: VacancyStatus;

  @Column({
    // Date of when the vacancy is to be closed
    name: "closed_at",
    type: "date",
    nullable: true,
  })
  closedAt?: Date;

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
