// lib/autopilot-ruaules.

import type { AutopilotState, Product, Campaign } from "./autopilot";

export function canActivateProduct(
  product: Product
): boolean {
  return (
    product.name.trim().length > 0 &&
    product.price > 0 &&
    product.score >= 0
  );
}

export function canActivateCampaign(
  campaign: Campaign,
  state: AutopilotState
): boolean {
  const productExists = state.products.some(
    (product) => product.id === campaign.productId
  );

  return (
    productExists &&
    campaign.dailyBudget > 0 &&
    campaign.market.length > 0
  );
}

export function canUseRealAutomation(
  state: AutopilotState
): boolean {
  if (state.automation.simulationMode) {
    return false;
  }

  return (
    state.automation.realPurchasesEnabled ||
    state.automation.realAdsEnabled ||
    state.automation.automaticPaymentsEnabled
  );
}

export function getAutomationMode(
  state: AutopilotState
): "simulation" | "live" | "mixed" {
  if (state.automation.simulationMode) {
    return "simulation";
  }

  const liveFlags = [
    state.automation.realPurchasesEnabled,
    state.automation.realAdsEnabled,
    state.automation.automaticPaymentsEnabled,
  ];

  const enabled = liveFlags.filter(Boolean).length;

  if (enabled === 0) {
    return "simulation";
  }

  if (enabled === liveFlags.length) {
    return "live";
  }

  return "mixed";
}
