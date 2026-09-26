"use client";

import { useMemo, useState } from "react";
import {
  calculateCosts,
  calculateProfit,
  calculateRevenue,
  calculateROAS,
  initialAutopilotState,
} from "../../lib/autopilot";

export default function FinancePage() {
  const [revenue, setRevenue] = useState("");
  const [productCost, setProductCost] = useState("");
  const [adCost, setAdCost] = useState("");
  const [shipping, setShipping] = useState("");

  const finance = useMemo(() => {
    return [
      ...initialAutopilotState.finance,
      ...(revenue
        ? [
            {
              id: "demo-revenue",
              type: "revenue" as const,
              amount: Number(revenue) || 0,
              currency: "MT",
              description: "Venda simulada",
            },
          ]
        : []),
      ...(productCost
        ? [
            {
              id: "demo-product-cost",
              type: "product_cost" as const,
              amount: Number(productCost) || 0,
              currency: "MT",
              description: "Custo do produto",
            },
          ]
        : []),
      ...(adCost
        ? [
            {
              id: "demo-ad-cost",
              type: "ad_cost" as const,
              amount: Number(adCost) || 0,
              currency: "MT",
              description: "Publicidade",
            },
          ]
        : []),
      ...(shipping
        ? [
            {
              id: "demo-shipping",
              type: "shipping" as const,
              amount: Number(shipping) || 0,
              currency: "MT",
              description: "Envio",
            },
          ]
        : []),
    ];
  }, [revenue, productCost, adCost, shipping]);

  const totalRevenue = calculateRevenue(finance);
  const totalCosts = calculateCosts(finance);
  const profit = calculateProfit(finance);
  const roas = calculateROAS(finance);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px
