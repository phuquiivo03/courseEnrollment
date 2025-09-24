import { Request, Response, NextFunction } from "express";
import { enrollmentRepository } from "../repositories/enrollment.repository";
import { courseRepository } from "../repositories/course.repository";
import { EnrollmentService } from "../services/enrollment.service";
import type { CreateEnrollmentDto, EnrollmentDto } from "../dto/enrollment";
import { ERROR_MESSAGES } from "../constants/errors";

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const enrollmentService = new EnrollmentService(enrollmentRepository as any);

export const createEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentEmail, courseId }: CreateEnrollmentDto = req.body;
    // Ensure course exists
    const course = await courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: ERROR_MESSAGES.COURSE_NOT_FOUND });
    }

    const enrollment = await enrollmentService.createEnrollment(
      studentEmail,
      courseId
    );

    const enrollmentDto: EnrollmentDto = {
      id: enrollment.id,
      studentEmail: enrollment.studentEmail,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
    };

    res.status(201).json({
      success: true,
      data: enrollmentDto,
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const enrollments = await enrollmentRepository.findMany({
      where: { studentEmail: email },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            createdAt: true,
          },
        },
      },
      pagination: { page: Number(page), limit: Number(limit) },
      orderBy: { enrolledAt: "desc" as const },
    });

    // Transform the data to include course information
    const transformedData = enrollments.data.map((enrollment: any) => ({
      id: enrollment.id,
      studentEmail: enrollment.studentEmail,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course,
    }));

    res.json({
      success: true,
      data: transformedData,
      pagination: enrollments.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, studentEmail, courseId } = req.query;

    const where: any = {};

    if (studentEmail) {
      where.studentEmail = studentEmail;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    const options = {
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            createdAt: true,
          },
        },
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
      orderBy: { enrolledAt: "desc" as const },
    };

    const result = await enrollmentRepository.findMany(options);

    // Transform the data
    const transformedData = result.data.map((enrollment: any) => ({
      id: enrollment.id,
      studentEmail: enrollment.studentEmail,
      courseId: enrollment.courseId,
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course,
    }));

    res.json({
      success: true,
      data: transformedData,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
