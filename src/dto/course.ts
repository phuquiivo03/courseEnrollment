export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface CreateCourseDto {
  title: string;
  description: string;
  difficulty: Difficulty;
}

export interface CourseDto extends CreateCourseDto {
  id: string;
  createdAt: Date;
}
