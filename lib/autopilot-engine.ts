// lib/autopilot-engine.ts

import {
  AutopilotState,
  Product,
  Campaign,
  Order,
  FinanceRecord,
} from "./autopilot";

export function getActiveProducts(
  state: AutopilotState
): Product[] {
  return state.products.filter(
    (product) => product.status === "active"
  );
}

export function getActiveCampaigns(
  state: AutopilotState
): Campaign[] {
  return state.campaigns.filter(
    (campaign) => campaign.status === "active"
  );
}

export function getPendingOrders(
  state: AutopilotState
): Order[] {
  return state.orders.filter(
    (order) =>
      order.status === "Novo" ||
      order.status === "Pagamento pendente"
  );
}

export function getCompletedOrders(
  state: AutopilotState
): Order[] {
  return state.orders.filter(
    (order) => order.status === "Entregue"
  );
}

export function getFinanceSummary(
  state: AutopilotState
) {
  const revenue = state.finance
    .filter((item: FinanceRecord) => item.type === "revenue")
    .reduce((sum, item) => sum + item.amount, 0);

  const costs = state.finance
    .filter((item: FinanceRecord) => item.type !== "revenue")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    revenue,
    costs,
    profit: revenue - costs,
  };
}

export function getAutopilotHealth(
  state: AutopilotState
) {
  return {
    simulationMode: state.automation.simulationMode,
    realPurchasesEnabled:
      state.automation.realPurchasesEnabled,
    realAdsEnabled:
      state.automation.realAdsEnabled,
    automaticPaymentsEnabled:
      state.automation.automaticPaymentsEnabled,

    products: state.products.length,
    activeProducts: getActiveProducts(state).length,

    campaigns: state.campaigns.length,
    activeCampaigns: getActiveCampaigns(state).length,

    orders: state.orders.length,
    pendingOrders: getPendingOrders(state).length,
    completedOrders: getCompletedOrders(state).length,

    finance: getFinanceSummary(state),
  };
}
