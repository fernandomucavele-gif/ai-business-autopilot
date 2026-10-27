
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
  estimatedUnitCost?: number;
  supplier?: string;
  supplierCountry?: string;
  score: number;
  status: "research" | "approved" | "testing" | "active";
};

export type Campaign = {
  id: string;
  productId: string;
  market: Market;
  objective: "Vendas" | "Leads" | "Tráfego" | "Reconhecimento";
  dailyBudget: number;
  status: "simulation" | "ready" | "active";
};

export type Order = {
  id: string;
  productId: string;
  customerName: string;
  market: Market;
  amount: number;
  status:
    | "Novo"
    | "Pagamento pendente"
    | "Pago"
    | "Enviado ao fornecedor"
    | "Em trânsito"
    | "Entregue";
  estimatedDeliveryAt?: string;
  revisedDeliveryAt?: string;
  delayNotice?: string;
};

export type FinanceRecord = {
  id: string;
  type: "revenue" | "product_cost" | "ad_cost" | "shipping";
  amount: number;
  currency: string;
  description: string;
};

export type AutopilotState = {
  products: Product[];
  campaigns: Campaign[];
  orders: Order[];
  finance: FinanceRecord[];
  automation: {
    simulationMode: boolean;
    realPurchasesEnabled: boolean;
    realAdsEnabled: boolean;
    automaticPaymentsEnabled: boolean;
  };
};

export const initialAutopilotState: AutopilotState = {
  products: [],
  campaigns: [],
  orders: [],
  finance: [],
  automation: {
    simulationMode: true,
    realPurchasesEnabled: false,
    realAdsEnabled: false,
    automaticPaymentsEnabled: false,
  },
};

export function createProduct(
  name: string,
  market: Market,
  price: number,
  estimatedUnitCost?: number
): Product {
  return {
    id: `PROD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    market,
    price,
    estimatedUnitCost,
    score: 0,
    status: "research",
  };
}

export function createCampaign(
  productId: string,
  market: Market,
  objective: Campaign["objective"],
  dailyBudget: number
): Campaign {
  return {
    id: `CAMP-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    productId,
    market,
    objective,
    dailyBudget,
    status: "simulation",
  };
}

export function createOrder(
  productId: string,
  customerName: string,
  market: Market,
  amount: number
): Order {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 14);

  return {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    productId,
    customerName,
    market,
    amount,
    status: "Novo",
    estimatedDeliveryAt: estimatedDate.toISOString(),
  };
}

export function calculateRevenue(finance: FinanceRecord[]): number {
  return finance
    .filter((item) => item.type === "revenue")
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateCosts(finance: FinanceRecord[]): number {
  return finance
    .filter((item) => item.type !== "revenue")
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateProfit(finance: FinanceRecord[]): number {
  return calculateRevenue(finance) - calculateCosts(finance);
}

export function calculateROAS(finance: FinanceRecord[]): number {
  const revenue = calculateRevenue(finance);
  const adCost = finance
    .filter((item) => item.type === "ad_cost")
    .reduce((total, item) => total + item.amount, 0);

  return adCost === 0 ? 0 : revenue / adCost;
}

export function getSystemStatus(state: AutopilotState) {
  return {
    simulationMode: state.automation.simulationMode,
    realPurchasesEnabled: state.automation.realPurchasesEnabled,
    realAdsEnabled: state.automation.realAdsEnabled,
    automaticPaymentsEnabled: state.automation.automaticPaymentsEnabled,
    products: state.products.length,
    campaigns: state.campaigns.length,
    orders: state.orders.length,
    revenue: calculateRevenue(state.finance),
    costs: calculateCosts(state.finance),
    profit: calculateProfit(state.finance),
    roas: calculateROAS(state.finance),
  };
}
