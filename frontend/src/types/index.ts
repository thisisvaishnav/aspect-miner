export type Polarity = "Positive" | "Negative" | "Neutral";

export type AspectResult = {
  aspect: string;
  polarity: Polarity;
  score: number;
};

export type AnalysisResponse = {
  original_text: string;
  tokens: number;
  aspects: AspectResult[];
};

export type DashboardEntry = {
  aspect: string;
  positive: number;
  negative: number;
};

export type TabId = "analyzer" | "dashboard";
