"use client";

import { useState } from "react";

type Log = {
  id: number;
  time: string;
  message: string;
  type: "success" | "warning" | "info";
};

const initialLogs: Log[] = [
  {
    id: 1,
    time: "Agora",
    message: "Autopilot está online em modo simulação.",
    type: "success",
  },
  {
    id: 2,
    time: "Agora",
    message: "Monitoramento automático ativo.",
    type: "info",
  },
  {
    id: 3,
    time: "Agora",
    message: "Todas as ações reais continuam bloqueadas.",
    type: "warning",
  },
];

export default function MonitoringPage() {
  const [active, setActive] = useState(true);
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  function refresh() {
    setLogs((old) => [
      {
        id: Date.now(),
        time: "Agora",
        message: "Monitoramento atualizado com sucesso.",
        type: "success",
      },
      ...old,
    ]);
  }

  function toggleAutopilot() {
    const next = !active;
    setActive(next);

    setLogs((old) => [
      {
        id: Date.now(),
        time: "Agora",
        message: next
          ? "Autopilot ativado em modo simulação."
          : "Autopilot pausado.",
        type: next ? "success" : "warning",
      },
      ...old,
    ]);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <p
              style={{
                color: "#22d3ee",
                fontSize: "13px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              AI BUSINESS AUTOPILOT
            </p>

            <h1
              style={{
                fontSize: "34px",
                margin: "0 0 8px",
              }}
            >
              👁️ Monitoramento
            </h1>

            <p
              style={{
                color: "#94a3b8",
                margin: 0,
              }}
            >
              Centro de controlo e segurança do Autopilot.
            </p>
          </div>

          <button
            onClick={refresh}
            style={{
              background: "#1e293b",
              color: "#ffffff",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "12px 18px",
              cursor: "pointer",
            }}
          >
            🔄 Atualizar
          </button>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              background: "#052e16",
              border: "1px solid #166534",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <p style={{ color: "#86efac", margin: "0 0 8px" }}>
              🟢 Sistema
            </p>
            <strong style={{ fontSize: "22px" }}>Online</strong>
          </div>

          <div
            style={{
              background: "#082f49",
              border: "1px solid #0369a1",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <p style={{ color: "#67e8f9", margin: "0 0 8px" }}>
              🤖 Autopilot
            </p>
            <strong style={{ fontSize: "22px" }}>
              {active ? "Ativo" : "Pausado"}
            </strong>
          </div>

          <div
            style={{
              background: "#422006",
              border: "1px solid #a16207",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <p style={{ color: "#fde047", margin: "0 0 8px" }}>
              🛡️ Segurança
            </p>
            <strong style={{ fontSize: "22px" }}>Simulação</strong>
          </div>
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>⚡ Controlo do Autopilot</h2>

          <p style={{ color: "#94a3b8" }}>
            Controla a atividade do Autopilot durante os testes.
          </p>

          <button
            onClick={toggleAutopilot}
            style={{
              background: active ? "#dc2626" : "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "13px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {active ? "⏸ Pausar Autopilot" : "▶ Ativar Autopilot"}
          </button>
        </section>

        <section
          style={{
            background: "#451a03",
            border: "1px solid #92400e",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🔐 Segurança</h2>

          <p style={{ color: "#fde68a" }}>
            O sistema está em modo simulação. Compras, pagamentos,
            publicação de anúncios e levantamentos reais continuam bloqueados.
          </p>
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📡 Atividade do sistema</h2>

          <div style={{ display: "grid", gap: "10px" }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: "#1e293b",
                  borderRadius: "12px",
                  padding: "15px",
                }}
              >
                <strong>
                  {log.type === "success"
                    ? "✅"
                    : log.type === "warning"
                    ? "⚠️"
                    : "ℹ️"}{" "}
                  {log.message}
                </strong>

                <p
                  style={{
                    color: "#64748b",
                    margin: "6px 0 0",
                    fontSize: "13px",
                  }}
                >
                  {log.time}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>
              Compras automáticas
            </span>
            <h3 style={{ color: "#f87171" }}>BLOQUEADAS</h3>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>
              Pagamentos automáticos
            </span>
            <h3 style={{ color: "#f87171" }}>BLOQUEADOS</h3>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>
              Publicação de anúncios
            </span>
            <h3 style={{ color: "#f87171" }}>BLOQUEADA</h3>
          </div>

          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "16px",
              padding: "18px",
            }}
          >
            <span style={{ color: "#94a3b8" }}>
              Levantamentos
            </span>
            <h3 style={{ color: "#f87171" }}>BLOQUEADOS</h3>
          </div>
        </section>
      </div>
    </main>
  );
}