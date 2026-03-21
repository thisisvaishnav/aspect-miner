import type { AnalysisResponse, DashboardEntry } from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const analyzeReview = async (text: string): Promise<AnalysisResponse> => {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return handleResponse<AnalysisResponse>(response);
};

export const fetchDashboardData = async (): Promise<DashboardEntry[]> => {
  const response = await fetch(`${API_BASE}/api/dashboard`);
  return handleResponse<DashboardEntry[]>(response);
};

export const generateAiContent = async (
  prompt: string,
  systemInstruction: string
): Promise<string> => {
  const response = await fetch(`${API_BASE}/api/ai/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, systemInstruction }),
  });
  const data = await handleResponse<{ result: string }>(response);
  return data.result;
};

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await fetch(`${API_BASE}/api/health`);
  return handleResponse<{ status: string; timestamp: string }>(response);
};
