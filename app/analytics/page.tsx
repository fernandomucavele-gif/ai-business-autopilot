"use client";

import { useMemo, useState } from "react";

type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

type Campaign = {
  product: string;
  market: Market;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  revenue: number;
};

const markets: Market[] = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

const campaigns: Campaign[] = [
  {
    product: "Organizador inteligente para casa",
    market: "Moçambique",
    impressions: 12500,
    clicks: 640,
    spend: 3200,
    sales: 28,
    revenue: 8400,
  },
  {
    product: "Acessório portátil para automóvel",
    market: "Brasil",
    impressions: 18400,
    clicks: 920,
    spend: 4100,
    sales: 35,
    revenue: 12250,
  },
  {
    product: "Acessório de fitness doméstico",
    market: "Europa",
    impressions: 22100,
    clicks: 1100,
    spend: 5200,
    sales: 41,
    revenue: 16400,
  },
  {
    product: "Infoproduto de desenvolvimento pessoal",
    market: "Moçambique",
    impressions: 9800,
    clicks: 710,
    spend: 1800,
    sales: 32,
    revenue: 9600,
  },
];

function money(value: number) {
  return `${value.toLocaleString("pt-PT")} MT`;
}

export default function AnalyticsPage() {
  const [market, setMarket] = useState<Market>("Global");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const filteredCampaigns = useMemo(() => {
    if (market === "Global") {
      return campaigns;
    }

    return campaigns.filter((campaign) => campaign.market === market);
  }, [market]);

  const totals = useMemo(() => {
    const impressions = filteredCampaigns.reduce(
      (total, campaign) => total + campaign.impressions,
      0
    );

    const clicks = filteredCampaigns.reduce(
      (total, campaign) => total + campaign.clicks,
      0
    );

    const spend = filteredCampaigns.reduce(
      (total, campaign) => total + campaign.spend,
      0
    );

    const sales = filteredCampaigns.reduce(
      (total, campaign) => total + campaign.sales,
      0
    );

    const revenue = filteredCampaigns.reduce(
      (total, campaign) => total + campaign.revenue,
      0
    );

    const profit = revenue - spend;

    const ctr =
      impressions > 0 ? (clicks / impressions) * 100 : 0;

    const conversion =
      clicks > 0 ? (sales / clicks) * 100 : 0;

    const roas =
      spend > 0 ? revenue / spend : 0;

    return {
      impressions,
      clicks,
      spend,
      sales,
      revenue,
      profit,
      ctr,
      conversion,
      roas,
    };
  }, [filteredCampaigns]);

  function runAnalysis() {
    setAnalyzing(true);
    setAnalyzed(false);

    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  }

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div>
            <div className="eyebrow">AI BUSINESS AUTOPILOT</div>

            <h1>📊 Analytics AI</h1>

            <p>
              Analisa o desempenho das campanhas e prepara
              informações para o Supervisor AI.
            </p>
          </div>

          <div className="online">
            <span>●</span> Online
          </div>
        </header>

        <section className="simulation">
          <strong>🟢 MODO SIMULAÇÃO</strong>
          <span>
            Todos os números desta página são dados de teste.
            Nenhum dinheiro está a ser gasto.
          </span>
        </section>

        <section className="panel">
          <h2>⚙️ Análise</h2>

          <p className="muted">
            Escolhe o mercado que queres analisar.
          </p>

          <select
            value={market}
            onChange={(event) =>
              setMarket(event.target.value as Market)
            }
          >
            {markets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            className="primaryButton"
            onClick={runAnalysis}
            disabled={analyzing}
          >
            {analyzing
              ? "📊 A analisar..."
              : "🔍 Analisar desempenho"}
          </button>

          {analyzed && (
            <div className="success">
              ✅ Análise concluída em modo de simulação.
            </div>
          )}
        </section>

        <section className="cards">
          <div className="card">
            <span>👁️ Impressões</span>
            <strong>
              {totals.impressions.toLocaleString("pt-PT")}
            </strong>
            <small>Visualizações</small>
          </div>

          <div className="card">
            <span>👆 Cliques</span>
            <strong>
              {totals.clicks.toLocaleString("pt-PT")}
            </strong>
            <small>Cliques simulados</small>
          </div>

          <div className="card">
            <span>💰 Gastos</span>
            <strong>{money(totals.spend)}</strong>
            <small>Gasto simulado</small>
          </div>

          <div className="card">
            <span>🛒 Vendas</span>
            <strong>{totals.sales}</strong>
            <small>Vendas simuladas</small>
          </div>

          <div className="card">
            <span>💵 Receita</span>
            <strong>{money(totals.revenue)}</strong>
            <small>Receita simulada</small>
          </div>

          <div className="card">
            <span>📈 Lucro</span>
            <strong>{money(totals.profit)}</strong>
            <small>Receita menos gastos</small>
          </div>
        </section>

        <section className="cards secondary">
          <div className="card">
            <span>CTR</span>
            <strong>{totals.ctr.toFixed(2)}%</strong>
            <small>Cliques / impressões</small>
          </div>

          <div className="card">
            <span>Conversão</span>
            <strong>{totals.conversion.toFixed(2)}%</strong>
            <small>Vendas / cliques</small>
          </div>

          <div className="card">
            <span>ROAS</span>
            <strong>{totals.roas.toFixed(2)}x</strong>
            <small>Receita / gasto</small>
          </div>
        </section>

        <section className="panel">
          <h2>📋 Desempenho por campanha</h2>

          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Mercado</th>
                  <th>Impressões</th>
                  <th>Cliques</th>
                  <th>Gasto</th>
                  <th>Vendas</th>
                  <th>Receita</th>
                  <th>ROAS</th>
                </tr>
              </thead>

              <tbody>
                {filteredCampaigns.map((campaign) => {
                  const roas =
                    campaign.spend > 0
                      ? campaign.revenue / campaign.spend
                      : 0;

                  return (
                    <tr key={campaign.product}>
                      <td>{campaign.product}</td>
                      <td>{campaign.market}</td>
                      <td>
                        {campaign.impressions.toLocaleString(
                          "pt-PT"
                        )}
                      </td>
                      <td>
                        {campaign.clicks.toLocaleString("pt-PT")}
                      </td>
                      <td>{money(campaign.spend)}</td>
                      <td>{campaign.sales}</td>
                      <td>{money(campaign.revenue)}</td>
                      <td>
                        <strong>{roas.toFixed(2)}x</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="empty">
              Não existem campanhas simuladas para este mercado.
            </div>
          )}
        </section>

        <section className="insights">
          <div className="insight">
            <strong>🤖 Análise automática</strong>
            <p>
              O Analytics AI reúne os dados das campanhas para
              alimentar os próximos processos do Autopilot.
            </p>
          </div>

          <div className="insight">
            <strong>⚠️ Alertas</strong>
            <p>
              Na versão real, o sistema poderá identificar campanhas
              com gastos sem resultados de acordo com as regras
              definidas.
            </p>
          </div>

          <div className="insight">
            <strong>🔄 Otimização</strong>
            <p>
              Os resultados poderão ser utilizados pelo Supervisor AI
              para preparar novas ações.
            </p>
          </div>
        </section>

        <section className="security">
          🔐 <strong>Segurança:</strong> compras, pagamentos,
          publicação de anúncios e outras ações financeiras continuam
          BLOQUEADAS enquanto o sistema estiver em simulação.
        </section>
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f4f7fb;
          color: #172033;
          padding: 24px 16px 50px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        }

        .eyebrow {
          color: #64748b;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        h1 {
          font-size: 34px;
          margin: 8px 0;
        }

        h2 {
          margin-top: 0;
        }

        .header p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .online {
          color: #15803d;
          font-weight: 700;
          white-space: nowrap;
        }

        .simulation {
          margin-top: 18px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #166534;
        }

        .panel {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          margin-top: 18px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        }

        .muted {
          color: #64748b;
        }

        select {
          width: 100%;
          padding: 13px;
          border: 1px solid #dbe2ea;
          border-radius: 10px;
          background: #ffffff;
          font-size: 15px;
        }

        .primaryButton {
          width: 100%;
          margin-top: 14px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: #2563eb;
          color: white;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
        }

        .primaryButton:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .success {
          margin-top: 14px;
          padding: 13px;
          border-radius: 10px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }

        .cards {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(180px, 1fr)
          );
          gap: 15px;
        }

        .secondary {
          grid-template-columns: repeat(
            auto-fit,
            minmax(220px, 1fr)
          );
        }

        .card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        }

        .card span {
          display: block;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .card strong {
          display: block;
          font-size: 25px;
          margin-bottom: 5px;
        }

        .card small {
          color: #94a3b8;
        }

        .tableWrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          min-width: 900px;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          color: #64748b;
          font-size: 13px;
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        td {
          padding: 13px 12px;
          border-bottom: 1px solid #f1f5f9;
        }

        td:first-child {
          font-weight: 700;
        }

        .empty {
          margin-top: 18px;
          padding: 18px;
          text-align: center;
          background: #f8fafc;
          border-radius: 12px;
          color: #64748b;
        }

        .insights {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(240px, 1fr)
          );
          gap: 15px;
        }

        .insight {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
        }

        .insight p {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .security {
          margin-top: 18px;
          padding: 18px;
          border-radius: 16px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          line-height: 1.6;
        }

        @media (max-width: 600px) {
          .page {
            padding: 12px 10px 35px;
          }

          .header {
            padding: 20px;
            flex-direction: column;
          }

          h1 {
            font-size: 28px;
          }

          .panel {
            padding: 18px;
          }
        }
      `}</style>
    </main>
  );
  }
