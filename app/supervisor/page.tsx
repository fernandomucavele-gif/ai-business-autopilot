
"use client";

import { useState } from "react";

type Check = {
  name: string;
  description: string;
  status: "OK" | "ATENÇÃO" | "BLOQUEADO";
};

const initialChecks: Check[] = [
  {
    name: "Modo de simulação",
    description: "Ambiente de testes ativo",
    status: "OK",
  },
  {
    name: "Compras reais",
    description: "Compras sem autorização bloqueadas",
    status: "BLOQUEADO",
  },
  {
    name: "Anúncios reais",
    description: "Publicação real desativada",
    status: "BLOQUEADO",
  },
  {
    name: "Pagamentos automáticos",
    description: "Pagamentos reais desativados",
    status: "BLOQUEADO",
  },
  {
    name: "Levantamentos",
    description: "Transferências de dinheiro desativadas",
    status: "BLOQUEADO",
  },
];

const modules = [
  { name: "Research AI", path: "/research" },
  { name: "Supplier AI", path: "/supplier" },
  { name: "Creative AI", path: "/creative" },
  { name: "Ads AI", path: "/ads" },
  { name: "Analytics AI", path: "/analytics" },
  { name: "Finance AI", path: "/finance" },
  { name: "Customer AI", path: "/customer" },
  { name: "Orders AI", path: "/orders" },
  { name: "Monitoramento", path: "/monitoring" },
];

export default function SupervisorPage() {
  const [checks, setChecks] = useState(initialChecks);
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([
    "Supervisor AI iniciado em modo de simulação.",
    "Compras, anúncios e operações financeiras reais permanecem bloqueados.",
  ]);

  function runCheck() {
    const now = new Date().toLocaleString("pt-PT");

    // Verificação local da configuração de segurança.
    // Não executa compras, pagamentos ou anúncios.
    setChecks(initialChecks);
    setLastCheck(now);
    setHistory((previous) =>
      [
        `Verificação local executada: ${now}.`,
        "Modo de simulação confirmado pela configuração desta página.",
        ...previous,
      ].slice(0, 10)
    );
  }

  const okCount = checks.filter((item) => item.status === "OK").length;
  const blockedCount = checks.filter(
    (item) => item.status === "BLOQUEADO"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.25em] text-cyan-400">
              AI BUSINESS AUTOPILOT
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Supervisor AI
            </h1>
            <p className="mt-2 text-slate-400">
              Supervisão, segurança e diagnóstico do sistema.
            </p>
          </div>

          <span className="w-fit rounded-full border border-emerald-700 bg-emerald-950 px-4 py-2 text-sm text-emerald-300">
            ● Modo de simulação
          </span>
        </header>

        <section className="rounded-2xl border border-cyan-900 bg-slate-900 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Centro de controlo
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Executa uma verificação local dos controlos de segurança.
              </p>
            </div>

            <button
              type="button"
              onClick={runCheck}
              className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Verificar sistema
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <article className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Controlos OK</p>
              <p className="mt-2 text-3xl font-bold text-emerald-400">
                {okCount}
              </p>
            </article>

            <article className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Operações bloqueadas</p>
              <p className="mt-2 text-3xl font-bold text-amber-400">
                {blockedCount}
              </p>
            </article>

            <article className="rounded-xl bg-slate-800 p-4">
              <p className="text-sm text-slate-400">Última verificação</p>
              <p className="mt-2 text-sm font-semibold">
                {lastCheck ?? "Ainda não executada"}
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Controlos de segurança</h2>
          <p className="mb-4 mt-1 text-sm text-slate-400">
            Estes estados representam a configuração desta demonstração,
            não uma auditoria completa dos serviços externos.
          </p>

          <div className="space-y-3">
            {checks.map((check) => (
              <article
                key={check.name}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold">{check.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {check.description}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-lg px-3 py-2 text-xs font-bold ${
                    check.status === "OK"
                      ? "bg-emerald-950 text-emerald-300"
                      : check.status === "BLOQUEADO"
                        ? "bg-amber-950 text-amber-300"
                        : "bg-red-950 text-red-300"
                  }`}
                >
                  {check.status}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Módulos do Autopilot</h2>
          <p className="mb-4 mt-1 text-sm text-slate-400">
            Atalhos para os módulos existentes. A disponibilidade de cada
            página deve ser testada individualmente.
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <a
                key={module.name}
                href={module.path}
                className="rounded-xl border border-slate-700 bg-slate-950 p-4 transition hover:border-cyan-500 hover:bg-slate-800"
              >
                <span className="font-semibold">{module.name}</span>
                <span className="mt-2 block text-sm text-cyan-400">
                  Abrir módulo →
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">Registo de atividade</h2>
          <div className="mt-4 space-y-3">
            {history.map((entry, index) => (
              <p
                key={`${entry}-${index}`}
                className="rounded-lg bg-slate-950 p-3 text-sm text-slate-300"
              >
                <span className="mr-2 text-cyan-400">›</span>
                {entry}
              </p>
            ))}
          </div>
        </section>

        <footer className="rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
          Segurança: esta página não executa operações reais. Os indicadores
          financeiros e os estados de outros serviços ainda precisam de ser
          ligados às respetivas fontes de dados para representar o estado real
          do sistema.
        </footer>
      </div>
    </main>
  );
}
