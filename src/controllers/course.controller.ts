import { Request, Response, NextFunction } from "express";
import { courseRepository } from "../repositories/course.repository";
import { CourseService } from "../services/course.service";
import type { CreateCourseDto, CourseDto, Difficulty } from "../dto/course";
import { Course } from "@prisma/client";
import { PrismaFindManyOptions } from "../repositories/type";

const courseService = new CourseService(courseRepository as any);

export const getAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 10, difficulty, search } = req.query;
    const result = await courseService.listCourses({
      page: Number(page),
      limit: Number(limit),
      difficulty: difficulty as any,
      search: search as any,
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Get courses error:", error);
    next(error);
  }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, difficulty }: CreateCourseDto = req.body;
    const course = await courseService.createCourse({
      title,
      description,
      difficulty: difficulty as any,
    });

    const courseDto: CourseDto = {
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      createdAt: course.createdAt,
    };

    res.status(201).json({
      success: true,
      data: courseDto,
    });
  } catch (error) {
    
    next(error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    const courseDto: CourseDto = {
      id: course.id,
      title: course.title,
      description: course.description,
      difficulty: course.difficulty,
      createdAt: course.createdAt,
    };

    res.json({
      success: true,
      data: courseDto,
    });
  } catch (error) {
    next(error);
  }
};
