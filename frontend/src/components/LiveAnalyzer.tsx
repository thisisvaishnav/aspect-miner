import { useState } from "react";
import {
  MessageSquareText,
  Cpu,
  Activity,
  RefreshCcw,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  PenTool,
  Hash,
  Layers,
  Lightbulb,
  Wand2,
  Quote,
  AlertCircle,
} from "lucide-react";
import type { AnalysisResponse } from "../types";
import { analyzeReview, generateAiContent } from "../services/api";
import LoadingDots from "./LoadingDots";

const DEFAULT_REVIEW =
  "The camera is absolutely amazing and takes great photos, but the battery life is terrible and drains too fast. Also the price is very expensive.";

const formatAspectLabel = (aspect: string) => {
  if (aspect === "overall_feedback") return "Overall impression";
  return aspect.replace(/_/g, " ");
};

const sentimentStyles = (polarity: string) => {
  if (polarity === "Positive") {
    return {
      border: "border-l-emerald-500",
      badge: "bg-emerald-50 text-emerald-800 ring-emerald-200/60",
      iconWrap: "bg-emerald-100 text-emerald-600",
    };
  }
  if (polarity === "Negative") {
    return {
      border: "border-l-rose-500",
      badge: "bg-rose-50 text-rose-800 ring-rose-200/60",
      iconWrap: "bg-rose-100 text-rose-600",
    };
  }
  return {
    border: "border-l-slate-400",
    badge: "bg-slate-100 text-slate-700 ring-slate-200/80",
    iconWrap: "bg-slate-200 text-slate-600",
  };
};

