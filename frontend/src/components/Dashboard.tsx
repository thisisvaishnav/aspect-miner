import { useState, useEffect } from "react";
import {
  MessageSquareText,
  ThumbsUp,
  AlertCircle,
  RefreshCcw,
  Sparkles,
  LineChart,
  Bot,
} from "lucide-react";
import type { DashboardEntry } from "../types";
import { fetchDashboardData, generateAiContent } from "../services/api";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then((data) => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
        setIsLoading(false);
      });
  }, []);

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const prompt = `Here is the aggregated sentiment data for our product aspects: ${JSON.stringify(
        dashboardData
      )}. Write a 2-paragraph executive summary highlighting the top strengths, top weaknesses, and give 2 actionable recommendations for the manufacturing or R&D team. Format the output with clear text without using markdown headers. Use simple bullet points if necessary.`;

      const insights = await generateAiContent(
        prompt,
        "You are an expert Product Manager and Data Analyst."
      );
      setAiInsights(insights);
    } catch {
      setAiInsights("Failed to generate insights. Please check your API key configuration.");
    }
    setIsGeneratingInsights(false);
  };

  const totalReviews = dashboardData.reduce((sum, d) => sum + d.positive + d.negative, 0);
  const totalPositive = dashboardData.reduce((sum, d) => sum + d.positive, 0);
  const overallPositivePct = totalReviews > 0 ? Math.round((totalPositive / totalReviews) * 100) : 0;

  const weakestAspect = dashboardData.reduce(
    (worst, d) => {
      const ratio = d.positive + d.negative > 0 ? d.positive / (d.positive + d.negative) : 1;
      return ratio < worst.ratio ? { aspect: d.aspect, ratio } : worst;
    },
    { aspect: "N/A", ratio: 1 }
  );

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm inline-block">
          {error}. Is the backend running on port 8000?
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Mentions Analyzed"
          value={totalReviews.toLocaleString()}
          icon={MessageSquareText}
          colorClass="bg-indigo-500"
        />
        <StatCard
          title="Overall Product Sentiment"
          value={`${overallPositivePct}% Positive`}
          icon={ThumbsUp}
          colorClass="bg-emerald-500"
        />
        <StatCard
          title="Critical Weakness"
          value={weakestAspect.aspect.charAt(0).toUpperCase() + weakestAspect.aspect.slice(1)}
          icon={AlertCircle}
          colorClass="bg-rose-500"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Product Aspect Ranking</h3>
          <p className="text-sm text-slate-500">
            Frequency of aspect mentions and their aggregated sentiment polarities.
          </p>
        </div>

        <div className="max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <RefreshCcw className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : (
            (() => {
              const maxMentions = Math.max(...dashboardData.map((d) => d.positive + d.negative));
              const sortedData = [...dashboardData].sort(
                (a, b) => b.positive + b.negative - (a.positive + a.negative)
              );
              return sortedData.map((data, idx) => (
                <ProgressBar
                  key={idx}
                  label={data.aspect}
                  positive={data.positive}
                  negative={data.negative}
                  max={maxMentions}
                />
              ));
            })()
          )}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl shadow-lg border border-indigo-800 p-1">
        <div className="bg-white rounded-lg p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
              AI Executive Insights
            </h3>
            <button
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center transition-colors disabled:opacity-70"
              aria-label="Generate AI insights report"
            >
              {isGeneratingInsights ? (
                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LineChart className="w-4 h-4 mr-2" />
              )}
              Generate Report
            </button>
          </div>

          {aiInsights ? (
            <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {aiInsights}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-8 text-center">
              <Bot className="w-12 h-12 mb-3 text-slate-300" />
              <p>
                Click "Generate Report" to have AI analyze the current aspect rankings
                <br />
                and suggest actionable R&D improvements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
