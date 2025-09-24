import jwt from "jsonwebtoken";
import { config } from "../../config";

export function generateTestToken(payload: Record<string, any> = {}) {
  const secret = config.auth.secret || "test-secret";
  const base = { id: "test-user", role: "USER", ...payload };
  return jwt.sign(base, secret, { expiresIn: "1h" });
}
