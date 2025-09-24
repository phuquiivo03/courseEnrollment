import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      authenToken?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      res.status(401).json({ error: "UNAUTHORIZED" });
      return;
    }

    const secret = config.auth.secret;
    if (!secret) {
      res.status(500).json({ error: "JWT_SECRET not configured" });
      return;
    }

    try {
      const decoded = jwt.verify(token, secret) as any;
      // Support standard `exp` (seconds) or custom `expired` (ms)
      const expSeconds =
        typeof decoded?.exp === "number" ? decoded.exp : undefined;
      const expiredMs =
        typeof decoded?.expired === "number" ? decoded.expired : undefined;
      const nowMs = Date.now();
      if (
        (expSeconds && nowMs / 1000 > expSeconds) ||
        (expiredMs && nowMs > expiredMs)
      ) {
        res.status(401).json({ error: "TOKEN_EXPIRED" });
        return;
      }
      req.authenToken = token;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "TOKEN_INVALID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
