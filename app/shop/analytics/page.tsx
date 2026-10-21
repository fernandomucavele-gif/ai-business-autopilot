
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const initialMetrics = {
  visits: 1250,
  views: 840,
  carts: 96,
  orders: 32,
};

export default function ShopAnalyticsPage() {
  const [metrics, setMetrics] = useState(initialMetrics);

  const conversion =
    metrics.visits > 0
      ? ((metrics.orders / metrics.visits) * 100).toFixed(2)
      : "0.00";

  function resetMetrics() {
    setMetrics(initialMetrics);
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700"
        >
          <ArrowLeft size={18} />
          Voltar ao Autopilot
        </a>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Store Analytics AI
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Análise da loja
            </h1>
            <p className="mt-2 text-slate-600">
              Indicadores demonstrativos para testar o desempenho da loja.
            </p>
          </div>

          <button
            onClick={resetMetrics}
            className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold shadow-sm"
          >
            <RefreshCw size={17} />
            Repor demonstração
          </button>
        </header>

        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <ShieldCheck className="mt-1 text-emerald-700" size={22} />
          <div>
            <p className="font-bold text-emerald-900">
              Modo de simulação ativo
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Estes valores são fictícios. Não representam visitantes,
              encomendas ou vendas reais.
            </p>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Visitas"
            value={metrics.visits.toLocaleString("pt-PT")}
            icon={<Eye size={22} />}
            color="blue"
          />
          <MetricCard
            title="Visualizações de produtos"
            value={metrics.views.toLocaleString("pt-PT")}
            icon={<ShoppingBag size={22} />}
            color="violet"
          />
          <MetricCard
            title="Carrinhos"
            value={metrics.carts.toLocaleString("pt-PT")}
            icon={<ShoppingCart size={22} />}
            color="amber"
          />
          <MetricCard
            title="Encomendas simuladas"
            value={metrics.orders.toLocaleString("pt-PT")}
            icon={<TrendingUp size={22} />}
            color="emerald"
          />
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Funil de conversão</h2>
          <p className="mt-2 text-sm text-slate-500">
            Exemplo de como os visitantes avançam até à encomenda.
          </p>

          <div className="mt-6 space-y-5">
            <FunnelRow
              label="Visitas"
              value={metrics.visits}
              total={metrics.visits}
              color="bg-blue-600"
            />
            <FunnelRow
              label="Visualizações"
              value={metrics.views}
              total={metrics.visits}
              color="bg-violet-600"
            />
            <FunnelRow
              label="Carrinhos"
              value={metrics.carts}
              total={metrics.visits}
              color="bg-amber-500"
            />
            <FunnelRow
              label="Encomendas"
              value={metrics.orders}
              total={metrics.visits}
              color="bg-emerald-600"
            />
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-5">
            <p className="text-sm text-slate-500">
              Taxa de conversão simulada
            </p>
            <p className="mt-1 text-3xl font-bold">{conversion}%</p>
            <p className="mt-2 text-sm text-slate-500">
              Cálculo: encomendas simuladas ÷ visitas × 100.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">Controlos de teste</h2>
          <p className="mt-2 text-sm text-slate-600">
            Altera os indicadores para verificar se os cálculos reagem.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() =>
                setMetrics((m) => ({
                  ...m,
                  visits: m.visits + 100,
                }))
              }
              className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white"
            >
              +100 visitas
            </button>

            <button
              onClick={() =>
                setMetrics((m) => ({
                  ...m,
                  carts: m.carts + 5,
                }))
              }
              className="rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white"
            >
              +5 carrinhos
            </button>

            <button
              onClick={() =>
                setMetrics((m) => ({
                  ...m,
                  orders: m.orders + 1,
                }))
              }
              className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white"
            >
              +1 encomenda de teste
            </button>
          </div>
        </section>

        <footer className="pb-4 text-center text-sm text-slate-500">
          AI Business Autopilot · Store Analytics AI · Simulação
        </footer>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
      >
        {icon}
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </article>
  );
}

function FunnelRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const width =
    total > 0 ? Math.min(100, (value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-500">
          {value.toLocaleString("pt-PT")}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
