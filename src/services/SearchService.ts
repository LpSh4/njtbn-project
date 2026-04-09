import { ResumeStatus, ResumeWorkFormat } from "../entities/Resume";
import { Brackets } from "typeorm";
import { PoolService } from "./PoolService";
import { VacancyStatus, WorkFormat } from "../entities/Vacancy";

export interface ResumeSearchQuery {
  page: number;
  keywords?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  expFrom?: number;
  expTo?: number;
  workFormat?: ResumeWorkFormat;
  sortBy: "least_popular" | "most_popular" | "least_paid" | "most_paid" | "fresh";
}

export interface VacancySearchQuery {
  page: number;
  keywords?: string;
  city?: string;
  salaryFrom?: number;
  salaryTo?: number;
  expFrom?: number;
  expTo?: number;
  workFormat?: WorkFormat;
  workSchedule?: string;
  workingHours?: string;
  sortBy: "least_popular" | "most_popular" | "least_paid" | "most_paid" | "fresh";
}

export class SearchService {
  static async ResumeSearch(query: ResumeSearchQuery) {
    const limit = 7;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const qb = PoolService.getResumePool()
      .createQueryBuilder("resume")
      .where("resume.status = :st", { st: ResumeStatus.ACTIVE });

    if (query.workFormat) {
      qb.andWhere("resume.workFormat = :wf", { wf: query.workFormat });
    }

    if (query.keywords) {
      const words = query.keywords.split(/\s+/).filter(Boolean);
      qb.andWhere(
        new Brackets((sub) => {
          words.forEach((word, i) => {
            const p = `%${word}%`;
            sub
              .orWhere(`resume.profession ILIKE :w${i}`, { [`w${i}`]: p })
              .orWhere(`resume.experienceDescription ILIKE :w${i}`, { [`w${i}`]: p });
          });
        }),
      );
    }

    if (query.city) {
      qb.andWhere("resume.city ILIKE :city", { city: `%${query.city}%` });
    }

    if (query.salaryFrom) {
      qb.andWhere("resume.desired_salary_from >= :sf", { sf: query.salaryFrom });
    }
    if (query.salaryTo) {
      qb.andWhere("resume.desired_salary_from <= :st", { st: query.salaryTo });
    }

    if (query.expFrom) {
      qb.andWhere("resume.experience >= :ef", { ef: query.expFrom });
    }
    if (query.expTo) {
      qb.andWhere("resume.experience <= :et", { et: query.expTo });
    }

    const orderMap: Record<ResumeSearchQuery["sortBy"], { col: string; dir: "ASC" | "DESC" }> = {
      most_popular: { col: "resume.views", dir: "DESC" },
      least_popular: { col: "resume.views", dir: "ASC" },
      most_paid: { col: "resume.desired_salary_from", dir: "DESC" },
      least_paid: { col: "resume.desired_salary_from", dir: "ASC" },
      fresh: { col: "resume.createdAt", dir: "DESC" },
    };

    const sort = orderMap[query.sortBy] || orderMap.fresh;
    qb.orderBy(sort.col, sort.dir);

    const [results, total] = await qb.take(limit).skip(skip).getManyAndCount();

    return {
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit) || 0,
      },
      data: results,
    };
  }

  static async VacancySearch(query: VacancySearchQuery) {
    const limit = 7;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const qb = PoolService.getVacancyPool()
      .createQueryBuilder("vacancy")
      .where("vacancy.status = :st", { st: VacancyStatus.OPEN });

    if (query.keywords) {
      const words = query.keywords.split(/\s+/).filter(Boolean);
      qb.andWhere(
        new Brackets((sub) => {
          words.forEach((word, i) => {
            const p = `%${word}%`;
            sub
              .orWhere(`vacancy.profession ILIKE :w${i}`, { [`w${i}`]: p })
              .orWhere(`vacancy.description ILIKE :w${i}`, { [`w${i}`]: p });
          });
        }),
      );
    }

    if (query.city) {
      qb.andWhere("vacancy.city ILIKE :city", { city: `%${query.city}%` });
    }
    if (query.workFormat) {
      qb.andWhere("vacancy.workFormat = :wf", { wf: query.workFormat });
    }
    if (query.workSchedule) {
      qb.andWhere("vacancy.workSchedule = :ws", { ws: query.workSchedule });
    }
    if (query.workingHours) {
      qb.andWhere("vacancy.workingHours = :wh", { wh: query.workingHours });
    }

    if (query.salaryFrom) {
      qb.andWhere("vacancy.salary_from >= :sf", { sf: query.salaryFrom });
    }
    if (query.salaryTo) {
      qb.andWhere("vacancy.salary_to <= :st", { st: query.salaryTo });
    }
    if (query.expFrom) {
      qb.andWhere("vacancy.experience >= :ef", { ef: query.expFrom });
    }
    if (query.expTo) {
      qb.andWhere("vacancy.experience <= :et", { et: query.expTo });
    }

    const orderMap: Record<VacancySearchQuery["sortBy"], { col: string; dir: "ASC" | "DESC" }> = {
      most_popular: { col: "vacancy.views", dir: "DESC" },
      least_popular: { col: "vacancy.views", dir: "ASC" },
      most_paid: { col: "vacancy.salary_to", dir: "DESC" },
      least_paid: { col: "vacancy.salary_from", dir: "ASC" },
      fresh: { col: "vacancy.createdAt", dir: "DESC" },
    };

    const sort = orderMap[query.sortBy] || orderMap.fresh;
    qb.orderBy(sort.col, sort.dir);

    const [results, total] = await qb.take(limit).skip(skip).getManyAndCount();

    return {
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit) || 0,
      },
      data: results,
    };
  }
}
