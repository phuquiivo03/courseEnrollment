import { getStudentEnrollments } from "../controllers/enrollment.controller";
import { prisma } from "../db";
import { Router } from "express";

const router = Router();

router.get("/:email/enrollments", (req, res, next) => {
  getStudentEnrollments(req, res, next).catch(next);
});

export default router;
