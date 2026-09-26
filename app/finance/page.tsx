"use client";

import { useState } from "react";

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
        `Ação "${selectedAction}" executada em modo de simulação. Os módulos necessários foram identificados e o próximo passo foi preparado.`
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
            Centro
