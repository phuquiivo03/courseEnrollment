import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  EnrollmentService,
  type EnrollmentRepositoryPort,
} from "../../services/enrollment.service";

function createRepoMock(): EnrollmentRepositoryPort<any> {
  return {
    findMany: vi.fn(async (args: any) => ({
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    })),
    findOne: vi.fn(async () => null),
    create: vi.fn(async (data: any) => ({
      id: "1",
      enrolledAt: new Date(),
      ...data,
    })),
  } as unknown as EnrollmentRepositoryPort<any>;
}

describe("EnrollmentService", () => {
  let repo: EnrollmentRepositoryPort<any>;
  let service: EnrollmentService;

  beforeEach(() => {
    repo = createRepoMock();
    service = new EnrollmentService(repo);
  });

  it("creates an enrollment with valid inputs", async () => {
    const created = await service.createEnrollment(
      "student@example.com",
      "course1"
    );
    expect(created).toMatchObject({
      studentEmail: "student@example.com",
      courseId: "course1",
    });
  });

  it("rejects invalid email", async () => {
    await expect(
      service.createEnrollment("bad-email", "course1")
    ).rejects.toThrow("Invalid email format");
  });

  it("prevents duplicate enrollment", async () => {
    vi.spyOn(repo, "findMany").mockResolvedValueOnce({
      data: [{ id: "1" } as any],
      pagination: { total: 1, page: 1, limit: 1, totalPages: 1 },
    });
    await expect(
      service.createEnrollment("student@example.com", "course1")
    ).rejects.toThrow("Student is already enrolled");
  });

  it("lists by student with pagination", async () => {
    const spy = vi.spyOn(repo, "findMany");
    await service.listByStudent("student@example.com", 2, 5);
    expect(spy).toHaveBeenCalledWith({
      where: { studentEmail: "student@example.com" },
      pagination: { page: 2, limit: 5 },
      orderBy: { enrolledAt: "desc" },
    });
  });
});
