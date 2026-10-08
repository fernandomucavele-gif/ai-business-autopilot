export type AuditAction =
  | "product_created"
  | "campaign_created"
  | "order_created"
  | "finance_record_created"
  | "automation_changed"
  | "system_error";

export type AuditLog = {
  id: string;
  action: AuditAction;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export function createAuditLog(
  action: AuditAction,
  description: string,
  metadata?: Record<string, unknown>
): AuditLog {
  return {
    id: `AUDIT-${Date.now()}`,
    action,
    description,
    timestamp: new Date().toISOString(),
    metadata,
  };
}
