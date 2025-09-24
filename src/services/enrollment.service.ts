import type { Enrollment } from "@prisma/client";
import type { AppResponse } from "../types/response";
import { ERROR_MESSAGES } from "../constants/errors";

export interface EnrollmentRepositoryPort<TEnrollment = Enrollment> {
  findMany: (args: any) => Promise<AppResponse<TEnrollment[]>>;
  findOne: (args: any) => Promise<TEnrollment | null>;
  create: (data: Partial<TEnrollment>) => Promise<TEnrollment | null>;
}

export class EnrollmentService {
  private readonly repo: EnrollmentRepositoryPort<Enrollment>;

  constructor(repo: EnrollmentRepositoryPort<Enrollment>) {
    this.repo = repo;
  }

  async createEnrollment(
    studentEmail: string,
    courseId: string
  ): Promise<Enrollment> {
    if (!studentEmail || !courseId) {
      throw Object.assign(
        new Error(ERROR_MESSAGES.REQUIRED_STUDENT_AND_COURSE),
        { status: 400 }
      );
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isValidEmail.test(studentEmail)) {
      throw Object.assign(new Error(ERROR_MESSAGES.INVALID_EMAIL), {
        status: 400,
      });
    }

    // Optionally check duplicates here if needed by repo API
    const existing = await this.repo.findMany({
      where: { studentEmail, courseId },
      pagination: { page: 1, limit: 1 },
    });
    if (existing.data.length > 0) {
      throw Object.assign(new Error(ERROR_MESSAGES.STUDENT_CONFLICT), {
        status: 409,
      });
    }

    const created = await this.repo.create({ studentEmail, courseId });
    if (!created) {
      throw Object.assign(new Error(ERROR_MESSAGES.ENROLLMENT_CREATE_FAILED), {
        status: 500,
      });
    }
    return created;
  }

  async listByStudent(email: string, page = 1, limit = 10) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw Object.assign(new Error(ERROR_MESSAGES.INVALID_EMAIL), {
        status: 400,
      });
    }
    return this.repo.findMany({
      where: { studentEmail: email },
      pagination: { page, limit },
      orderBy: { enrolledAt: "desc" },
    });
  }
}
