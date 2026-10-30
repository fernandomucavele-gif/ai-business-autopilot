"use client";

import { useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Market } from "../../lib/autopilot";

const markets: Market[] = ["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "EUA", "Global"];
const money = (value: number) => value.toLocaleString("pt-MZ", { maximumFractionDigits: 2 }) + " MT";

export default function AnalyticsPage() {
  const { state, metrics } = useAutopilot();
  const [market, setMarket] = useState<Market>("Global");

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
    () => state.finance.filter(item => {
      if (market === "Global") return true;
      // Os registos financeiros atuais não guardam mercado; não atribuir um mercado por suposição.
      return false;
    }),
    [state.finance, market]
  );
  const revenue = finance.filter(item => item.type === "revenue").reduce((sum, item) => sum + item.amount, 0);
  const costs = finance.filter(item => item.type !== "revenue").reduce((sum, item) => sum + item.amount, 0);
  const adSpend = finance.filter(item => item.type === "ad_cost").reduce((sum, item) => sum + item.amount, 0);
  const roas = adSpend > 0 ? revenue / adSpend : 0;
  const orderValue = orders.reduce((sum, item) => sum + item.amount, 0);

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
          <strong>Dados reais podem ser registados durante os testes.</strong>
          <p>Esta página já não apresenta impressões, cliques ou vendas inventadas. Os valores abaixo são os registos atualmente guardados. Como o sistema não está ligado às plataformas de anúncios, não existem métricas reais de impressões ou cliques.</p>
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
          <article className="card"><span>ROAS dos registos</span><strong>{roas.toFixed(2)}x</strong><small>Sem gasto de anúncios registado: 0x</small></article>
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
          <p>Impressões, cliques, CTR e conversões não são apresentados porque não há integração de leitura com Meta Ads, Google Ads ou outras plataformas. Os registos financeiros não têm campo de mercado; por isso, só são apresentados no filtro Global, evitando atribuições incorretas.</p>
          <p>Compras, pagamentos, anúncios pagos e contactos automáticos continuam desativados.</p>
        </section>
      </div>
      <style jsx>{`
        *{box-sizing:border-box}.page{min-height:100vh;background:#f4f7fb;color:#172033;padding:22px 14px 45px}.container{max-width:1150px;margin:auto}.header,.panel,.card,.notice{background:#fff;border:1px solid #e5eaf2;border-radius:16px;padding:20px;margin-bottom:16px}.header{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}.eyebrow{font-size:12px;color:#64748b;font-weight:800;letter-spacing:1px}h1{font-size:32px;margin:8px 0}h2{font-size:20px;margin:0 0 14px}.header p,.notice p{color:#64748b;line-height:1.55}.badge{align-self:flex-start;border-radius:20px;background:#fff7e6;color:#925b00;padding:8px 12px;font-size:12px;font-weight:800}.notice{background:#eff6ff;border-color:#bfdbfe;color:#1e40af}.notice p{margin-bottom:0;color:#334e7d}.warning{background:#fff7ed;border-color:#fed7aa;color:#9a3412}.warning p{color:#7c3f15}label{display:block;font-weight:700;margin-bottom:8px}select{width:100%;padding:12px;border:1px solid #cbd5e1;border-radius:10px;background:white}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-bottom:16px}.card{margin:0}.card span,.card small{display:block;color:#64748b;font-size:13px}.card strong{display:block;font-size:23px;margin:9px 0;overflow-wrap:anywhere}.tableWrap{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:650px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e5eaf2;font-size:14px}th{color:#64748b}.empty{padding:16px;background:#f8fafc;border-radius:10px;color:#64748b}@media(max-width:600px){h1{font-size:27px}.header,.panel,.notice{padding:16px}}
      `}</style>
    </main>
  );
}
