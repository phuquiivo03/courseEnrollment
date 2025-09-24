import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { login, register } from "../controllers/auth.controller";

const router = Router();

// POST /auth/login
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next).catch(next);
});

// POST /auth/register
router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  register(req, res, next).catch(next);
});

export default router;
