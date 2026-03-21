import { Router, Request, Response } from "express";
import { getDashboardData } from "../services/dashboard.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const data = getDashboardData();
  res.json(data);
});

export default router;
