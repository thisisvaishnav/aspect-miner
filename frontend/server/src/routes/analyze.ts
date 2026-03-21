import { Router, Request, Response } from "express";
import { analyzeReview } from "../services/nlp.js";
import { AnalyzeRequestBody } from "../types.js";

const router = Router();

router.post("/", (req: Request<object, object, AnalyzeRequestBody>, res: Response) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "Request body must include a non-empty 'text' field." });
    return;
  }

  const result = analyzeReview(text);
  res.json(result);
});

export default router;
