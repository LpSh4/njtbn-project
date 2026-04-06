// services/PoolService.ts
import { Database } from "../datasource";
import { Employer, Role, Specialist, User } from "../entities/User";

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
}
