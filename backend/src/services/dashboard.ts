import { DashboardEntry } from "../types";

const getDashboardData = (): DashboardEntry[] => {
  return [
    { aspect: "battery", positive: 145, negative: 32 },
    { aspect: "camera", positive: 210, negative: 15 },
    { aspect: "price", positive: 45, negative: 120 },
    { aspect: "performance", positive: 180, negative: 40 },
    { aspect: "design", positive: 195, negative: 20 },
    { aspect: "screen", positive: 160, negative: 25 },
    { aspect: "software", positive: 110, negative: 55 },
  ];
};

export { getDashboardData };
