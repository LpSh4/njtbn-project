import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { Employer, Specialist } from "./User";
import { Vacancy } from "./Vacancy";

export enum ApplicationStatus {
  CREATED = "created",
  INVITED = "invited",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

@Entity("applications")
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    // One user can have multiple applications
    name: "applicant_id",
  })
  applicantId!: string;

  @ManyToOne(() => Specialist, (specialist) => specialist.applications)
  @JoinColumn({ name: "applicant_id" })
  applicant!: Relation<Specialist>;

  @Column({
    // One employer can manage multiple applications
    name: "employer_id",
  })
  employerId!: string;

  @ManyToOne(() => Employer, (employer) => employer.applications)
  @JoinColumn({ name: "employer_id" })
  employer!: Relation<Employer>;

  @Column({
    // One vacancy can have multiple applications
    name: "vacancy_id",
  })
  vacancyId!: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications)
  @JoinColumn({ name: "vacancy_id" })
  vacancy!: Relation<Vacancy>;

  @Column({
    // On accepting, the user is invited to a chatroom, where he becomes aither invited then accepted, then rejected
    type: "enum",
    enum: ApplicationStatus,
    default: ApplicationStatus.CREATED,
  })
  status!: ApplicationStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date;
}
