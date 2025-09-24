import { z } from "zod";

export const difficultyEnum = z.enum(["Beginner", "Intermediate", "Advanced"]);

export const createCourseSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  difficulty: difficultyEnum,
});

export const listCourseQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  difficulty: difficultyEnum.optional(),
  search: z.string().optional(),
});
