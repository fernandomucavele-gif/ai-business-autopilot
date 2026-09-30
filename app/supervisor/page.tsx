"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

const modules = [
  ["🔎", "Research AI", "Pesquisa produtos e oportunidades"],
  ["🏭", "Supplier AI", "Pesquisa fornecedores"],
  ["🎨", "Creative AI", "Cria criativos e ofertas"],
  ["📢", "Ads AI", "Prepara campanhas"],
  ["📊", "Analytics AI", "Analisa resultados"],
  ["👥", "Customer AI", "Atende clientes"],
  ["📦", "Orders AI", "Controla encomendas"],
  ["💰", "Finance AI", "Controla receitas e custos"],
];

const actions = [
  "Pesquisar novas oportunidades",
  "Analisar fornecedores",
  "Criar criativos",
  "Preparar campanha",
  "Analisar campanhas",
  "Verificar pedidos",
  "Analisar resultados financeiros",
];

export default function SupervisorPage() {
  const { state, metrics } = useAutopilot();

  const [selectedAction, setSelectedAction] = useState(
    "Pesquisar novas oportunidades"
  );

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");

  function runAction() {
    setRunning(true);
    setResult("");

    setTimeout(() => {
      setRunning(false);

      setResult(
        `Ação "${selectedAction}" executada em modo de simulação. ` +
          `${state.products.length} produtos, ` +
          `${state.campaigns.length} campanhas e ` +
          `${state.orders.length} pedidos estão atualmente registados no Autopilot.`
      );
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        {/* CABEÇALHO */}
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#ede9fe",
              color: "#6d28d9",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            🤖 SUPERVISOR AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Centro de controlo do AI Business Autopilot
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Coordena os agentes de pesquisa, fornecedores, criativos,
            anúncios, clientes, encomendas e finanças.
          </p>
        </div>

        {/* RESUMO DO SISTEMA */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Produtos
            </div>

            <strong style={{ fontSize: 28 }}>
              {state.products.length}
            </strong>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Campanhas
            </div>

            <strong style={{ fontSize: 28 }}>
              {state.campaigns.length}
            </strong>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Pedidos
            </div>

            <strong style={{ fontSize: 28 }}>
              {state.orders.length}
            </strong>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Receita
            </div>

            <strong style={{ fontSize: 28 }}>
              {metrics.revenue.toLocaleString("pt-PT")} MT
            </strong>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Lucro
            </div>

            <strong style={{ fontSize: 28 }}>
              {metrics.profit.toLocaleString("pt-PT")} MT
            </strong>
          </div>
        </section>

        {/* COMANDO */}
        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            marginBottom: 22,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🧠 Comando do Supervisor
          </h2>

          <p
            style={{
              color: