import { Database } from "../datasource";
import { Employer, Role, Specialist, User } from "../entities/User";
import { Application } from "../entities/Application";
import { Resume } from "../entities/Resume";
import { Vacancy } from "../entities/Vacancy";

export class PoolService {
  static getUserPool(role?: Role) {
    switch (role) {
      case Role.EMPLOYER:
        return Database.getRepository(Employer);
      case Role.SPECIALIST:
        return Database.getRepository(Specialist);
      default:
        return Database.getRepository(User);
    }
  }

  static getApplicationPool() {
    return Database.getRepository(Application);
  }

  static getResumePool() {
    return Database.getRepository(Resume);
  }

  static getVacancyPool() {
    return Database.getRepository(Vacancy);
  }
}
