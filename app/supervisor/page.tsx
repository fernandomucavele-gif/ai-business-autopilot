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
            Centro de controlo do AI Business Autopilot
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Coordena os agentes de pesquisa, fornecedores, criativos, anúncios,
            clientes, encomendas e finanças.
          </p>
        </div>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            marginBottom: 22,
          }}
        >
          <h2 style={{ marginTop: 0 }}>🧠 Comando do Supervisor</h2>

          <label style={{ fontWeight: 700 }}>
            Escolher uma ação
          </label>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 8,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            {actions.map((action) => (
              <option key={action}>{action}</option>
            ))}
          </select>

          <button
            onClick={runAction}
            disabled={running}
            style={{
              width: "100%",
              marginTop: 18,
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#6d28d9",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {running ? "🤖 Supervisor a trabalhar..." : "▶️ Executar ação"}
          </button>

          {result && (
            <div
              style={{
                marginTop: 18,
                padding: 15,
                borderRadius: 10,
                background: "#ecfdf5",
                color: "#166534",
              }}
            >
              ✅ {result}
            </div>
          )}
        </section>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🔗 Agentes conectados</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 14,
            }}
          >
            {modules.map(([icon, name, description]) => (
              <div
                key={name}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 14,
                  padding: 17,
                }}
              >
                <div style={{ fontSize: 28 }}>{icon}</div>

                <h3 style={{ margin: "8px 0 5px" }}>
                  {name}
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  {description}
                </p>

                <div
                  style={{
                    marginTop: 12,
                    display: "inline-block",
                    padding: "5px 9px",
                    borderRadius: 20,
                    background: "#dcfce7",
                    color: "#166534",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  ● Estrutura pronta
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 22,
            background: "#fff7ed",
            color: "#9a3412",
            padding: 16,
            borderRadius: 12,
          }}
        >
          ⚠️ <strong>Modo simulação:</strong> o Supervisor ainda não executa
          compras, pagamentos, levantamentos ou publicação real de anúncios.
          Primeiro vamos testar toda a cadeia.
        </section>
      </div>
    </main>
  );
  }
