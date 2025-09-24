export interface CreateEnrollmentDto {
  studentEmail: string;
  courseId: string;
}

export interface EnrollmentDto extends CreateEnrollmentDto {
  id: string;
  enrolledAt: Date;
}
