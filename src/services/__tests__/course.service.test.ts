import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  CourseService,
  type CourseRepositoryPort,
} from "../../services/course.service";

function createRepoMock(): CourseRepositoryPort<any> {
  return {
    findMany: vi.fn(async (args: any) => ({
      data: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
    })),
    findOne: vi.fn(async () => null),
    create: vi.fn(async (data: any) => ({
      id: "1",
      createdAt: new Date(),
      ...data,
    })),
  } as unknown as CourseRepositoryPort<any>;
}

describe("CourseService", () => {
  let repo: CourseRepositoryPort<any>;
  let service: CourseService;

  beforeEach(() => {
    repo = createRepoMock();
    service = new CourseService(repo);
  });

  it("lists courses with pagination and filters", async () => {
    const spy = vi.spyOn(repo, "findMany");
    await service.listCourses({
      page: 2,
      limit: 5,
      difficulty: "Beginner",
      search: "js",
    });
    expect(spy).toHaveBeenCalledWith({
      where: {
        difficulty: "Beginner",
        OR: [
          { title: { contains: "js", mode: "insensitive" } },
          { description: { contains: "js", mode: "insensitive" } },
        ],
      },
      pagination: { page: 2, limit: 5 },
      orderBy: { createdAt: "desc" },
    });
  });

  it("throws on invalid difficulty", async () => {
    await expect(
      service.listCourses({ difficulty: "Hard" as any })
    ).rejects.toThrow("Invalid difficulty");
  });

  it("creates a course with valid data", async () => {
    const created = await service.createCourse({
      title: "T",
      description: "D",
      difficulty: "Beginner",
    });
    expect(created).toMatchObject({
      title: "T",
      description: "D",
      difficulty: "Beginner",
    });
  });

  it("throws if creating course with invalid difficulty", async () => {
    await expect(
      service.createCourse({
        title: "T",
        description: "D",
        difficulty: "Hard" as any,
      })
    ).rejects.toThrow();
  });
});
