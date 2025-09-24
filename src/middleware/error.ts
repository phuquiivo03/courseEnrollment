import { type Request, type Response, type NextFunction } from "express";
import { conflictErrors } from "../constants/errors";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Known Prisma errors
  if (err?.code === "P2002") {
    res.status(409).json({ success: false, error: "Unique constraint failed" });
    return;
  }
  if (err?.code === "P2025") {
    res.status(404).json({ success: false, error: "Record not found" });
    return;
  }

  if (conflictErrors.includes(err?.message)) {
    res.status(409).json({ success: false, error: err?.message });
    return;
  }

  const status = typeof err?.status === "number" ? err.status : 500;
  const message = err?.message || "Internal server error";

  res.status(status).json({ success: false, error: message });
}
