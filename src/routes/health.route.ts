import { prisma } from "../db";
import { Router } from "express";

const router = Router();

router.get("/", async (_req, res) => {
  const now = await prisma.$queryRaw`select now()`;
  res.json({ ok: true, now });
});

export default router;
