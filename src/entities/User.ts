import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  TableInheritance,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  NOT_SPECIFIED = "notSpecified",
  OTHER = "other",
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

  @Column({ type: "varchar", length: 100, nullable: true }) //City, optional, check on server side
  city?: string;

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

@Entity()
export class Specialist extends User {
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
}

@Entity()
export class Employer extends User {
  @Column({
    // Array of educational levels, strictly enum, for filtering
    nullable: true,
    type: "array",
    default: [EducationLevel.SECONDARY_VOCATIONAL],
  })
  educations?: EducationLevel[];

  @Column({
    // User's status of job-searching
    default: ProfileStatus.INACTIVE,
  })
  status!: ProfileStatus;

  @Column({
    // Profile description
    type: "text",
    nullable: true,
  })
  description?: string;

  @Column({
    // Array of socials
    name: "social_links",
    type: "array",
    nullable: true,
    default: [],
  })
  socialLinks?: string[];

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
}
