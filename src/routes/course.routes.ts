import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  getAllCourses,
  createCourse,
  getCourseById,
} from "../controllers/course.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createCourseSchema,
  listCourseQuerySchema,
} from "../schemas/course.schema";

const router = Router();

// GET /courses - Get all courses with optional filtering and pagination
/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: List courses
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: difficulty
 *         schema: { type: string, enum: [Beginner, Intermediate, Advanced] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  getAllCourses(req, res, next).catch(next);
});

// POST /courses - Create a new course
/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a course
 *     tags:
 *       - Courses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, difficulty]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               difficulty: { type: string, enum: [Beginner, Intermediate, Advanced] }
 *     responses:
 *       201: { description: Created }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post(
  "/",
  authMiddleware,
  validate({ body: createCourseSchema }),
  (req: Request, res: Response, next: NextFunction) => {
    createCourse(req, res, next).catch(next);
  }
);

// GET /courses/:id - Get course by ID
/**
 * @openapi
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by id
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Success }
 *       404: { description: Not found }
 */
router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  getCourseById(req, res, next).catch(next);
});

export default router;
