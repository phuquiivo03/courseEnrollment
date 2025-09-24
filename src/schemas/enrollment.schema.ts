import { z } from "zod";

export const createEnrollmentSchema = z.object({
  studentEmail: z.string().email("Invalid email format"),
  courseId: z.string().min(1, "courseId is required"),
});

export const listByStudentParamsSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const listEnrollmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  studentEmail: z.string().email("Invalid email format").optional(),
  courseId: z.string().optional(),
});
