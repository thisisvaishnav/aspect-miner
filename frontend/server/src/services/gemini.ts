const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const MAX_RETRIES = 5;
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000];

const generateWithGemini = async (
  prompt: string,
  systemInstruction: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    return "Gemini API key is not configured. Set GEMINI_API_KEY in your .env file.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };

  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = (await response.json()) as {
        candidates: { content: { parts: { text: string }[] } }[];
      };
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      if (retries === MAX_RETRIES) {
        return "Sorry, the AI service is currently unavailable. Please try again later.";
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[retries]));
      retries++;
    }
  }

  return "Unexpected error in AI generation.";
};

export { generateWithGemini };
