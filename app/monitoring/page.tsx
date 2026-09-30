"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

type Log = {
  id: number;
  time: string;
  message: string;
  type: "success" | "warning" | "info";
};

export default function MonitoringPage() {
  const { state, metrics } = useAutopilot();

  const [active, setActive] = useState(true);

  const [logs, setLogs] = useState<Log[]>([
    {
      id: 1,
      time: "Agora",
      message:
        "Autopilot está online em modo simulação.",
      type: "success",
    },
    {
      id: 2,
      time: "Agora",
      message:
        "Monitoramento automático ativo.",
      type: "info",
    },
    {
      id: 3,
      time: "Agora",
      message:
        "Todas as ações reais continuam bloqueadas.",
      type: "warning",
    },
  ]);

  function refresh() {
    setLogs((old) => [
      {
        id: Date.now(),
        time: "Agora",
        message:
          "Monitoramento atualizado com sucesso.",
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <StatusCard
            title="🟢 Sistema"
            value="Online"
            background="#052e16"
            border="#166534"
            valueColor="#86efac"
          />

          <StatusCard
            title="🤖 Autopilot"
            value={active ? "Ativo" : "Pausado"}
            background="#082f49"
            border="#0369a1"
            valueColor="#67e8f9"
          />

          <StatusCard
            title="🛡️ Segurança"
            value="Simulação"
            background="#422006"
            border="#a16207"
            valueColor="#fde047"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <Metric
            title="🛍️ Produtos"
            value={state.products.length.toString()}
          />

          <Metric
            title="📢 Campanhas"
            value={state.campaigns.length.toString()}
          />

          <Metric
            title="📦 Pedidos"
            value={state.orders.length.toString()}
          />

          <Metric
            title="💵 Receita"
            value={`${metrics.revenue.toLocaleString()} MT`}
          />

          <Metric
            title="💸 Custos"
            value={`${metrics.costs.toLocaleString()} MT`}
          />

          <Metric
            title="📈 Lucro"
            value={`${metrics.profit.toLocaleString()} MT`}
          />

          <Metric
            title="📊 ROAS"
            value={`${metrics.roas.toFixed(2)}x`}
          />
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
          <h2 style={{ marginTop: 0 }}>
            ⚡ Controlo do Autopilot
          </h2>

          <p style={{ color: "#94a3b8" }}>
            Controla a atividade do Autopilot durante
            os testes.
          </p>

          <button
            onClick={toggleAutopilot}
            style={{
              background: active
                ? "#dc2626"
                : "#16a34a",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              padding: "13px 20px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {active
              ? "⏸ Pausar Autopilot"
              : "▶ Ativar Autopilot"}
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
          <h2 style={{ marginTop: 0 }}>
            🔐 Segurança
          </h2>

          <p style={{ color: "#fde68a" }}>
            O sistema está em modo simulação.
            Compras, pagamentos, publicação de
            anúncios e levantamentos reais continuam
            bloqueados.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <SecurityItem
              label="Compras automáticas"
              value={
                state.automation.realPurchasesEnabled
                  ? "ATIVAS"
                  : "BLOQUEADAS"
              }
            />

            <SecurityItem
              label="Pagamentos automáticos"
              value={
                state.automation
                  .automaticPaymentsEnabled
                  ? "ATIVOS"
                  : "BLOQUEADOS"
              }
            />

            <SecurityItem
              label="Anúncios reais"
              value={
                state.automation.realAdsEnabled
                  ? "ATIVOS"
                  : "BLOQUEADOS"
              }
            />

            <SecurityItem
              label="Modo simulação"
              value={
                state.automation.simulationMode
                  ? "ATIVO"
                  : "DESATIVADO"
              }
            />
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
          <h2 style={{ marginTop: 0 }}>
            📡 Atividade do sistema
          </h2>

          <div
            style={{
              display: "grid",
              gap: "10px",
            }}
          >
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
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <SecurityBox
            title="Compras automáticas"
            value="BLOQUEADAS"
          />

          <SecurityBox
            title="Pagamentos automáticos"
            value="BLOQUEADOS"
          />

          <SecurityBox
            title="Publicação de anúncios"
            value="BLOQUEADA"
          />

          <SecurityBox
            title="Levantamentos"
            value="BLOQUEADOS"
          />
        </section>
      </div>
    </main>
  );
}

function StatusCard({
  title,
  value,
  background,
  border,
  valueColor,
}: {
  title: string;
  value: string;
  background: string;
  border: string;
  valueColor: string;
}) {
  return (
    <div
      style={{
        background,
        border: `1px solid ${border}`,
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <p
        style={{
          color: valueColor,
          margin: "0 0 8px",
        }}
      >
        {title}
      </p>

      <strong style={{ fontSize: "22px" }}>
        {value}
      </strong>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "14px",
        padding: "16px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "8px",
          fontSize: "21px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function SecurityItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        borderRadius: "10px",
        padding: "12px",
      }}
    >
      <div
        style={{
          color: "#94a3b8",
          fontSize: "13px",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "5px",
          color: "#f87171",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function SecurityBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <span style={{ color: "#94a3b8" }}>
        {title}
      </span>

      <h3 style={{ color: "#f87171" }}>
        {value}
      </h3>
    </div>
  );
}