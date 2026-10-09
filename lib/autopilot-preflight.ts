
import type { AutopilotState } from "./autopilot";
import type { ApprovalRequest } from "./autopilot-approval";
import { canRunAutomation } from "./autopilot-kill-switch";
import {
  checkRealPurchases,
  checkRealAds,
  checkAutomaticPayments,
} from "./autopilot-safety";
import {
  checkPurchaseLimit,
  checkDailyAdBudget,
  defaultAutomationLimits,
} from "./autopilot-limits";

export type PreflightAction =
  | "purchase"
  | "advertisement"
  | "payment";

export type PreflightResult = {
  allowed: boolean;
  reason: string;
};

export function checkAutomationPreflight(
  action: PreflightAction,
  state: AutopilotState,
  amount: number,
  approval?: ApprovalRequest
): PreflightResult {
  if (!canRunAutomation()) {
    return {
      allowed: false,
      reason: "Paragem de emergência ativa.",
    };
  }

  if (state.automation.simulationMode) {
    return {
      allowed: false,
      reason: "Modo de simulação ativo.",
    };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      allowed: false,
      reason: "Valor inválido.",
    };
  }

  if (
    !approval ||
    approval.status !== "approved" ||
    approval.action !== action ||
    approval.amount !== amount
  ) {
    return {
      allowed: false,
      reason: "Aprovação manual válida necessária.",
    };
  }

  if (action === "purchase") {
    const safety = checkRealPurchases(state);
    if (!safety.allowed) return safety;

    return checkPurchaseLimit(amount, {
      ...defaultAutomationLimits,
      requireApproval: false,
    });
  }

  if (action === "advertisement") {
    const safety = checkRealAds(state);
    if (!safety.allowed) return safety;

    return checkDailyAdBudget(amount, state);
  }

  return checkAutomaticPayments(state);
}
