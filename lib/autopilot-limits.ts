autimport type { AutopilotState } from "./autopilot";

export type AutomationLimits = {
  maxPurchaseAmount: number;
  maxDailyAdBudget: number;
  requireApproval: boolean;
};

export const defaultAutomationLimits: AutomationLimits = {
  maxPurchaseAmount: 100,
  maxDailyAdBudget: 20,
  requireApproval: true,
};

export function checkPurchaseLimit(
  amount: number,
  limits: AutomationLimits = defaultAutomationLimits
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { allowed: false, reason: "Valor inválido." };
  }

  if (amount > limits.maxPurchaseAmount) {
    return {
      allowed: false,
      reason: "Compra acima do limite permitido.",
    };
  }

  if (limits.requireApproval) {
    return {
      allowed: false,
      reason: "Aprovação manual necessária antes da compra.",
    };
  }

  return { allowed: true, reason: "Dentro do limite." };
}

export function checkDailyAdBudget(
  amount: number,
  state: AutopilotState,
  limits: AutomationLimits = defaultAutomationLimits
) {
  if (!Number.isFinite(amount) || amount <= 0) {
    return { allowed: false, reason: "Orçamento inválido." };
  }

  if (amount > limits.maxDailyAdBudget) {
    return {
      allowed: false,
      reason: "Orçamento diário acima do limite.",
    };
  }

  if (
    state.automation.simulationMode ||
    !state.automation.realAdsEnabled
  ) {
    return {
      allowed: false,
      reason: "Anúncios reais não estão autorizados.",
    };
  }

  return { allowed: true, reason: "Dentro do limite." };
}opilot-limits.ts
