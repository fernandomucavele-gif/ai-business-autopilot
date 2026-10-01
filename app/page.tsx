"use client";

import { useRouter } from "next/navigation";
import { useAutopilot } from "./context/autopilot-context";

const menu = [
  ["🏠", "Dashboard", "/"],
  ["🔎", "Research AI", "/research"],
  ["🏭", "Supplier AI", "/suppliers"],
  ["🎨", "Creative AI", "/creative"],
  ["📢", "Ads AI", "/ads"],
  ["📊", "Analytics AI", "/analytics"],
  ["💰", "Finance AI", "/finance"],
  ["🤝", "Customer AI", "/customers"],
  ["📦", "Orders AI", "/orders"],
  ["🤖", "Supervisor AI", "/supervisor"],
  ["👁️", "Monitoramento", "/monitoring"],
  ["⚙️", "Configurações", "/settings/app/settings"],
];

export default function Home() {
  const router = useRouter();
  const { state, metrics } = useAutopilot();

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, #1e293b 0%, #09090b 35%, #020617 100%)",
        color: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        display: "flex",
      }}
    >
      <aside
        style={{
          width: "250px",
          minHeight: "100vh",
          background: "rgba(15,23,42,0.88)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: "24px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg,#22d3ee,#6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "900",
              boxShadow: "0 8px 30px rgba(34,211,238,.25)",
            }}
          >
            AI
          </div>

          <div>
            <strong style={{ display: "block", fontSize: "16px" }}>
              Business
            </strong>

            <span style={{ color: "#94a3b8", fontSize: "13px" }}>
              Autopilot
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: "10px",
            color: "#64748b",
            letterSpacing: "1.5px",
            marginBottom: "12px",
          }}
        >
          CONTROL CENTER
        </p>

        <nav style={{ display: "grid", gap: "6px" }}>
          {menu.map(([icon, name, path], index) => (
            <button
              key={name}
              onClick={() => router.push(path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
                width: "100%",
                padding: "11px 12px",
                borderRadius: "10px",
                border:
                  index === 0
                    ? "1px solid rgba(34,211,238,.25)"
                    : "1px solid transparent",
                background:
                  index === 0
                    ? "rgba(34,211,238,.10)"
                    : "transparent",
                color: index === 0 ? "#67e8f9" : "#cbd5e1",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <span>{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,rgba(34,197,94,.10),rgba(15,23,42,.7))",
            border: "1px solid rgba(34,197,94,.18)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#86efac" }}>
            ● SISTEMA PROTEGIDO
          </div>

          <strong
            style={{
              display: "block",
              marginTop: "7px",
              fontSize: "13px",
            }}
          >
            Modo simulação
          </strong>

          <small style={{ color: "#64748b" }}>
            Operações reais bloqueadas
          </small>
        </div>
      </aside>

      <section
        style={{
          flex: 1,
          padding: "28px",
          maxWidth: "1400px",
          boxSizing: "border-box",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <div
              style={{
                color: "#22d3ee",
                fontSize: "11px",
                fontWeight: "bold",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}
            >
              PRIVATE AI SYSTEM
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(28px,5vw,44px)",
                letterSpacing: "-1.5px",
              }}
            >
              AI Business Autopilot
            </h1>

            <p
              style={{
                marginTop: "10px",
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Centro de controlo inteligente do teu negócio.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(34,197,94,.08)",
              border: "1px solid rgba(34,197,94,.18)",
              color: "#86efac",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            <span>●</span>
            Sistema online
          </div>
        </header>

        <section
          style={{
            padding: "18px",
            borderRadius: "18px",
            marginBottom: "20px",
            background:
              "linear-gradient(135deg,rgba(34,211,238,.10),rgba(99,102,241,.08))",
            border: "1px solid rgba(34,211,238,.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px" }}>
                🛡️ Ambiente seguro de testes
              </strong>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#94a3b8",
                  fontSize: "12px",
                }}
              >
                O Autopilot está a funcionar em modo de simulação.
              </p>
            </div>

            <span
              style={{
                padding: "8px 12px",
                borderRadius: "999px",
                background: "rgba(250,204,21,.10)",
                color: "#fde68a",
                fontSize: "11px",
                fontWeight: "bold",
              }}
            >
              SIMULAÇÃO ATIVA
            </span>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          <Metric
            icon="💰"
            title="Receita"
            value={`${metrics.revenue.toLocaleString("pt-PT")} MT`}
            note="Simulada"
          />

          <Metric
            icon="📦"
            title="Produtos"
            value={String(state.products.length)}
            note="Pesquisados"
          />

          <Metric
            icon="📢"
            title="Campanhas"
            value={String(state.campaigns.length)}
            note="Simuladas"
          />

          <Metric
            icon="🛒"
            title="Pedidos"
            value={String(state.orders.length)}
            note="Registados"
          />

          <Metric
            icon="⚡"
            title="Automação"
            value={
              state.automation.simulationMode
                ? "SIMULAÇÃO"
                : "ATIVA"
            }
            note="Controlo protegido"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,2fr) minmax(280px,1fr)",
            gap: "18px",
          }}
        >
          <div
            style={{
              background: "rgba(15,23,42,.82)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: "20px",
              padding: "22px",
              boxShadow: "0 20px 60px rgba(0,0,0,.18)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ margin: 0, fontSize: "19px" }}>
                Centro de atividade
              </h2>

              <p
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  marginTop: "6px",
                }}
              >
                Todos os agentes disponíveis no sistema.
              </p>
            </div>

            <div style={{ display: "grid", gap: "8px" }}>
              {menu.slice(1).map(([icon, name, path]) => (
                <button
                  key={name}
                  onClick={() => router.push(path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    width: "100%",
                    padding: "13px",
                    background: "rgba(30,41,59,.55)",
                    border: "1px solid rgba(255,255,255,.05)",
                    borderRadius: "12px",
                    color: "#fff",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {icon}
                  </span>

                  <span style={{ flex: 1 }}>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "13px",
                      }}
                    >
                      {name}
                    </strong>

                    <small style={{ color: "#64748b" }}>
                      Agente disponível
                    </small>
                  </span>

                  <span
                    style={{
                      color: "#86efac",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    READY
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div
              style={{
                background: "rgba(15,23,42,.82)",
                border: "1px solid rgba(255,255,255,.07)",
                borderRadius: "20px",
                padding: "22px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "18px" }}>
                Segurança
              </h2>

              <Security
                label="Modo simulação"
                value={
                  state.automation.simulationMode
                    ? "ATIVO"
                    : "DESATIVADO"
                }
              />

              <Security
                label="Compras reais"
                value={
                  state.automation.realPurchasesEnabled
                    ? "ATIVAS"
                    : "BLOQUEADAS"
                }
              />

              <Security
                label="Anúncios reais"
                value={
                  state.automation.realAdsEnabled
                    ? "ATIVOS"
                    : "BLOQUEADOS"
                }
              />

              <Security
                label="Pagamentos"
                value={
                  state.automation.automaticPaymentsEnabled
                    ? "ATIVOS"
                    : "BLOQUEADOS"
                }
              />

              <Security
                label="Levantamentos"
                value="BLOQUEADOS"
              />
            </div>

            <div
              style={{
                background:
                  "linear-gradient(145deg,rgba(30,41,59,.9),rgba(15,23,42,.85))",
                border: "1px solid rgba(34,211,238,.12)",
                borderRadius: "20px",
                padding: "22px",
              }}
            >
              <p
                style={{
                  color: "#22d3ee",
                  fontSize: "10px",
                  fontWeight: "bold",
                  letterSpacing: "1.5px",
                }}
              >
                AUTOPILOT STATUS
              </p>

              <h2 style={{ margin: "8px 0", fontSize: "20px" }}>
                Sistema protegido
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "12px",
                  lineHeight: 1.6,
                }}
              >
                O sistema pode ser testado livremente sem realizar
                compras, pagamentos ou publicidade real.
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop: "18px",
            background: "rgba(15,23,42,.82)",
            border: "1px solid rgba(255,255,255,.07)",
            borderRadius: "20px",
            padding: "22px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px" }}>
            📊 Visão financeira
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "12px",
            }}
          >
            Dados simulados partilhados pelo Autopilot.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(150px,1fr))",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <Finance
              title="Receita"
              value={`${metrics.revenue.toLocaleString("pt-PT")} MT`}
            />

            <Finance
              title="Custos"
              value={`${metrics.costs.toLocaleString("pt-PT")} MT`}
            />

            <Finance
              title="Lucro"
              value={`${metrics.profit.toLocaleString("pt-PT")} MT`}
            />

            <Finance
              title="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
            />
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#475569",
            fontSize: "11px",
            padding: "25px 10px 10px",
          }}
        >
          AI Business Autopilot • Private System • Simulation Mode
        </footer>
      </section>

      <style jsx>{`
        @media (max-width: 800px) {
          main {
            display: block !important;
          }

          aside {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          }

          aside nav {
            display: flex !important;
            overflow-x: auto !important;
            padding-bottom: 5px !important;
          }

          aside nav button {
            min-width: 125px !important;
          }

          section {
            max-width: 100% !important;
          }
        }

        @media (max-width: 650px) {
          section {
            padding: 16px !important;
          }

          header {
            display: block !important;
          }

          header > div:last-child {
            display: inline-flex !important;
            margin-top: 15px !important;
          }

          h1 {
            font-size: 30px !important;
          }
        }

        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: minmax"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({
  icon,
  title,
  value,
  note,
}: {
  icon: string;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div
     