const LiveAnalyzer = () => {
  const [inputText, setInputText] = useState(DEFAULT_REVIEW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAiReply(null);
    setError(null);

    try {
      const result = await analyzeReview(inputText);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Is the backend running?");
    }

    setIsAnalyzing(false);
  };

  const handleGenerateReply = async () => {
    if (!analysisResult) return;

    setIsGeneratingReply(true);
    try {
      const aspectsJson = JSON.stringify(analysisResult.aspects);
      const prompt = `A customer left this review: "${inputText}".

Our aspect-mining system extracted these opinion labels (may be empty or include an "overall_feedback" row when no product aspect keywords matched): ${aspectsJson}.

Draft a short, polite, professional, empathetic reply from customer support.

Rules:
- If structured aspects are empty, still respond fully based only on the review wording.
- If the review is only positive or only negative, do not invent the opposite.
- Use exactly two parts separated by a blank line: first part thanks them and acknowledges what they said; second part is a brief closing (e.g. we're glad it helped, or we're here if they need anything). Keep each part to one or two sentences.`;

      const reply = await generateAiContent(prompt, "You are a professional customer support agent.");
      setAiReply(reply);
    } catch {
      setAiReply("Failed to generate reply. Please check your API key configuration.");
    }
    setIsGeneratingReply(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleLoadSample = () => {
    setInputText(DEFAULT_REVIEW);
    setAnalysisResult(null);
    setAiReply(null);
    setError(null);
  };

  const charCount = inputText.length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 px-5 py-5 sm:px-6 sm:py-6 shadow-sm">
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Paste any customer review below. We extract product aspects (like camera or battery) and
          sentiment, then you can optionally draft a support reply with AI.
        </p>
        <ol className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 text-xs font-medium text-slate-600">
          <li className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-slate-200/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
              1
            </span>
            Paste or type a review
          </li>
          <li className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-slate-200/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
              2
            </span>
            Run analysis
          </li>
          <li className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm ring-1 ring-slate-200/80">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
              3
            </span>
            Draft a reply (optional)
          </li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:items-start">
        {/* Input */}
        <section
          className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/40 ring-1 ring-slate-100"
          aria-labelledby="analyzer-input-heading"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h3
                id="analyzer-input-heading"
                className="text-lg font-semibold text-slate-900 flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <MessageSquareText className="h-5 w-5" aria-hidden />
                </span>
                Your review
              </h3>
              <p id="review-hint" className="mt-1.5 text-sm text-slate-500">
                Longer reviews may surface more aspects; short ones still get sentiment when possible.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 underline-offset-2 hover:underline rounded-md px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label="Load sample review text"
            >
              Try sample
            </button>
          </div>

          <label htmlFor="review-input" className="sr-only">
            Review text
          </label>
          <textarea
            id="review-input"
            value={inputText}
            onChange={handleInputChange}
            className="min-h-[11rem] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-shadow focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
            placeholder="Example: The speaker sounds great but the battery dies quickly…"
            aria-describedby="review-hint review-counter"
            spellCheck
          />
          <div
            id="review-counter"
            className="mt-2 flex justify-end text-xs text-slate-400 tabular-nums"
            aria-live="polite"
          >
            {charCount} characters
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputText.trim()}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200/40 disabled:pointer-events-none disabled:opacity-55 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label="Analyze review for aspects and sentiment"
          >
            {isAnalyzing ? (
              <>
                <RefreshCcw className="h-5 w-5 shrink-0 animate-spin" aria-hidden />
                Analyzing…
              </>
            ) : (
              <>
                <Activity className="h-5 w-5 shrink-0" aria-hidden />
                Analyze review
              </>
            )}
          </button>
        </section>

        {/* Results */}
        <section
          className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/40 ring-1 ring-slate-100"
          aria-labelledby="analyzer-results-heading"
        >
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Cpu className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 id="analyzer-results-heading" className="text-lg font-semibold text-slate-900">
                Results
              </h3>
              <p className="text-xs text-slate-500">Aspects and tone from your text</p>
            </div>
          </div>

          {error && (
            <div
              className="mb-4 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" aria-hidden />
              <p>{error}</p>
            </div>
          )}

          {!analysisResult && !isAnalyzing && !error && (
            <div className="flex min-h-[14rem] flex-col justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <Lightbulb className="h-7 w-7 text-amber-400" aria-hidden />
              </div>
              <p className="text-sm font-medium text-slate-700">Ready when you are</p>
              <p className="mt-1 text-sm text-slate-500">
                Add a review on the left, then tap <span className="font-medium text-slate-700">Analyze review</span>{" "}
                to see aspects and sentiment here.
              </p>
              <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left text-xs text-slate-600">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  Mentions like <em>camera</em>, <em>battery</em>, or <em>speaker</em> are highlighted
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  We also pick up overall tone when no keyword matches
                </li>
              </ul>
            </div>
          )}

          {isAnalyzing && (
            <div className="min-h-[14rem] rounded-xl bg-slate-50/80">
              <LoadingDots message="Reading your review and scoring sentiment…" />
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <Hash className="h-3.5 w-3.5 text-indigo-500" aria-hidden />
                    Words counted
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-slate-900">{analysisResult.tokens}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Token-style count</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <Layers className="h-3.5 w-3.5 text-violet-500" aria-hidden />
                    Aspects found
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-slate-900">
                    {analysisResult.aspects.length}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {analysisResult.aspects.length === 1 ? "One theme" : "Themes detected"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Quote className="h-3.5 w-3.5" aria-hidden />
                  What we detected
                </h4>
                {analysisResult.aspects.length === 0 ? (
                  <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
                    <p className="font-medium text-amber-900">No catalog aspects in this text</p>
                    <p className="mt-1 text-amber-800/90">
                      Try naming a feature (e.g. screen, battery) or use a word like <em>good</em> or{" "}
                      <em>terrible</em> for overall tone.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2.5" role="list">
                    {analysisResult.aspects.map((item, idx) => {
                      const s = sentimentStyles(item.polarity);
                      return (
                        <li
                          key={`${item.aspect}-${idx}`}
                          className={`flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between border-l-4 ${s.border}`}
                        >
                          <span className="flex items-center gap-2 font-medium text-slate-900 capitalize">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${s.iconWrap}`}>
                              <CheckCircle2 className="h-4 w-4" aria-hidden />
                            </span>
                            {formatAspectLabel(item.aspect)}
                          </span>
                          <span
                            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${s.badge}`}
                          >
                            {item.polarity === "Positive" && <ThumbsUp className="h-3.5 w-3.5" aria-hidden />}
                            {item.polarity === "Negative" && <ThumbsDown className="h-3.5 w-3.5" aria-hidden />}
                            {item.polarity}
                            <span className="font-normal opacity-80 tabular-nums">· score {item.score}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-violet-50/40 to-white p-5 ring-1 ring-violet-100/80">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Suggested reply</h4>
                      <p className="text-xs text-slate-500">
                        Uses Gemini when configured. Great for support drafts.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateReply}
                    disabled={isGeneratingReply}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-200/50 transition hover:bg-violet-700 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 sm:shrink-0"
                    aria-label="Generate AI draft support reply"
                  >
                    {isGeneratingReply ? (
                      <RefreshCcw className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Wand2 className="h-4 w-4" aria-hidden />
                    )}
                    {isGeneratingReply ? "Writing…" : "Draft reply"}
                  </button>
                </div>

                {!aiReply && !isGeneratingReply && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <PenTool className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    Your generated message will show up here.
                  </p>
                )}

                {isGeneratingReply && (
                  <p className="text-xs text-violet-700 flex items-center gap-2">
                    <RefreshCcw className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
                    Generating a polite two-part response…
                  </p>
                )}

                {aiReply && (
                  <div className="mt-3 rounded-xl border border-violet-200/80 bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-sm whitespace-pre-wrap">
                    {aiReply}
                  </div>
                )}
              </div>

              <p className="text-center text-[11px] text-slate-400">
                Analysis uses a fixed lexicon — results are indicative, not legal advice.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default LiveAnalyzer;
