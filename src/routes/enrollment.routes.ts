import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import {
  createEnrollment,
  getStudentEnrollments,
  getAllEnrollments,
} from "../controllers/enrollment.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createEnrollmentSchema,
  listByStudentParamsSchema,
  listEnrollmentQuerySchema,
} from "../schemas/enrollment.schema";

const router = Router();

// POST /enrollments - Create a new enrollment
router.post(
  "/",
  authMiddleware,
  validate({ body: createEnrollmentSchema }),
  (req: Request, res: Response, next: NextFunction) => {
    createEnrollment(req, res, next).catch(next);
  }
);

// GET /enrollments - Get all enrollments with optional filtering
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  getAllEnrollments(req, res, next).catch(next);
});

// GET /students/:email/enrollments - Get enrollments for a specific student
router.get(
  "/students/:email/enrollments",
  validate({ params: listByStudentParamsSchema }),
  (req: Request, res: Response, next: NextFunction) => {
    getStudentEnrollments(req, res, next).catch(next);
  }
);

export default router;
