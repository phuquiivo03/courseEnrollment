import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";
import { errorMiddleware } from "./middleware/error";
import { setupSwagger } from "./swagger";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  setupSwagger(app);

  app.use("/api", router);
  app.use(errorMiddleware);
  return app;
}

const app = createApp();
export default app;
