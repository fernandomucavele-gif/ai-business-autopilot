
import type { ApprovalRequest } from "./autopilot-approval";
import {
  createApprovalRequest,
  approveRequest,
  rejectRequest,
} from "./autopilot-approval";

let requests: ApprovalRequest[] = [];

export function addApprovalRequest(
  action: ApprovalRequest["action"],
  description: string,
  amount: number
): ApprovalRequest {
  const request = createApprovalRequest(
    action,
    description,
    amount
  );

  requests = [request, ...requests];
  return request;
}

export function getApprovalRequests(): ApprovalRequest[] {
  return requests.map((request) => ({ ...request }));
}

export function approveApprovalRequest(
  id: string
): ApprovalRequest | null {
  const request = requests.find((item) => item.id === id);

  if (!request || request.status !== "pending") {
    return null;
  }

  const updated = approveRequest(request);
  requests = requests.map((item) =>
    item.id === id ? updated : item
  );

  return updated;
}

export function rejectApprovalRequest(
  id: string
): ApprovalRequest | null {
  const request = requests.find((item) => item.id === id);

  if (!request || request.status !== "pending") {
    return null;
  }

  const updated = rejectRequest(request);
  requests = requests.map((item) =>
    item.id === id ? updated : item
  );

  return updated;
}

export function clearApprovalRequests(): void {
  requests = [];
}
