import { useState } from "react";
import type { TabId } from "./types";
import Sidebar from "./components/Sidebar";
import LiveAnalyzer from "./components/LiveAnalyzer";
import Dashboard from "./components/Dashboard";

const TITLES: Record<TabId, string> = {
  analyzer: "Live Aspect Analyzer",
  dashboard: "Product Health Dashboard",
};

const App = () => {
  const [activeTab, setActiveTab] = useState<TabId>("analyzer");

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-slate-800">{TITLES[activeTab]}</h2>
        </header>

        <main className="p-8 max-w-6xl mx-auto">
          {activeTab === "analyzer" && <LiveAnalyzer />}
          {activeTab === "dashboard" && <Dashboard />}
        </main>
      </div>
    </div>
  );
};

export default App;
