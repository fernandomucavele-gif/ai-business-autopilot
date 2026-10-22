
"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  Wallet,
  Target,
  FileText,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

type Report = {
  date: string;
  revenue: number;
  costs: number;
  orders: number;
  campaigns: number;
};

const demoReports: Report[] = [
  { date: "2026-10-01", revenue: 12500, costs: 4200, orders: 18, campaigns: 2 },
  { date: "2026-10-05", revenue: 18300, costs: 7100, orders: 26, campaigns: 3 },
  { date: "2026-10-10", revenue: 15200, costs: 5300, orders: 21, campaigns: 2 },
  { date: "2026-10-15", revenue: 24600, costs: 9400, orders: 34, campaigns: 4 },
  { date: "2026-10-20", revenue: 21100, costs: 7600, orders: 29, campaigns: 3 },
];

const money = (value: number) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  }).format(value);

const dateLabel = (value: string) =>
  new Date(value + "T12:00:00").toLocaleDateString("pt-PT");

export default function ReportsAIPage() {
  const [period, setPeriod] = useState("30");
  const [status, setStatus] = useState<"simulation" | "connected">("simulation");
  const [notice, setNotice] = useState("");

  // Estes registos são demonstrações, não dados reais do negócio.
  const reports = useMemo(() => {
    const days = Number(period);
    const cutoff = new Date("2026-10-22T12:00:00");
    cutoff.setDate(cutoff.getDate() - days);

    return demoReports.filter(
      (item) => new Date(item.date + "T12:00:00") >= cutoff
    );
  }, [period]);

  const totals = useMemo(() => {
    const revenue = reports.reduce((sum, r) => sum + r.revenue, 0);
    const costs = reports.reduce((sum, r) => sum + r.costs, 0);
    const orders = reports.reduce((sum, r) => sum + r.orders, 0);
    const profit = revenue - costs;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return { revenue, costs, orders, profit, margin };
  }, [reports]);

  const maxRevenue = Math.max(
    ...reports.map((r) => r.revenue),
    1
  );

  function exportCSV() {
    const header = ["Data", "Receita_MZN", "Custos_MZN", "Lucro_MZN", "Encomendas"];
    const rows = reports.map((r) => [
      r.date,
      r.revenue,
      r.costs,
      r.revenue - r.costs,
      r.orders,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reports-ai-demonstracao.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Relatório CSV de demonstração exportado.");
  }

  const cardStyle = {
    background: "var(--card, #ffffff)",
    border: "1px solid var(--border, #e5e7eb)",
    borderRadius: 16,
    padding: 18,
    minWidth: 0,
  } as const;

  const muted = { color: "var(--muted, #6b7280)" } as const;

  return (
    <main
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 16px 48px",
        color: "var(--foreground, #111827)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <BarChart3 size={28} />
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>
              Reports AI
            </h1>
          </div>
          <p style={{ margin: 0, ...muted }}>
            Relatórios e indicadores do teu negócio.
          </p>
        </div>

        <button
          onClick={exportCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: 0,
            borderRadius: 10,
            padding: "12px 16px",
            background: "#2563eb",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Download size={18} />
          Exportar CSV
        </button>
      </header>

      <section
        style={{
          ...cardStyle,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 22,
          background: "var(--notice-bg, #eff6ff)",
        }}
      >
        <AlertCircle size={22} color="#2563eb" />
        <div>
          <strong>Modo de demonstração</strong>
          <p style={{ margin: "5px 0 0", ...muted }}>
            Os valores apresentados são dados de exemplo. Ainda não foram
            carregados dados reais do Supabase ou dos módulos do Autopilot.
          </p>
          <span style={{ display: "none" }}>{status}</span>
        </div>
      </section>

      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CalendarDays size={19} />
          <label htmlFor="report-period" style={{ fontWeight: 700 }}>
            Período:
          </label>
          <select
            id="report-period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid var(--border, #d1d5db)",
              borderRadius: 9,
              background: "var(--card, #fff)",
              color: "inherit",
            }}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>

        <span style={{ fontSize: 13, ...muted }}>
          {reports.length} registos de demonstração
        </span>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Metric
          title="Receita demonstrativa"
          value={money(totals.revenue)}
          icon={<Wallet size={21} />}
        />
        <Metric
          title="Custos demonstrativos"
          value={money(totals.costs)}
          icon={<ShoppingCart size={21} />}
        />
        <Metric
          title="Lucro estimado"
          value={money(totals.profit)}
          icon={<TrendingUp size={21} />}
        />
        <Metric
          title="Encomendas de exemplo"
          value={String(totals.orders)}
          icon={<Target size={21} />}
        />
      </section>

      <section style={{ ...cardStyle, marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <BarChart3 size={21} />
          <h2 style={{ fontSize: 19, margin: 0 }}>Receita por registo</h2>
        </div>
        <p style={{ ...muted, marginTop: 0, fontSize: 13 }}>
          Comparação visual dos valores de exemplo em meticais (MZN).
        </p>

        {reports.length === 0 ? (
          <p style={muted}>Não existem registos neste período de demonstração.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 22 }}>
            {reports.map((report) => (
              <div key={report.date}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 7,
                    fontSize: 13,
                  }}
                >
                  <span>{dateLabel(report.date)}</span>
                  <strong>{money(report.revenue)}</strong>
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: 99,
                    background: "var(--border, #e5e7eb)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(report.revenue / maxRevenue) * 100}%`,
                      borderRadius: 99,
                      background: "#2563eb",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 19, margin: "0 0 8px" }}>
          Resumo financeiro
        </h2>
        <p style={{ ...muted, marginTop: 0 }}>
          Margem estimada dos registos apresentados:{" "}
          <strong>{totals.margin.toFixed(1)}%</strong>
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <Summary label="Receita" value={money(totals.revenue)} />
          <Summary label="Custos" value={money(totals.costs)} />
          <Summary label="Resultado" value={money(totals.profit)} />
        </div>
      </section>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <FileText size={21} />
          <h2 style={{ fontSize: 19, margin: 0 }}>Detalhes dos registos</h2>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 600,
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                {["Data", "Receita", "Custos", "Resultado", "Encomendas"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 12,
                        borderBottom: "1px solid var(--border, #e5e7eb)",
                        fontSize: 13,
                        ...muted,
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.date}>
                  <td style={cellStyle}>{dateLabel(r.date)}</td>
                  <td style={cellStyle}>{money(r.revenue)}</td>
                  <td style={cellStyle}>{money(r.costs)}</td>
                  <td style={cellStyle}>{money(r.revenue - r.costs)}</td>
                  <td style={cellStyle}>{r.orders}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} style={cellStyle}>
                    Sem registos para este período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {notice && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            maxWidth: "calc(100vw - 40px)",
            padding: 14,
            background: "#111827",
            color: "#fff",
            borderRadius: 12,
            zIndex: 50,
          }}
        >
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Fechar aviso"
            style={{
              marginLeft: 12,
              color: "#fff",
              background: "transparent",
              border: 0,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 12, ...muted }}>
        Reports AI · Dados demonstrativos · Nenhuma operação comercial real
        foi executada.
      </p>
    </main>
  );
}

function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article
      style={{
        background: "var(--card, #fff)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: 16,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <span style={{ color: "var(--muted, #6b7280)", fontSize: 13 }}>
          {title}
        </span>
        {icon}
      </div>
      <p style={{ fontSize: 23, fontWeight: 800, margin: "16px 0 0" }}>
        {value}
      </p>
    </article>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        background: "var(--summary-bg, #f9fafb)",
      }}
    >
      <div style={{ color: "var(--muted, #6b7280)", fontSize: 13 }}>
        {label}
      </div>
      <strong style={{ display: "block", marginTop: 7 }}>{value}</strong>
    </div>
  );
}

const cellStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid var(--border, #e5e7eb)",
  whiteSpace: "nowrap",
};
