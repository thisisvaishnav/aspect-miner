type LoadingDotsProps = {
  message?: string;
};

const LoadingDots = ({ message = "Processing..." }: LoadingDotsProps) => (
  <div className="h-48 flex flex-col items-center justify-center text-slate-500 space-y-4">
    <div className="flex space-x-2">
      <div
        className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default LoadingDots;
