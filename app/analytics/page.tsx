"use client";

import { useState } from "react";

const data = [
  {
    product: "Mini aspirador portátil",
    country: "Moçambique 🇲🇿",
    sales: 38,
    revenue: 45600,
    adSpend: 12000,
    profit: 33600,
    roas: 3.8,
  },
  {
    product: "Luz LED com sensor",
    country: "Brasil 🇧🇷",
    sales: 52,
    revenue: 62400,
    adSpend: 18000,
    profit: 44400,
    roas: 3.47,
  },
  {
    product: "Garrafa térmica",
    country: "Portugal 🇵🇹",
    sales: 24,
    revenue: 36000,
    adSpend: 14000,
    profit: 22000,
    roas: 2.57,
  },
  {
    product: "Acessório automóvel",
    country: "África do Sul 🇿🇦",
    sales: 31,
    revenue: 40300,
    adSpend: 11000,
    profit: 29300,
    roas: 3.66,
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("Últimos 30 dias");
  const [analyzed, setAnalyzed] = useState(false);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalSpend = data.reduce((sum, item) => sum + item.adSpend, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const roas = totalSpend ? totalRevenue / totalSpend : 0;

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
              background: "#dcfce7",
              color: "#166534",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📊 ANALYTICS AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Centro de análise
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Analisa vendas, anúncios, custos, lucro e desempenho por mercado.
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
          <label style={{ fontWeight: 700 }}>Período</label>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              marginTop: 8,
              padding: 14,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            <option>Hoje</option>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </select>

          <button
            onClick={() => setAnalyzed(true)}
            style={{
              width: "100%",
              marginTop: 18,
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#166534",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            📊 Analisar desempenho
          </button>
        </section>

        {analyzed && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(200px,1fr))",
                gap: 15,
                marginBottom: 22,
              }}
            >
              {[
                ["💰 Receita", `${totalRevenue.toLocaleString()} MT`],
                ["🛒 Vendas", totalSales],
                ["💸 Gastos", `${totalSpend.toLocaleString()} MT`],
                ["📈 Lucro", `${totalProfit.toLocaleString()} MT`],
                ["🚀 ROAS", roas.toFixed(2)],
              ].map(([title, value]) => (
                <div
                  key={title}
                  style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 16,
                    boxShadow: "0 4px 18px rgba(0,0,0,.05)",
                  }}
                >
                  <div style={{ color: "#64748b", marginBottom: 8 }}>
                    {title}
                  </div>
                  <strong style={{ fontSize: 24 }}>{value}</strong>
                </div>
              ))}
            </section>

            <section
              style={{
                background: "white",
                padding: 22,
                borderRadius: 18,
                boxShadow: "0 5px 25px rgba(0,0,0,.06)",
              }}
            >
              <h2>🌍 Desempenho por produto e mercado</h2>

              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 15,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: 10 }}>
                        Produto
                      </th>
                      <th style={{ textAlign: "left", padding: 10 }}>
                        Mercado
                      </th>
                      <th style={{ padding: 10 }}>Vendas</th>
                      <th style={{ padding: 10 }}>Receita</th>
                      <th style={{ padding: 10 }}>Gasto</th>
                      <th style={{ padding: 10 }}>Lucro</th>
                      <th style={{ padding: 10 }}>ROAS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item) => (
                      <tr key={item.product}>
                        <td style={{ padding: 10 }}>
                          {item.product}
                        </td>
                        <td style={{ padding: 10 }}>
                          {item.country}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.sales}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.revenue.toLocaleString()} MT
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.adSpend.toLocaleString()} MT
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.profit.toLocaleString()} MT
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item.roas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: 22,
                  padding: 15,
                  borderRadius: 10,
                  background: "#eff6ff",
                  color: "#1e40af",
                }}
              >
                🧠 <strong>Insight da IA:</strong> estes números são
                simulados para testar o painel. Na versão real, os dados
                virão das campanhas, pedidos, custos e vendas conectados
                ao sistema.
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
    }
