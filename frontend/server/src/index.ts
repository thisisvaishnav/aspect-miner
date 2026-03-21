import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze.js";
import dashboardRouter from "./routes/dashboard.js";
import aiRouter from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5177" }));
app.use(express.json());

app.use("/api/analyze", analyzeRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[AspectMiner API] Running on http://localhost:${PORT}`);
});
