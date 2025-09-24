import type { Course } from "@prisma/client";
import type { AppResponse } from "../types/response";

export type ListCoursesParams = {
  page?: number;
  limit?: number;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  search?: string;
};

export interface CourseRepositoryPort<TCourse = Course> {
  findMany: (args: any) => Promise<AppResponse<TCourse[]>>;
  findOne: (args: any) => Promise<TCourse | null>;
  create: (data: Partial<TCourse>) => Promise<TCourse | null>;
}

export class CourseService {
  private readonly repo: CourseRepositoryPort<Course>;

  constructor(repo: CourseRepositoryPort<Course>) {
    this.repo = repo;
  }

  async listCourses(
    params: ListCoursesParams = {}
  ): Promise<AppResponse<Course[]>> {
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 10);

    const where: any = {};
    if (params.difficulty) {
      const valid = ["Beginner", "Intermediate", "Advanced"] as const;
      if (!(valid as readonly string[]).includes(params.difficulty)) {
        throw new Error(
          "Invalid difficulty. Allowed: Beginner, Intermediate, Advanced"
        );
      }
      where.difficulty = params.difficulty;
    }

    if (params.search) {
      const q = String(params.search).split('"').join("");
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    return this.repo.findMany({
      where,
      pagination: { page, limit },
      orderBy: { createdAt: "desc" as const },
    });
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.repo.findOne({ where: { id } });
  }

  async createCourse(data: {
    title: string;
    description: string;
    difficulty: Course["difficulty"];
  }): Promise<Course> {
    const { title, description, difficulty } = data;
    if (!title || !description || !difficulty) {
      throw new Error("Title, description, and difficulty are required");
    }
    const valid = ["Beginner", "Intermediate", "Advanced"] as const;
    if (!(valid as readonly string[]).includes(difficulty)) {
      throw new Error(
        "Difficulty must be one of: Beginner, Intermediate, Advanced"
      );
    }
    const created = await this.repo.create({ title, description, difficulty });
    if (!created) throw new Error("Failed to create course");
    return created;
  }
}
