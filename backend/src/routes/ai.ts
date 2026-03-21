import { Router, Request, Response } from "express";
import { generateWithGemini } from "../services/gemini";
import { AiRequestBody } from "../types";

const router = Router();

router.post("/generate", async (req: Request<{}, {}, AiRequestBody>, res: Response) => {
  const { prompt, systemInstruction } = req.body;

  if (!prompt || !systemInstruction) {
    res.status(400).json({ error: "'prompt' and 'systemInstruction' are required." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || "";
  const result = await generateWithGemini(prompt, systemInstruction, apiKey);
  res.json({ result });
});

export default router;
