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
} from "lucide-react";
import type { AnalysisResponse } from "../types";
import { analyzeReview, generateAiContent } from "../services/api";
import LoadingDots from "./LoadingDots";

const DEFAULT_REVIEW =
  "The camera is absolutely amazing and takes great photos, but the battery life is terrible and drains too fast. Also the price is very expensive.";

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
      const prompt = `A customer left this review: "${inputText}". Our aspect-mining system extracted these opinions: ${JSON.stringify(
        analysisResult.aspects
      )}. Draft a short, polite, professional, and empathetic response from our customer support team acknowledging their specific positive and negative points. Keep it concise.`;

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <MessageSquareText className="w-5 h-5 mr-2 text-indigo-500" />
          Input Review Text
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Paste a customer review below to test the NLP aspect extraction and sentiment polarity
          pipeline.
        </p>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4"
          placeholder="Type a product review here..."
          aria-label="Review text input"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !inputText.trim()}
          className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex justify-center items-center transition-colors disabled:opacity-70"
          aria-label="Analyze review"
        >
          {isAnalyzing ? (
            <>
              <RefreshCcw className="w-5 h-5 mr-2 animate-spin" /> Processing NLP Pipeline...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5 mr-2" /> Extract Aspects & Sentiment
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-indigo-500" />
          Extraction Results
        </h3>

        {error && (
          <div className="p-4 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {!analysisResult && !isAnalyzing && !error && (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
            <MessageSquareText className="w-8 h-8 mb-2 opacity-50" />
            <p>Enter text and click analyze to see results.</p>
          </div>
        )}

        {isAnalyzing && <LoadingDots message="Tokenizing and applying Lexicon rules..." />}

        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex gap-4 mb-6">
              <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Tokens Analyzed</p>
                <p className="text-xl font-bold text-slate-800">{analysisResult.tokens}</p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 flex-1">
                <p className="text-xs text-slate-500 uppercase font-semibold">Aspects Found</p>
                <p className="text-xl font-bold text-slate-800">{analysisResult.aspects.length}</p>
              </div>
            </div>

            {/* Aspect-Sentiment Pairs */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Aspect-Sentiment Pairs
              </h4>
              {analysisResult.aspects.length === 0 ? (
                <p className="text-sm text-slate-500 italic">
                  No targeted product aspects detected in this text.
                </p>
              ) : (
                analysisResult.aspects.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50"
                  >
                    <span className="font-semibold text-slate-800 capitalize flex items-center">
                      <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-500" />
                      {item.aspect}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${
                        item.polarity === "Positive"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.polarity === "Negative"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.polarity === "Positive" && <ThumbsUp className="w-3 h-3 mr-1" />}
                      {item.polarity === "Negative" && <ThumbsDown className="w-3 h-3 mr-1" />}
                      {item.polarity} (Score: {item.score})
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* AI Draft Reply */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                  AI Action
                </h4>
                <button
                  onClick={handleGenerateReply}
                  disabled={isGeneratingReply}
                  className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-1.5 px-3 rounded-md flex items-center transition-colors disabled:opacity-50"
                  aria-label="Draft AI support reply"
                >
                  {isGeneratingReply ? (
                    <RefreshCcw className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <PenTool className="w-3 h-3 mr-1" />
                  )}
                  Draft Support Reply
                </button>
              </div>

              {aiReply && (
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg text-sm text-purple-900 leading-relaxed whitespace-pre-wrap">
                  {aiReply}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveAnalyzer;
