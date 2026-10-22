
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  Cloud,
  CreditCard,
  Database,
  Globe,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";

type Category =
  | "Todas"
  | "Dados"
  | "Vendas"
  | "Marketing"
  | "Comunicação"
  | "Pagamentos";

type Integration = {
  id: string;
  name: string;
  category: Exclude<Category, "Todas">;
  description: string;
  requirements: string[];
  status: "Disponível" | "Planeada";
  icon: typeof Database;
  color: string;
};

const integrations: Integration[] = [
  {
    id: "supabase",
    name: "Supabase",
    category: "Dados",
    description: "Base de dados, autenticação e armazenamento.",
    requirements: [
      "URL do projeto",
      "Chave pública anon",
      "Políticas de segurança RLS",
    ],
    status: "Disponível",
    icon: Database,
    color: "text-emerald-600 bg-emerald-500/10",
  },
  {
    id: "store",
    name: "Loja online",
    category: "Vendas",
    description: "Preparação para sincronizar produtos e encomendas.",
    requirements: [
      "URL da loja",
      "Credenciais de API",
      "Permissões mínimas necessárias",
    ],
    status: "Disponível",
    icon: ShoppingBag,
    color: "text-violet-600 bg-violet-500/10",
  },
  {
    id: "meta",
    name: "Meta Ads",
    category: "Marketing",
    description: "Acesso futuro a campanhas e métricas publicitárias.",
    requirements: [
      "Conta empresarial",
      "Token de acesso",
      "Permissões de anúncios",
    ],
    status: "Planeada",
    icon: Activity,
    color: "text-blue-600 bg-blue-500/10",
  },
  {
    id: "google",
    name: "Google",
    category: "Marketing",
    description: "Preparação para ferramentas de análise e publicidade.",
    requirements: [
      "Projeto Google Cloud",
      "OAuth configurado",
      "APIs necessárias ativadas",
    ],
    status: "Planeada",
    icon: Globe,
    color: "text-amber-600 bg-amber-500/10",
  },
  {
    id: "messages",
    name: "Mensagens",
    category: "Comunicação",
    description: "Estrutura para futuras notificações e apoio ao cliente.",
    requirements: [
      "Fornecedor de mensagens",
      "Conta ou número verificado",
      "Consentimento dos destinatários",
    ],
    status: "Planeada",
    icon: MessageSquare,
    color: "text-cyan-600 bg-cyan-500/10",
  },
  {
    id: "payments",
    name: "Pagamentos",
    category: "Pagamentos",
    description: "Preparação para consultar pagamentos com segurança.",
    requirements: [
      "Conta comercial",
      "Credenciais de teste",
      "Webhooks verificados",
    ],
    status: "Planeada",
    icon: CreditCard,
    color: "text-rose-600 bg-rose-500/10",
  },
];

const categories: Category[] = [
  "Todas",
  "Dados",
  "Vendas",
  "Marketing",
  "Comunicação",
  "Pagamentos",
];

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todas");
  const [selectedId, setSelectedId] = useState("supabase");
  const [prepared, setPrepared] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () =>
      integrations.filter((item) => {
        const matchesCategory =
          category === "Todas" || item.category === category;
        const searchable =
          `${item.name} ${item.description} ${item.category}`.toLowerCase();

        return (
          matchesCategory &&
          searchable.includes(query.trim().toLowerCase())
        );
      }),
    [category, query],
  );

  const selected =
    integrations.find((item) => item.id === selectedId) ??
    integrations[0];

  function prepareDemo(id: string) {
    setPrepared((current) =>
      current.includes(id) ? current : [...current, id],
    );
    setNotice(
      "Preparação registada apenas nesta sessão. Nenhuma conta foi ligada.",
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              <Workflow size={17} />
              AI BUSINESS AUTOPILOT / MÓDULOS
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Integrations AI
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Gere e prepara as integrações dos serviços externos do teu
              negócio num único painel.
            </p>
          </div>

          <span className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <ShieldCheck size={16} />
            Modo de simulação ativo
          </span>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            icon={Workflow}
            label="Integrações no catálogo"
            value={String(integrations.length)}
            detail="Serviços registados"
          />
          <Metric
            icon={CheckCircle2}
            label="Disponíveis"
            value={String(
              integrations.filter((item) => item.status === "Disponível")
                .length,
            )}
            detail="Prontas para futura configuração"
          />
          <Metric
            icon={Cloud}
            label="Preparações"
            value={String(prepared.length)}
            detail="Nesta sessão de demonstração"
          />
          <Metric
            icon={ShieldCheck}
            label="Ligações reais"
            value="0"
            detail="Nenhuma ligação executada"
          />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-950 dark:text-amber-200">
                Segurança e controlo
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-100/70">
                Esta versão não envia credenciais nem executa operações
                externas. Compras, pagamentos, anúncios, encomendas e
                mensagens reais permanecem desativados. As chaves secretas
                devem ser guardadas no servidor, nunca no navegador.
              </p>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">
                  Catálogo de integrações
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Pesquisa um serviço ou escolhe uma categoria.
                </p>
              </div>

              <label className="relative block sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar integração..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Limpar pesquisa"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X size={15} />
                  </button>
                )}
              </label>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition ${
                    category === item
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {filtered.map((item) => {
                const Icon = item.icon;
                const active = selectedId === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      setNotice("");
                    }}
                    className={`rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                      active
                        ? "border-indigo-500 bg-indigo-50/60 ring-1 ring-indigo-500/20 dark:bg-indigo-950/30"
                        : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`rounded-xl p-2.5 ${item.color}`}>
                        <Icon size={21} />
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                          item.status === "Disponível"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h3 className="mt-3 font-bold">{item.name}</h3>
                    <p className="mt-1 min-h-10 text-sm leading-5 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {prepared.includes(item.id)
                        ? "Preparação simulada"
                        : "Ver requisitos"}
                      <ArrowUpRight size={15} />
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 md:col-span-2">
                  Nenhuma integração encontrada.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Detalhes do serviço
            </p>

            <div className="mt-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selected.category}
                </p>
              </div>
              {(() => {
                const Icon = selected.icon;
                return (
                  <span className={`rounded-xl p-3 ${selected.color}`}>
                    <Icon size={24} />
                  </span>
                );
              })()}
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {selected.description}
            </p>

            <div className="my-5 h-px bg-slate-100 dark:bg-slate-800" />

            <h3 className="font-semibold">Requisitos de configuração</h3>
            <ul className="mt-3 space-y-3">
              {selected.requirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                >
                  <CircleHelp
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />
                  {requirement}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => prepareDemo(selected.id)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
            >
              <Sparkles size={17} />
              Preparar em simulação
            </button>

            {prepared.includes(selected.id) && (
              <p className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-600">
                <CheckCircle2 size={15} />
                Preparação demonstrativa registada.
              </p>
            )}

            {notice && (
              <p
                role="status"
                className="mt-3 rounded-lg bg-slate-100 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {notice}
              </p>
            )}

            <div className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-200">
                Próxima etapa:
              </strong>{" "}
              implementar a ligação no servidor, validar permissões e testar
              primeiro com credenciais de sandbox.
            </div>
          </aside>
        </div>

        <footer className="flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <span>AI Business Autopilot · Integrations AI</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} />
            Seguro por defeito · Sem ações externas
          </span>
        </footer>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Database;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </div>
  );
}
