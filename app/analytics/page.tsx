"use client";

import { useEffect, useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import { supabase } from "../../lib/supabase";
import type { Market } from "../../lib/autopilot";

type AdMetric = {
  id: string;
  campaign_id: string;
  metric_date: string;
  impressions: number;
  clicks: number;
  spend: number | string;
  conversions: number;
  attributed_revenue: number | string;
  currency: string;
  is_simulation: boolean;
};

const markets: Market[] = ["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "EUA", "Global"];
const money = (value: number, currency = "MZN") =>
  new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 2 }).format(value) + " " + currency;
const number = (value: number) => new Intl.NumberFormat("pt-MZ").format(value);
const amount = (value: number | string) => Number(value) || 0;

export default function AnalyticsPage() {
  const { state } = useAutopilot();
  const [market, setMarket] = useState<Market>("Global");
  const [adMetrics, setAdMetrics] = useState<AdMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAdMetrics() {
      setMetricsLoading(true);
      setMetricsError("");
      const { data, error } = await supabase
        .from("ad_metrics_daily")
        .select("id,campaign_id,metric_date,impressions,clicks,spend,conversions,attributed_revenue,currency,is_simulation")
        .eq("is_simulation", true)
        .order("metric_date", { ascending: false })
        .limit(500);

      if (!active) return;
      if (error) {
        setMetricsError("Não foi possível ler as métricas guardadas. Verifica a sessão e as permissões da base de dados.");
        setAdMetrics([]);
      } else {
        setAdMetrics((data ?? []) as AdMetric[]);
      }
      setMetricsLoading(false);
    }

    void loadAdMetrics();
    return () => { active = false; };
  }, []);

  const orders = useMemo(
    () => market === "Global" ? state.orders : state.orders.filter(item => item.market === market),
    [state.orders, market]
  );
  const productIds = useMemo(
    () => new Set((market === "Global" ? state.products : state.products.filter(item => item.market === market)).map(item => item.id)),
    [state.products, market]
  );
  const campaigns = useMemo(
    () => state.campaigns.filter(item => market === "Global" || item.market === market),
    [state.campaigns, market]
  );
  const finance = useMemo(
    () => state.finance.filter(item => market === "Global"),
    [state.finance, market]
  );
  const visibleAdMetrics = useMemo(() => {
    if (market === "Global") return adMetrics;
    const campaignIds = new Set(campaigns.map(item => item.id));
    return adMetrics.filter(item => campaignIds.has(item.campaign_id));
  }, [adMetrics, campaigns, market]);

  const revenue = finance.filter(item => item.type === "revenue").reduce((sum, item) => sum + item.amount, 0);
  const costs = finance.filter(item => item.type !== "revenue").reduce((sum, item) => sum + item.amount, 0);
  const orderValue = orders.reduce((sum, item) => sum + item.amount, 0);

  const adTotals = visibleAdMetrics.reduce((totals, item) => ({
    impressions: totals.impressions + item.impressions,
    clicks: totals.clicks + item.clicks,
    spend: totals.spend + amount(item.spend),
    conversions: totals.conversions + item.conversions,
    attributedRevenue: totals.attributedRevenue + amount(item.attributed_revenue),
  }), { impressions: 0, clicks: 0, spend: 0, conversions: 0, attributedRevenue: 0 });
  const ctr = adTotals.impressions > 0 ? (adTotals.clicks / adTotals.impressions) * 100 : 0;
  const roas = adTotals.spend > 0 ? adTotals.attributedRevenue / adTotals.spend : 0;
  const cpc = adTotals.clicks > 0 ? adTotals.spend / adTotals.clicks : 0;
  const cpa = adTotals.conversions > 0 ? adTotals.spend / adTotals.conversions : 0;

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div>
            <div className="eyebrow">AI BUSINESS AUTOPILOT</div>
            <h1>📊 Analytics AI</h1>
            <p>Indicadores calculados a partir dos registos guardados no Autopilot.</p>
          </div>
          <span className="badge">MODO SIMULAÇÃO</span>
        </header>

        <section className="notice">
          <strong>Métricas ligadas à base de dados.</strong>
          <p>O painel lê impressões, cliques, gastos, conversões e receita atribuída da tabela ad_metrics_daily. Neste momento, só são aceites registos marcados como simulação. Não existe ligação ativa ao Meta Ads ou Google Ads e nenhum valor é inventado.</p>
        </section>

        <section className="panel">
          <label htmlFor="market">Filtrar encomendas e campanhas por mercado</label>
          <select id="market" value={market} onChange={event => setMarket(event.target.value as Market)}>
            {markets.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </section>

        <section className="cards">
          <article className="card"><span>Produtos registados</span><strong>{productIds.size}</strong></article>
          <article className="card"><span>Campanhas planeadas</span><strong>{campaigns.length}</strong><small>Orçamentos planeados, não gastos reais</small></article>
          <article className="card"><span>Encomendas</span><strong>{orders.length}</strong></article>
          <article className="card"><span>Valor das encomendas</span><strong>{money(orderValue)}</strong><small>Valor registado nas encomendas</small></article>
          <article className="card"><span>Receita financeira guardada</span><strong>{money(revenue)}</strong></article>
          <article className="card"><span>Custos financeiros guardados</span><strong>{money(costs)}</strong></article>
          <article className="card"><span>Resultado financeiro</span><strong>{money(revenue - costs)}</strong></article>
        </section>

        <section className="panel">
          <h2>Métricas de campanhas (simulação)</h2>
          {metricsLoading ? <p className="empty">A carregar métricas guardadas...</p> : metricsError ? <p className="error">{metricsError}</p> : visibleAdMetrics.length === 0 ? (
            <p className="empty">Ainda não existem métricas registadas para este filtro. Impressões, cliques, CTR, gastos e conversões permanecem a zero até existirem registos.</p>
          ) : (
            <>
              <div className="cards metricCards">
                <article className="card"><span>Impressões</span><strong>{number(adTotals.impressions)}</strong></article>
                <article className="card"><span>Cliques</span><strong>{number(adTotals.clicks)}</strong></article>
                <article className="card"><span>CTR</span><strong>{ctr.toFixed(2)}%</strong></article>
                <article className="card"><span>Gasto registado</span><strong>{money(adTotals.spend)}</strong></article>
                <article className="card"><span>Conversões</span><strong>{number(adTotals.conversions)}</strong></article>
                <article className="card"><span>Receita atribuída</span><strong>{money(adTotals.attributedRevenue)}</strong></article>
                <article className="card"><span>ROAS</span><strong>{roas.toFixed(2)}x</strong></article>
                <article className="card"><span>Custo por clique</span><strong>{money(cpc)}</strong></article>
                <article className="card"><span>Custo por conversão</span><strong>{money(cpa)}</strong></article>
              </div>
              <div className="tableWrap"><table><thead><tr><th>Data</th><th>Campanha</th><th>Impressões</th><th>Cliques</th><th>Gasto</th><th>Conversões</th><th>Receita atribuída</th></tr></thead><tbody>
                {visibleAdMetrics.map(item => (
                  <tr key={item.id}>
                    <td>{item.metric_date}</td>
                    <td>{state.campaigns.find(campaign => campaign.id === item.campaign_id)?.id ?? item.campaign_id}</td>
                    <td>{number(item.impressions)}</td>
                    <td>{number(item.clicks)}</td>
                    <td>{money(amount(item.spend), item.currency)}</td>
                    <td>{number(item.conversions)}</td>
                    <td>{money(amount(item.attributed_revenue), item.currency)}</td>
                  </tr>
                ))}
              </tbody></table></div>
            </>
          )}
          <p className="footnote">CTR = cliques ÷ impressões. ROAS = receita atribuída ÷ gasto. CPC e custo por conversão são calculados apenas quando existe denominador maior que zero.</p>
        </section>

        <section className="panel">
          <h2>Encomendas por estado</h2>
          {orders.length === 0 ? <p className="empty">Ainda não existem encomendas neste mercado.</p> : (
            <div className="tableWrap"><table><thead><tr><th>Encomenda</th><th>Cliente</th><th>Produto</th><th>Estado</th><th>Valor</th></tr></thead><tbody>
              {orders.map(order => {
                const product = state.products.find(item => item.id === order.productId);
                return <tr key={order.id}><td>{order.id}</td><td>{order.customerName}</td><td>{product?.name ?? "Produto não encontrado"}</td><td>{order.status}</td><td>{money(order.amount)}</td></tr>;
              })}
            </tbody></table></div>
          )}
        </section>

        <section className="panel">
          <h2>Campanhas registadas</h2>
          {campaigns.length === 0 ? <p className="empty">Ainda não existem campanhas neste mercado.</p> : (
            <div className="tableWrap"><table><thead><tr><th>Produto</th><th>Mercado</th><th>Objetivo</th><th>Orçamento diário</th><th>Estado</th></tr></thead><tbody>
              {campaigns.map(campaign => <tr key={campaign.id}><td>{state.products.find(item => item.id === campaign.productId)?.name ?? "Produto não encontrado"}</td><td>{campaign.market}</td><td>{campaign.objective}</td><td>{money(campaign.dailyBudget)}</td><td>{campaign.status === "simulation" ? "Simulação" : campaign.status}</td></tr>)}
            </tbody></table></div>
          )}
        </section>

        <section className="notice warning">
          <strong>Limitações atuais</strong>
          <p>As métricas desta secção são exclusivamente de simulação. Para métricas reais será necessária uma integração autorizada com Meta Ads, Google Ads ou outra plataforma. Os registos financeiros não têm campo de mercado; por isso, só são apresentados no filtro Global, evitando atribuições incorretas.</p>
          <p>Compras, pagamentos, anúncios pagos e contactos automáticos continuam desativados.</p>
        </section>
      </div>
      <style jsx>{`
        *{box-sizing:border-box}.page{min-height:100vh;background:#f4f7fb;color:#172033;padding:22px 14px 45px}.container{max-width:1150px;margin:auto}.header,.panel,.card,.notice{background:#fff;border:1px solid #e5eaf2;border-radius:16px;padding:20px;margin-bottom:16px}.header{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.eyebrow{font-size:12px;color:#64748b;font-weight:800;letter-spacing:1px}h1{font-size:32px;margin:8px 0}h2{font-size:20px;margin:0 0 14px}.header p,.notice p{color:#64748b;line-height:1.55}.badge{align-self:flex-start;border-radius:20px;background:#fff7e6;color:#925b00;padding:8px 12px;font-size:12px;font-weight:800}.notice{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.notice p{margin-bottom:0;color:#334e7d}.warning{background:#fff7ed;border-color:#fed7aa;color:#9a3412}.warning p{color:#7c3f15}label{display:block;font-weight:700;margin-bottom:8px}select{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;background:white}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:16px}.card{margin:0}.card span,.card small{display:block;color:#64748b;font-size:13px}.card strong{display:block;font-size:23px;margin:9px 0;overflow-wrap:anywhere}.tableWrap{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:650px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e5eaf2;font-size:14px}th{color:#64748b}.empty{padding:16px;background:#f8fafc;border-radius:10px;color:#64748b}.error{padding:16px;background:#fff1f2;border-radius:10px;color:#9f1239}.footnote{margin:14px 0 0;color:#64748b;font-size:12px;line-height:1.5}.metricCards{margin-top:14px}.metricCards .card{padding:15px}@media(max-width:600px){h1{font-size:27px}.header,.panel,.notice{padding:16px}}
      `}</style>
    </main>
  );
}
