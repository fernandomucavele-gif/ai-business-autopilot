"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Market } from "../../lib/autopilot";

const markets: Market[] = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

export default function AdsPage() {
  const {
    state,
    addCampaign,
  } = useAutopilot();

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [market, setMarket] =
    useState<Market>("Moçambique");

  const [budget, setBudget] =
    useState("500");

  const [message, setMessage] =
    useState("");

  function generateCampaign() {
    if (!selectedProduct) {
      setMessage(
        "Seleciona primeiro um produto."
      );
      return;
    }

    const numericBudget =
      Number(budget) || 500;

    addCampaign(
      selectedProduct,
      market,
      "Vendas",
      numericBudget
    );

    setMessage(
      "Campanha criada em modo de simulação."
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f4f7fb",
        color: "#101828",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#667085",
            }}
          >
            AI BUSINESS AUTOPILOT
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "32px",
            }}
          >
            📢 Ads AI
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
            }}
          >
            Criação e gestão de campanhas
            publicitárias em modo de simulação.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "