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
    if (running) return;

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

        {/* ESTADO DE SEGURANÇA */}
        <section
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            padding: 18,
            borderRadius: 16,
            marginBottom: 22,
          }}
        >
          <strong style={{ color: "#c2410c" }}>
            🔒 Modo de simulação ativo
          </strong>

          <p
            style={{
              margin: "8px 0 0",
              color: "#7c2d12",
              lineHeight: 1.6,
            }}
          >
            O Supervisor pode executar testes e coordenar os módulos, mas
            compras reais, publicação de anúncios, pagamentos automáticos e
            levantamentos continuam bloqueados.
          </p>
        </section>

        {/* RESUMO DO SISTEMA */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 16,
              boxShadow