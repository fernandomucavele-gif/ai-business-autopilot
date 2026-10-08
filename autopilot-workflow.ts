// lib/autopilot-workflow.ts

import type { AutopilotState } from "./autopilot";
import {
  canActivateProduct,
  canActivateCampaign,
} from "./autopilot-rules";

export function getWorkflowStatus(state: AutopilotState) {
  const products = state.products.map((product) => ({
    id: product.id,
    name: product.name,
    canActivate: canActivateProduct(product),
  }));

  const campaigns = state.campaigns.map((campaign) => ({
    id: campaign.id,
    productId: campaign.productId,
    canActivate: canActivateCampaign(campaign, state),
  }));

  return {
    research: true,
    products,
    campaigns,
    orders: state.orders.length,
    finance: state.finance.length,
  };
}

export function getNextWorkflowStep(
  state: AutopilotState
): string {
  if (state.products.length === 0) return "research";

  const approvedProduct = state.products.find(
    (product) => canActivateProduct(product)
  );

  if (!approvedProduct) return "product_validation";

  const campaign = state.campaigns.find(
    (item) =>
      item.productId === approvedProduct.id &&
      canActivateCampaign(item, state)
  );

  if (!campaign) return "campaign_creation";

  if (state.orders.length === 0) return "customer_orders";

  return "monitoring";
    }
