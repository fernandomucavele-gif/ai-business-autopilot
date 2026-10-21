
"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  Eye,
  Package,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";

type Period = "7 dias" | "30 dias" | "90 dias";

const products = [
  { name: "Relógio Smart Pro", category: "Eletrónica", price: 2450, sold: 24 },
  { name: "Auscultadores Wireless", category: "Eletrónica", price: 1850, sold: 19 },
  { name: "Mochila Urbana", category: "Acessórios", price: 1250, sold: 15 },
  { name: "Óculos Modernos", category: "Moda", price: 950, sold: 12 },
  { name: "Ténis Urbanos", category: "Moda", price: 3200, sold: 8 },
];

const activities = [
  { title: "Produto analisado", detail: "Relógio Smart Pro", time: "Há 15 minutos", status: "Concluído" },
  { title: "Relatório de desempenho", detail: "Análise demonstrativa", time: "Há 1 hora", status: "Concluído" },
  { title: "Pesquisa de oportunidades", detail: "Mercado de Moçambique", time: "Hoje", status: "Simulação" },
  { title: "Campanha publicitária", detail: "Não foi publicada nenhuma campanha", time: "Hoje", status: "Simulação" },
];

const money = (value: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  }).format(value);

export default function ShopAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("30 dias");
  const [refreshed, setRefreshed] = useState(false);

  const factor = period === "7 dias" ? 0.25 : period === "90 dias" ? 2.4 : 1;

  const metrics = useMemo(() => {
    const orders = Math.round(78 * factor);
    const revenue = Math.round(146500 * factor);
    const visitors = Math.round(2840 * factor);
    const conversion = visitors ? (orders / visitors) * 100 : 0;

    return { orders, revenue, visitors, conversion };
  }, [factor]);

  const topProducts = useMemo(
    () => products.map((product) => ({
      ...product,
      sold: Math.max(1, Math.round(product.sold * factor)),
      revenue: Math.round(product.price * product.sold * factor),
    })),
    [factor]
  );

  const maxRevenue = Math.max(...topProducts.map((product) => product.revenue));

  return (
    <main className="analytics">
      <header className="topbar">
        <a className="back" href="/shop">
          <ArrowLeft size={18} />
          Voltar à loja
        </a>
        <span className="demo"><Sparkles size={15} /> Modo de simulação</span>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow"><BarChart3 size={16} /> INTELIGÊNCIA DE NEGÓCIO</div>
          <h1>Análise da loja</h1>
          <p>Acompanha o desempenho demonstrativo da loja e identifica oportunidades de melhoria.</p>
        </div>
        <div className="hero-actions">
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value as Period)}
            aria-label="Período da análise"
          >
            <option>7 dias</option>
            <option>30 dias</option>
            <option>90 dias</option>
          </select>
          <button
            className="refresh"
            onClick={() => setRefreshed(true)}
            type="button"
          >
            <RefreshCw size={16} /> Atualizar
          </button>
        </div>
      </section>

      {refreshed && (
        <div className="notice">
          <CheckCircle2 size={17} />
          Os indicadores demonstrativos foram recalculados para o período selecionado.
        </div>
      )}

      <div className="simulation">
        <Eye size={18} />
        <div>
          <strong>Dados de demonstração</strong>
          <p>Estes números são exemplos para testar a interface. Não representam vendas reais nem estão ligados a pagamentos.</p>
        </div>
      </div>

      <section className="metrics">
        <Metric
          title="Receita simulada"
          value={money(metrics.revenue)}
          note="Valor ilustrativo"
          icon={<CircleDollarSign />}
          positive
        />
        <Metric
          title="Encomendas simuladas"
          value={metrics.orders.toLocaleString("pt-MZ")}
          note="Registos demonstrativos"
          icon={<ShoppingCart />}
          positive
        />
        <Metric
          title="Visitantes simulados"
          value={metrics.visitors.toLocaleString("pt-MZ")}
          note="Tráfego ilustrativo"
          icon={<Eye />}
          positive
        />
        <Metric
          title="Conversão estimada"
          value={`${metrics.conversion.toFixed(2)}%`}
          note="Cálculo demonstrativo"
          icon={<TrendingUp />}
          positive
        />
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Produtos em destaque</h2>
              <p>Ordenados por receita ilustrativa</p>
            </div>
            <Package size={21} />
          </div>

          <div className="product-list">
            {topProducts
              .slice()
              .sort((a, b) => b.revenue - a.revenue)
              .map((product, index) => (
                <div className="product-row" key={product.name}>
                  <div className="rank">{index + 1}</div>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <span>{product.category} · {product.sold} unidades simuladas</span>
                    <div className="bar">
                      <div style={{ width: `${(product.revenue / maxRevenue) * 100}%` }} />
                    </div>
                  </div>
                  <strong className="product-revenue">{money(product.revenue)}</strong>
                </div>
              ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Resumo do período</h2>
              <p><CalendarDays size={14} /> {period}</p>
            </div>
            <BarChart3 size={21} />
          </div>

          <div className="summary-list">
            <div>
              <span>Receita média por encomenda</span>
              <strong>{money(metrics.orders ? metrics.revenue / metrics.orders : 0)}</strong>
            </div>
            <div>
              <span>Produtos no relatório</span>
              <strong>{products.length}</strong>
            </div>
            <div>
              <span>Origem dos dados</span>
              <strong>Simulação local</strong>
            </div>
            <div>
              <span>Estado das integrações</span>
              <strong className="state"><CheckCircle2 size={15} /> Interface disponível</strong>
            </div>
          </div>

          <div className="insight">
            <Sparkles size={19} />
            <div>
              <strong>Recomendação demonstrativa</strong>
              <p>Compara os preços, os custos dos fornecedores e a procura antes de escolher produtos para vender.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-head">
          <div>
            <h2>Atividade recente</h2>
            <p>Exemplos de atividades do sistema</p>
          </div>
          <ClipboardList size={21} />
        </div>

        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-row" key={activity.title}>
              <div className="activity-icon"><CheckCircle2 size={18} /></div>
              <div className="activity-info">
                <strong>{activity.title}</strong>
                <span>{activity.detail}</span>
              </div>
              <span className="activity-time">{activity.time}</span>
              <span className={`tag ${activity.status === "Simulação" ? "tag-demo" : ""}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <span><Sparkles size={15} /> AI Business Autopilot</span>
        <span>Relatório demonstrativo · {period}</span>
      </footer>

      <style jsx>{`
        .analytics {
          min-height: 100vh;
          background: #f5f7fb;
          color: #172033;
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .topbar, .hero, .hero-actions, .back, .demo, .eyebrow,
        .refresh, .panel-head, .activity-row, footer, footer span {
          display: flex;
          align-items: center;
        }
        .topbar { justify-content: space-between; gap: 12px; margin-bottom: 30px; }
        .back { gap: 8px; text-decoration: none; color: #374151; font-weight: 600; }
        .demo { gap: 7px; color: #5b45c7; background: #eeeaff; padding: 9px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .hero { justify-content: space-between; gap: 24px; margin-bottom: 24px; }
        .eyebrow { gap: 8px; color: #6652d6; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; }
        h1 { margin: 12px 0 8px; font-size: clamp(28px, 4vw, 38px); letter-spacing: -1.2px; }
        .hero p, .panel-head p { color: #778197; font-size: 14px; line-height: 1.6; margin: 0; }
        .hero-actions { gap: 10px; flex-wrap: wrap; }
        select, .refresh { min-height: 42px; border: 1px solid #e0e5ee; border-radius: 10px; background: white; padding: 0 13px; color: #273249; font-size: 13px; }
        .refresh { gap: 8px; cursor: pointer; font-weight: 700; }
        .notice { display: flex; align-items: center; gap: 9px; background: #e8f8ef; color: #167347; border-radius: 10px; padding: 12px 15px; margin-bottom: 16px; font-size: 13px; }
        .simulation { display: flex; align-items: flex-start; gap: 12px; background: #fff8e7; color: #865d13; border: 1px solid #f4e5bd; padding: 15px; border-radius: 12px; margin-bottom: 20px; }
        .simulation strong { font-size: 13px; }
        .simulation p { margin: 5px 0 0; font-size: 12px; line-height: 1.6; }
        .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; margin-bottom: 20px; }
        .metric { background: white; border: 1px solid #e9edf4; border-radius: 15px; padding: 20px; min-width: 0; }
        .metric-top { display: flex; justify-content: space-between; gap: 8px; align-items: center; color: #727d91; font-size: 12px; }
        .metric-icon { width: 37px; height: 37px; display: grid; place-items: center; background: #f0edff; color: #6752d6; border-radius: 11px; flex-shrink: 0; }
        .metric-value { margin: 16px 0 8px; font-size: clamp(20px, 2vw, 27px); font-weight: 800; overflow-wrap: anywhere; }
        .metric-note { color: #8b95a7; font-size: 11px; }
        .metric-note svg { vertical-align: middle; margin-right: 4px; }
        .content-grid { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 20px; margin-bottom: 20px; }
        .panel { background: white; border: 1px solid #e9edf4; border-radius: 15px; padding: 22px; min-width: 0; }
        .panel-head { justify-content: space-between; gap: 12px; margin-bottom: 22px; color: #6652d6; }
        .panel-head h2 { color: #1c2639; font-size: 17px; margin: 0 0 7px; }
        .panel-head p { display: flex; align-items: center; gap: 6px; font-size: 12px; }
        .product-list { display: grid; gap: 21px; }
        .product-row { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .rank { display: grid; place-items: center; width: 30px; height: 30px; flex-shrink: 0; background: #f2f0ff; color: #6652d6; border-radius: 9px; font-weight: 800; font-size: 12px; }
        .product-info { flex: 1; min-width: 0; }
        .product-info strong, .product-info span { display: block; }
        .product-info strong { font-size: 13px; }
        .product-info span { color: #8490a3; font-size: 11px; margin-top: 5px; }
        .bar { height: 5px; background: #eef0f6; border-radius: 9px; margin-top: 10px; overflow: hidden; }
        .bar div { height: 100%; background: #8270ed; border-radius: 9px; }
        .product-revenue { font-size: 12px; white-space: nowrap; }
        .summary-list { display: grid; }
        .summary-list > div { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 15px 0; border-bottom: 1px solid #edf0f5; font-size: 12px; }
        .summary-list > div span { color: #7d8799; }
        .summary-list > div strong { text-align: right; font-size: 12px; }
        .state { display: inline-flex; align-items: center; gap: 5px; color: #16804f; }
        .insight { display: flex; gap: 11px; background: #f3f1ff; color: #6853ce; border-radius: 11px; padding: 14px; margin-top: 19px; }
        .insight strong { font-size: 12px; }
        .insight p { color: #6d6a87; font-size: 11px; line-height: 1.6; margin: 6px 0 0; }
        .activity-panel { margin-bottom: 20px; }
        .activity-list { display: grid; }
        .activity-row { gap: 12px; padding: 14px 0; border-top: 1px solid #edf0f5; }
        .activity-icon { display: grid; place-items: center; width: 34px; height: 34px; border-radius: 10px; background: #e9f8ef; color: #218354; flex-shrink: 0; }
        .activity-info { flex: 1; min-width: 0; }
        .activity-info strong, .activity-info span { display: block; }
        .activity-info strong { font-size: 13px; }
        .activity-info span { font-size: 11px; color: #8992a3; margin-top: 5px; }
        .activity-time { font-size: 11px; color: #8992a3; }
        .tag { padding: 6px 8px; background: #e8f8ef; color: #167347; border-radius: 7px; font-size: 10px; font-weight: 700; white-space: nowrap; }
        .tag-demo { background: #fff3d7; color: #92620e; }
        footer { justify-content: space-between; gap: 12px; color: #929bad; font-size: 11px; padding: 8px 0 20px; }
        footer span { gap: 6px; }
        @media (max-width: 1000px) {
          .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .analytics { padding: 15px; }
          .topbar { margin-bottom: 24px; }
          .hero { align-items: flex-start; flex-direction: column; }
          .hero-actions { width: 100%; }
          .hero-actions select, .hero-actions button { flex: 1; justify-content: center; }
          .metrics { gap: 10px; }
          .metric { padding: 14px; }
          .metric-value { font-size: 20px; }
          .panel { padding: 16px; }
          .product-row { gap: 8px; }
          .product-revenue { font-size: 10px; }
          .activity-row { flex-wrap: wrap; }
          .activity-info { flex-basis: calc(100% - 55px); }
          .activity-time { margin-left: 45px; }
          footer { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}

function Metric({
  title,
  value,
  note,
  icon,
  positive,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  positive: boolean;
}) {
  return (
    <article className="metric">
      <div className="metric-top">
        <span>{title}</span>
        <div className="metric-icon">{icon}</div>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {note}
      </div>
    </article>
  );
}
