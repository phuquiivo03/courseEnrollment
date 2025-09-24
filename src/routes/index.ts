import { Router } from "express";
import authRouter from "./auth.routes";
import healthRouter from "./health.route";
import courseRouter from "./course.routes";
import enrollmentRouter from "./enrollment.routes";
import studentRouter from "./student.route";

const router = Router();

// Health check
router.use("/health", healthRouter);

// Authentication routes
router.use("/auth", authRouter);

// Course routes
router.use("/courses", courseRouter);

// Enrollment routes
router.use("/enrollments", enrollmentRouter);

// Student routes
router.use("/students", studentRouter);
export default router;
