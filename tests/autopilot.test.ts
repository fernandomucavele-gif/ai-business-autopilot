import { describe, expect, it } from "vitest";
import {
  calculateCosts,
  calculateProfit,
  calculateROAS,
  calculateRevenue,
  createCampaign,
  createOrder,
  createProduct,
  getSystemStatus,
  initialAutopilotState,
  type FinanceRecord,
} from "../lib/autopilot";

const finance: FinanceRecord[] = [
  { id: "f1", type: "revenue", amount: 1000, currency: "MT", description: "Venda teste" },
  { id: "f2", type: "product_cost", amount: 300, currency: "MT", description: "Produto teste" },
  { id: "f3", type: "ad_cost", amount: 100, currency: "MT", description: "Anúncio simulado" },
  { id: "f4", type: "shipping", amount: 50, currency: "MT", description: "Envio teste" },
  { id: "f5", type: "revenue", amount: 20, currency: "USD", description: "Venda em USD" },
  { id: "f6", type: "ad_cost", amount: 5, currency: "USD", description: "Anúncio em USD" },
];

describe("segurança do estado inicial", () => {
  it("inicia sempre em modo de simulação", () => {
    expect(initialAutopilotState.automation).toEqual({
      simulationMode: true,
      realPurchasesEnabled: false,
      realAdsEnabled: false,
      automaticPaymentsEnabled: false,
    });
  });

  it("inicia as coleções sem dados reais", () => {
    expect(initialAutopilotState.customers).toEqual([]);
    expect(initialAutopilotState.products).toEqual([]);
    expect(initialAutopilotState.campaigns).toEqual([]);
    expect(initialAutopilotState.creatives).toEqual([]);
    expect(initialAutopilotState.orders).toEqual([]);
    expect(initialAutopilotState.finance).toEqual([]);
    expect(initialAutopilotState.supplierQuotes).toEqual([]);
  });
});

describe("criação de registos simulados", () => {
  it("cria produto com preço, mercado e estado inicial corretos", () => {
    const product = createProduct("Produto de teste", "Moçambique", 500, 200);
    expect(product.name).toBe("Produto de teste");
    expect(product.market).toBe("Moçambique");
    expect(product.price).toBe(500);
    expect(product.estimatedUnitCost).toBe(200);
    expect(product.status).toBe("research");
    expect(product.id).toMatch(/^PROD-/);
  });

  it("cria campanha em estado de simulação", () => {
    const campaign = createCampaign("PROD-TEST", "Portugal", "Vendas", 100);
    expect(campaign.productId).toBe("PROD-TEST");
    expect(campaign.objective).toBe("Vendas");
    expect(campaign.dailyBudget).toBe(100);
    expect(campaign.status).toBe("simulation");
    expect(campaign.id).toMatch(/^CAMP-/);
  });

  it("cria encomenda com cliente associado e entrega estimada", () => {
    const order = createOrder("PROD-TEST", "Cliente de teste", "Moçambique", 750, "CUST-TEST");
    expect(order.productId).toBe("PROD-TEST");
    expect(order.customerName).toBe("Cliente de teste");
    expect(order.customerId).toBe("CUST-TEST");
    expect(order.amount).toBe(750);
    expect(order.status).toBe("Novo");
    expect(order.id).toMatch(/^ORD-/);
    expect(Date.parse(order.estimatedDeliveryAt ?? "")).not.toBeNaN();
  });
});

describe("indicadores financeiros", () => {
  it("soma receitas apenas na moeda pedida", () => {
    expect(calculateRevenue(finance, "MT")).toBe(1000);
    expect(calculateRevenue(finance, "USD")).toBe(20);
  });

  it("soma custos apenas na moeda pedida", () => {
    expect(calculateCosts(finance, "MT")).toBe(450);
    expect(calculateCosts(finance, "USD")).toBe(5);
  });

  it("calcula lucro sem misturar moedas", () => {
    expect(calculateProfit(finance, "MT")).toBe(550);
    expect(calculateProfit(finance, "USD")).toBe(15);
  });

  it("calcula ROAS global indicativo por moeda", () => {
    expect(calculateROAS(finance, "MT")).toBe(10);
    expect(calculateROAS(finance, "USD")).toBe(4);
  });

  it("devolve ROAS zero quando não há custo de anúncios", () => {
    const noAds = finance.filter((item) => item.type !== "ad_cost");
    expect(calculateROAS(noAds, "MT")).toBe(0);
  });
});

describe("resumo do sistema", () => {
  it("apresenta métricas e mantém os controlos reais desligados", () => {
    const state = {
      ...initialAutopilotState,
      finance,
      products: [createProduct("Produto", "Moçambique", 100)],
      campaigns: [createCampaign("P1", "Moçambique", "Tráfego", 20)],
    };
    const status = getSystemStatus(state);

    expect(status.products).toBe(1);
    expect(status.campaigns).toBe(1);
    expect(status.revenue).toBe(1000);
    expect(status.costs).toBe(450);
    expect(status.profit).toBe(550);
    expect(status.roas).toBe(10);
    expect(status.simulationMode).toBe(true);
    expect(status.realPurchasesEnabled).toBe(false);
    expect(status.realAdsEnabled).toBe(false);
    expect(status.automaticPaymentsEnabled).toBe(false);
  });
});
