export type ApprovalRequest = {
  id: string;
  action: "purchase" | "advertisement" | "payment";
  description: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export function createApprovalRequest(
  action: ApprovalRequest["action"],
  description: string,
  amount: number
): ApprovalRequest {
  return {
    id: `APPROVAL-${Date.now()}`,
    action,
    description,
    amount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}

export function approveRequest(
  request: ApprovalRequest
): ApprovalRequest {
  return { ...request, status: "approved" };
}

export function rejectRequest(
  request: ApprovalRequest
): ApprovalRequest {
  return { ...request, status: "rejected" };
}

export function canExecuteApprovedRequest(
  request: ApprovalRequest
): boolean {
  return request.status === "approved" &&
    Number.isFinite(request.amount) &&
    request.amount > 0;
}