export type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

export type ProductClassification =
  | "Excelente"
  | "Promissor"
  | "Risco elevado"
  | "Não recomendado"
  | "Por avaliar";

export type MarketLevel = "Baixa" | "Média" | "Alta" | "Por avaliar";
export type MarketAssessment = {
  demand: MarketLevel;
  competition: MarketLevel;
  evidenceNote?: string;
};

export function classifyMarketPotential(assessment?: MarketAssessment): string {
  if (!assessment || assessment.demand === "Por avaliar" || assessment.competition === "Por avaliar") {
    return "Por avaliar";
  }
  const demandScore = assessment.demand === "Alta" ? 2 : assessment.demand === "Média" ? 1 : 0;
  const competitionScore = assessment.competition === "Baixa" ? 2 : assessment.competition === "Média" ? 1 : 0;
  const score = demandScore + competitionScore;
  if (score >= 3) return "Potencial favorável";
  if (score === 2) return "Potencial moderado";
  return "Potencial fraco";
}

/** Classificação indicativa pela margem bruta; não substitui custos totais nem validação de mercado. */
export function classifyProductOpportunity(price: number, unitCost?: number | null): ProductClassification {
  if (!Number.isFinite(price) || price <= 0 || unitCost == null || !Number.isFinite(unitCost) || unitCost < 0) {
    return "Por avaliar";
  }
  const margin = ((price - unitCost) / price) * 100;
  if (margin <= 0) return "Não recomendado";
  if (margin < 20) return "Risco elevado";
  if (margin < 40) return "Promissor";
  return "Excelente";
}

export type ProductOpportunityScore = {
  score: number | null;
  label: "Excelente" | "Boa oportunidade" | "Oportunidade moderada" | "Oportunidade fraca" | "Dados insuficientes";
  marginPoints: number;
  demandPoints: number;
  competitionPoints: number;
  supplierPoints: number;
  supplierVerified: boolean;
};

/** Pontuação indicativa (0–100). Procura e concorrência são avaliações manuais; cotação de fornecedor é opcional e vale 15 pontos. */
export function scoreProductOpportunity(
  price: number,
  unitCost: number | null | undefined,
  assessment?: MarketAssessment,
  supplierLandedCost?: number | null
): ProductOpportunityScore {
  const validBase = Number.isFinite(price) && price > 0 &&
    unitCost != null && Number.isFinite(unitCost) && unitCost >= 0 &&
    assessment != null && assessment.demand !== "Por avaliar" &&
    assessment.competition !== "Por avaliar";
  const supplierVerified = supplierLandedCost != null &&
    Number.isFinite(supplierLandedCost) && supplierLandedCost >= 0;
  const marginPercent = validBase ? ((price - (unitCost as number)) / price) * 100 : 0;
  const marginPoints = validBase ? Math.max(0, Math.min(40, marginPercent)) : 0;
  const demandPoints = !validBase ? 0 : assessment!.demand === "Alta" ? 25 : assessment!.demand === "Média" ? 17 : 7;
  const competitionPoints = !validBase ? 0 : assessment!.competition === "Baixa" ? 20 : assessment!.competition === "Média" ? 13 : 5;
  const supplierPoints = supplierVerified && supplierLandedCost! < price ? 15 : 0;
  if (!validBase) {
    return { score: null, label: "Dados insuficientes", marginPoints, demandPoints, competitionPoints, supplierPoints, supplierVerified };
  }
  const score = Math.round(marginPoints + demandPoints + competitionPoints + supplierPoints);
  const label = score >= 80 ? "Excelente" : score >= 65 ? "Boa oportunidade" : score >= 45 ? "Oportunidade moderada" : "Oportunidade fraca";
  return { score, label, marginPoints, demandPoints, competitionPoints, supplierPoints, supplierVerified };
}

export type Product = {
  id: string;
  name: string;
  market: Market;
  price: number;
  estimatedUnitCost?: number;
  marketAssessment?: MarketAssessment;
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

export type CreativeRecord = {
  id: string;
  campaignId: string;
  productId: string;
  name: string;
  format: "image" | "video" | "carousel" | "text";
  headline: string;
  primaryText: string;
  callToAction: string;
  hook: string;
  script: string;
  angle: string;
  status: "draft" | "approved" | "rejected" | "simulation";
};

export type Order = {
  id: string;
  productId: string;
  customerName: string;
  customerId?: string;
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
  supplierName?: string;
};

export type FinanceRecord = {
  id: string;
  productId?: string;
  type: "revenue" | "product_cost" | "ad_cost" | "shipping";
  amount: number;
  currency: string;
  description: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  market: Market;
  notes: string;
  createdAt: string;
};

export type SupplierQuote = {
  id: string;
  productId?: string;
  company: string;
  country: string;
  platform: string;
  product: string;
  currency: string;
  unitPrice: number;
  minimumOrder: number;
  shipping: number;
  taxes: number;
  notes: string;
};

export type AutopilotState = {
  customers: Customer[];
  supplierQuotes: SupplierQuote[];
  products: Product[];
  campaigns: Campaign[];
  creatives: CreativeRecord[];
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
  customers: [],
  supplierQuotes: [],
  products: [],
  campaigns: [],
  creatives: [],
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
  estimatedUnitCost?: number,
  marketAssessment?: MarketAssessment
): Product {
  return {
    id: `PROD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    market,
    price,
    estimatedUnitCost,
    marketAssessment,
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
  amount: number,
  customerId?: string
): Order {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 14);

  return {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    productId,
    customerName,
    customerId,
    market,
    amount,
    status: "Novo",
    estimatedDeliveryAt: estimatedDate.toISOString(),
  };
}

// Os indicadores agregados usam uma única moeda. Por omissão, MT.
export function calculateRevenue(finance: FinanceRecord[], currency = "MT"): number {
  return finance
    .filter((item) => item.type === "revenue" && item.currency === currency)
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateCosts(finance: FinanceRecord[], currency = "MT"): number {
  return finance
    .filter((item) => item.type !== "revenue" && item.currency === currency)
    .reduce((total, item) => total + item.amount, 0);
}

export function calculateProfit(finance: FinanceRecord[], currency = "MT"): number {
  return calculateRevenue(finance, currency) - calculateCosts(finance, currency);
}

// Este é um rácio global indicativo, não ROAS atribuído a uma campanha.
export function calculateROAS(finance: FinanceRecord[], currency = "MT"): number {
  const revenue = calculateRevenue(finance, currency);
  const adCost = finance
    .filter((item) => item.type === "ad_cost" && item.currency === currency)
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
    creatives: state.creatives.length,
    orders: state.orders.length,
    revenue: calculateRevenue(state.finance),
    costs: calculateCosts(state.finance),
    profit: calculateProfit(state.finance),
    roas: calculateROAS(state.finance),
  };
}
