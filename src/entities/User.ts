import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Relation,
  ChildEntity,
} from "typeorm";
import type { Vacancy } from "./Vacancy";
import type { Resume } from "./Resume";
import type { Application } from "./Application";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NOT_SPECIFIED = "notSpecified",
  OTHER = "other",
}

export enum Role {
  EMPLOYER = "employer",
  SPECIALIST = "specialist",
}

export enum ProfileStatus {
  SEARCHING = "searching",
  INACTIVE = "inactive",
  CONSIDERING = "considering",
  OPEN_TO_OFFERS = "openToOffers",
}

export enum EducationLevel {
  SECONDARY_VOCATIONAL = "SECONDARY_VOCATIONAL",
  BACHELOR = "BACHELOR",
  SPECIALIST = "SPECIALIST",
  MASTER = "MASTER",
  POSTGRADUATE = "POSTGRADUATE",
  DOCTORAL = "DOCTORAL",
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "role" } })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column() // Add this to make it accessible in code
  role!: Role;

  @Column() //Username
  name!: string;

  @Column() //Surname
  surname!: string;

  @Column({ unique: true }) //Email, x@x.x
  email!: string;

  @Column({ unique: true }) //Phone, 89xxxxxxxxx
  phone!: string;

  @Column({ nullable: false }) //Password, hashed
  password!: string;

  @Column({
    default: Gender.NOT_SPECIFIED, //Gender, autofilled as "not specified"
  })
  gender!: Gender;

  @Column({
    // Profile description
    type: "text",
    nullable: true,
  })
  description?: string;

  @Column({ type: "varchar", length: 100, nullable: true }) //City, optional, check on server side
  city?: string;

  @Column({
    // Array of social links
    name: "social_links",
    type: "text",
    array: true,
    nullable: true,
    default: "{}",
  })
  socialLinks?: string[];

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

@ChildEntity(Role.EMPLOYER)
export class Employer extends User {
  @Column({
    //Tax Identification Number, strict check before sending here
    type: "varchar",
    length: 12,
    nullable: false,
  })
  tin!: string;

  @Column({
    //Moderator/Admin verifies the account
    default: false,
  })
  verified!: boolean;

  @Column({
    // Manager's position, just exists in the profile
    name: "manager_position",
    type: "varchar",
    length: 150,
    nullable: true,
  })
  managerPosition?: string;

  @Column({
    // Manual entering company name
    name: "company_name",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  companyName?: string;

  @Column({
    // Link to company's website
    name: "company_website",
    type: "varchar",
    length: 255,
    nullable: true,
  })
  companyWebsite?: string;

  @OneToMany("Application", (application: Application) => application.employer)
  applications?: Relation<Application[]>;

  @OneToMany("Vacancy", (vacancy: Vacancy) => vacancy.manager)
  vacancies?: Relation<Vacancy[]>;
}

@ChildEntity(Role.SPECIALIST)
export class Specialist extends User {
  @Column({
    // Array of education levels, enums
    type: "enum",
    enum: EducationLevel,
    array: true,
    nullable: true,
    default: `{${EducationLevel.SECONDARY_VOCATIONAL}}`,
  })
  educations?: EducationLevel[];

  @Column({
    // User's status of job-searching
    default: ProfileStatus.INACTIVE,
  })
  status!: ProfileStatus;

  @Column({
    // Birthdate
    name: "birth_date",
    type: "date",
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    // User specifies if he has the Russian citizenship
    default: true,
  })
  citizenship!: boolean;

  @OneToMany("Application", (app: Application) => app.applicant)
  applications!: Relation<Application[]>;

  @OneToMany("Resume", (resume: Resume) => resume.specialist)
  resumes?: Relation<Resume[]>;
}
