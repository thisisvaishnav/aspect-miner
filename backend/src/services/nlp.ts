import { AspectResult, AnalysisResponse, Polarity } from "../types";

const TARGET_ASPECTS = [
  "battery",
  "camera",
  "price",
  "performance",
  "design",
  "screen",
  "software",
];

const POSITIVE_WORDS = [
  "good",
  "great",
  "excellent",
  "amazing",
  "fast",
  "love",
  "long",
  "beautiful",
  "smooth",
  "best",
  "fantastic",
  "wonderful",
  "superb",
  "brilliant",
  "outstanding",
  "impressive",
  "sharp",
  "crisp",
  "bright",
  "clear",
];

const NEGATIVE_WORDS = [
  "bad",
  "terrible",
  "awful",
  "slow",
  "hate",
  "short",
  "poor",
  "expensive",
  "ugly",
  "worst",
  "lag",
  "laggy",
  "dim",
  "blurry",
  "cheap",
  "broken",
  "frustrating",
  "disappointing",
  "mediocre",
  "overpriced",
];

const NEGATION_WORDS = ["not", "no", "never", "neither", "hardly", "barely", "doesn't", "don't", "isn't", "wasn't"];

const analyzeReview = (text: string): AnalysisResponse => {
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  const aspectsFound: AspectResult[] = [];

  words.forEach((word, index) => {
    if (!TARGET_ASPECTS.includes(word)) return;
    if (aspectsFound.find((a) => a.aspect === word)) return;

    let sentimentScore = 0;
    const windowStart = Math.max(0, index - 4);
    const windowEnd = Math.min(words.length, index + 5);
    const window = words.slice(windowStart, windowEnd);

    window.forEach((w) => {
      if (POSITIVE_WORDS.includes(w)) sentimentScore += 1;
      if (NEGATIVE_WORDS.includes(w)) sentimentScore -= 1;
    });

    const hasNegation = window.some((w) => NEGATION_WORDS.includes(w));
    if (hasNegation) {
      sentimentScore *= -1;
    }

    let polarity: Polarity = "Neutral";
    if (sentimentScore > 0) polarity = "Positive";
    if (sentimentScore < 0) polarity = "Negative";

    aspectsFound.push({ aspect: word, polarity, score: sentimentScore });
  });

  return {
    original_text: text,
    tokens: words.length,
    aspects: aspectsFound,
  };
};

export { analyzeReview };
