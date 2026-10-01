export type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

export type Product = {
  id: string;
  name: string;
  market: Market;
  price: number;
  cost: number;
  status: "research" | "approved" | "rejected";
};

export type Campaign = {
  id: string;
  product: string;
  market: Market;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  revenue: number;
};

export type Order = {
  id: string;
  product: string;
  customer: string;
  country: string;
  amount: number;
  supplier: string;
  status: string;
};

export type AutomationSettings = {
  simulationMode: boolean;
  realPurchasesEnabled: boolean;
  realAdsEnabled: boolean;
  automaticPaymentsEnabled: boolean;
  automaticWithdrawalsEnabled: boolean;
};

export type AutopilotState = {
  products: Product[];
  campaigns: Campaign[];
  orders: Order[];
  automation: AutomationSettings;
};

export const initialAutopilotState: AutopilotState = {
  products: [],
  campaigns: [],
  orders: [],
  automation: {
    simulationMode: true,
    realPurchasesEnabled: false,
    realAdsEnabled: false,
    automaticPaymentsEnabled: false,
    automaticWithdrawalsEnabled: false,
  },
};

export function calculateMetrics(state: AutopilotState) {
  const revenue = state.campaigns.reduce(
    (total, campaign) => total + campaign.revenue,
    0
  );

  const ads = state.campaigns.reduce(
    (total, campaign) => total + campaign.spend,
    0
  );

  const costs = ads;

  const profit = revenue - costs;

  const roas = ads > 0 ? revenue / ads : 0;

  return {
    revenue,
    costs,
    profit,
    roas,
  };
}