import { execSync } from "node:child_process";

export function setupTestDatabase() {
  process.env.AUTH_SECRET = "test-secret";

  try {
    execSync("npx prisma generate", { stdio: "inherit" });
    execSync("npx prisma db push", { stdio: "inherit" });
  } catch (e) {
    console.error("Failed to setup test database", e);
    throw e;
  }
}
