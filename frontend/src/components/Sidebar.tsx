import { useState, useEffect } from "react";
import { Cpu, MessageSquareText, BarChart3 } from "lucide-react";
import type { TabId } from "../types";
import { checkHealth } from "../services/api";

type SidebarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

type NavItem = {
  id: TabId;
  label: string;
  icon: typeof MessageSquareText;
};

const NAV_ITEMS: NavItem[] = [
  { id: "analyzer", label: "Live Analyzer", icon: MessageSquareText },
  { id: "dashboard", label: "Aggregate Dashboard", icon: BarChart3 },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col" aria-label="Main navigation">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center">
          <Cpu className="mr-2 text-indigo-400" />
          AspectMiner
        </h1>
        <p className="text-xs text-slate-500 mt-2">Product Review Analytics</p>
      </div>

      <nav className="flex-1 mt-6" aria-label="Primary">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-current={isActive ? "page" : undefined}
              tabIndex={0}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center text-xs text-slate-500">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              apiConnected ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          API Status: {apiConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
