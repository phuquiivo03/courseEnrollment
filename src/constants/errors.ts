export const ERROR_MESSAGES = {
  STUDENT_CONFLICT: "Student is already enrolled in this course",
  COURSE_NOT_FOUND: "Course not found",
  ENROLLMENT_CREATE_FAILED: "Failed to create enrollment",
  INVALID_EMAIL: "Invalid email format",
  REQUIRED_STUDENT_AND_COURSE: "Student email and course ID are required",
  VALIDATION_ERROR: "Validation error",
  UNAUTHORIZED: "UNAUTHORIZED",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  INTERNAL_SERVER_ERROR: "Internal server error",
  INVALID_DIFFICULTY:
    "Invalid difficulty. Allowed: Beginner, Intermediate, Advanced",
  CREATE_COURSE_REQUIRED: "Title, description, and difficulty are required",
  CREATE_COURSE_FAILED: "Failed to create course",
  COURSE_DUPLICATE_TITLE: "A course with this title already exists",
} as const;

export const conflictErrors = [
  ERROR_MESSAGES.STUDENT_CONFLICT,
  ERROR_MESSAGES.COURSE_DUPLICATE_TITLE,
] as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
