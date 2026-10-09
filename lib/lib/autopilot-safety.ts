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
      reason: "Modo de simulação ativo.",
    };
  }

  if (!state.automation.realPurchasesEnabled) {
    return {
      allowed: false,
      reason: "Compras reais desativadas.",
    };
  }

  return {
    allowed: true,
    reason: "Verificações básicas aprovadas.",
  };
}

export function checkRealAds(
  state: AutopilotState
): SafetyCheck {
  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Modo de simulação ativo.",
    };
  }

  if (!state.automation.realAdsEnabled) {
    return {
      allowed: false,
      reason: "Anúncios reais desativados.",
    };
  }

  return {
    allowed: true,
    reason: "Verificações básicas aprovadas.",
  };
}

export function checkAutomaticPayments(
  state: AutopilotState
): SafetyCheck {
  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Modo de simulação ativo.",
    };
  }

  if (!state.automation.automaticPaymentsEnabled) {
    return {
      allowed: false,
      reason: "Pagamentos automáticos desativados.",
    };
  }

  return {
    allowed: true,
    reason: "Verificações básicas aprovadas.",
  };
}
