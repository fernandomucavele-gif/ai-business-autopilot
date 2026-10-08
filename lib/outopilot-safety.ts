// lib/autopilot-safety.ts

import type { AutopilotState } from "./autopilot";

export type SafetyCheck = {
  allowed: boolean;
  reason: string;
};

export function checkRealPurchases(
  state: AutopilotState
): SafetyCheck {
  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Simulation Mode está ativo.",
    };
  }

  if (!state.automation.realPurchasesEnabled) {
    return {
      allowed: false,
      reason: "Compras reais estão desativadas.",
    };
  }

  return {
    allowed: true,
    reason: "Compras reais autorizadas.",
  };
}

export function checkRealAds(
  state: AutopilotState
): SafetyCheck {
  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Simulation Mode está ativo.",
    };
  }

  if (!state.automation.realAdsEnabled) {
    return {
      allowed: false,
      reason: "Anúncios reais estão desativados.",
    };
  }

  return {
    allowed: true,
    reason: "Anúncios reais autorizados.",
  };
}

export function checkAutomaticPayments(
  state: AutopilotState
): SafetyCheck {
  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Simulation Mode está ativo.",
    };
  }

  if (!state.automation.automaticPaymentsEnabled) {
    return {
      allowed: false,
      reason: "Pagamentos automáticos estão desativados.",
    };
  }

  return {
    allowed: true,
    reason: "Pagamentos automáticos autorizados.",
  };
}
