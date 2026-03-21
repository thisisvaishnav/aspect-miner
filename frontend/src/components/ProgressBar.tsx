type ProgressBarProps = {
  label: string;
  positive: number;
  negative: number;
  max: number;
};

const ProgressBar = ({ label, positive, negative, max }: ProgressBarProps) => {
  const total = positive + negative;
  const posPct = total > 0 ? (positive / total) * 100 : 0;
  const negPct = total > 0 ? (negative / total) * 100 : 0;
  const widthPct = (total / max) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-slate-700 capitalize">{label}</span>
        <span className="text-slate-500">{total} mentions</span>
      </div>
      <div
        className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex"
        role="progressbar"
        aria-label={`${label}: ${positive} positive, ${negative} negative`}
        aria-valuenow={total}
        aria-valuemax={max}
      >
        <div style={{ width: `${widthPct}%` }} className="flex h-full">
          <div
            style={{ width: `${posPct}%` }}
            className="bg-emerald-500 h-full transition-all duration-500"
          />
          <div
            style={{ width: `${negPct}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
          />
        </div>
      </div>
      <div className="flex space-x-4 mt-1 text-xs text-slate-500">
        <span className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
          {positive} Positive
        </span>
        <span className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-rose-500 mr-1" />
          {negative} Negative
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
