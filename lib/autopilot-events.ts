export type AutomationEvent = {
  id: string;
  type:
    | "product"
    | "campaign"
    | "order"
    | "finance"
    | "automation"
    | "error";
  status: "success" | "warning" | "error";
  message: string;
  createdAt: string;
};

export function createAutomationEvent(
  type: AutomationEvent["type"],
  status: AutomationEvent["status"],
  message: string
): AutomationEvent {
  return {
    id: `EVENT-${Date.now()}`,
    type,
    status,
    message,
    createdAt: new Date().toISOString(),
  };
}
