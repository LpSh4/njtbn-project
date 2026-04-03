import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Relation,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class Profession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", name: "profession_name", unique: true })
  professionName!: string;

  @OneToMany(() => JobTitle, (jobTitle) => jobTitle.profession)
  titles!: Relation<JobTitle[]>;

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
export class JobTitle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", name: "title_name", nullable: true })
  titleName!: string;

  @ManyToOne(() => Profession, (profession) => profession.titles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profession_id" })
  profession!: Relation<Profession>;

  @Column({ name: "profession_id" })
  professionId!: string;

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
