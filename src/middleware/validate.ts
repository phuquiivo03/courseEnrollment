import { type Request, type Response, type NextFunction } from "express";
import type { ZodError, ZodIssue } from "zod";

type Schema = { parse: (input: unknown) => any };

export function validate(opts: {
  body?: Schema;
  query?: Schema;
  params?: Schema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (opts.body) {
        req.body = opts.body.parse(req.body) as any;
      }
      if (opts.query) {
        req.query = opts.query.parse(req.query) as any;
      }
      if (opts.params) {
        req.params = opts.params.parse(req.params) as any;
      }
      next();
    } catch (err) {
      const zerr = err as ZodError;
      res.status(400).json({
        success: false,
        error: "Validation error",
        details:
          zerr.issues?.map((e: ZodIssue) => ({
            path: e.path,
            message: e.message,
          })) || [],
      });
    }
  };
}
