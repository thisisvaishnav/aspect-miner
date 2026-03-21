import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  colorClass: string;
};

const StatCard = ({ title, value, icon: Icon, colorClass }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h4 className="text-sm font-medium text-slate-500">{title}</h4>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default StatCard;
