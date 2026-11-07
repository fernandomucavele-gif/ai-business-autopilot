"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  Facebook,
  Globe,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

type Provider = "google_ads" | "meta_ads";
type Connection = {
  id: string;
  provider: Provider;
  external_account_id: string | null;
  account_name: string | null;
  connection_status: "disconnected" | "pending" | "connected" | "error" | "revoked";
  access_mode: "read_only";
  last_synced_at: string | null;
  last_error: string | null;
};

const providers: {
  id: Provider;
  name: string;
  description: string;
  scopes: string[];
  setup: string[];
  icon: typeof Globe;
}[] = [
  {
    id: "google_ads",
    name: "Google Ads",
    description: "Leitura de contas, campanhas e relatórios de desempenho através da Google Ads API.",
    scopes: ["OAuth 2.0", "Google Ads API", "Escopo adwords — limitado no nosso código a operações de leitura"],
    setup: ["Projeto Google Cloud e Google Ads API ativada", "Cliente OAuth e URI de retorno validado", "Acesso Explorer ou superior para contas de produção"],
    icon: Globe,
  },
  {
    id: "meta_ads",
    name: "Meta Ads",
    description: "Leitura de contas de anúncios, campanhas e métricas através da Meta Marketing API.",
    scopes: ["Meta OAuth", "ads_read", "App Review / Advanced Access quando aplicável"],
    setup: ["Aplicação Meta configurada", "Login OAuth e URI de retorno validado", "Permissão ads_read aprovada para o caso de utilização"],
    icon: Facebook,
  },
];

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadConnections() {
      const { data, error } = await supabase
        .from("ad_platform_connections")
        .select("id,provider,external_account_id,account_name,connection_status,access_mode,last_synced_at,last_error")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setLoadError("Não foi possível consultar o estado das ligações. Inicia sessão e verifica as permissões.");
      } else {
        setConnections((data ?? []) as Connection[]);
      }
      setLoading(false);
    }
    void loadConnections();
    return () => { active = false; };
  }, []);

  const statusLabel = (provider: Provider) => {
    const items = connections.filter((item) => item.provider === provider);
    if (!items.length) return "Não ligada";
    if (items.some((item) => item.connection_status === "connected")) return "Ligação registada";
    if (items.some((item) => item.connection_status === "pending")) return "Pendente";
    if (items.some((item) => item.connection_status === "error")) return "Com erro";
    if (items.some((item) => item.connection_status === "revoked")) return "Acesso revogado";
    return "Desligada";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              <Workflow size={17} /> AI BUSINESS AUTOPILOT / INTEGRAÇÕES
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Google Ads + Meta Ads</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Arquitetura comum para importar relatórios publicitários em modo estritamente de leitura.
            </p>
          </div>
          <span className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <ShieldCheck size={16} /> SIMULAÇÃO · SEM ESCRITA
          </span>
        </header>

        <section className="grid gap-3 sm:grid-cols-3">
          <Metric icon={Database} label="Base de integração" value="Preparada" detail="3 tabelas com RLS" />
          <Metric icon={LockKeyhole} label="Permissões de escrita" value="Bloqueadas" detail="Sem criação ou edição de anúncios" />
          <Metric icon={Activity} label="Contas ligadas" value={String(connections.filter((item) => item.connection_status === "connected").length)} detail="Ligações OAuth confirmadas" />
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-950 dark:text-amber-200">Barreira de segurança ativa</h2>
              <p className="mt-1 text-sm leading-6 text-amber-900/80 dark:text-amber-100/70">
                O Autopilot não pode criar campanhas, editar anúncios, publicar, alterar orçamentos ou iniciar gastos. Os adaptadores de fornecedor ainda não fazem chamadas externas. Não introduzas tokens ou palavras-passe nesta página.
              </p>
            </div>
          </div>
        </section>

        {loadError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{loadError}</p>}

        <section className="grid gap-4 lg:grid-cols-2">
          {providers.map((provider) => {
            const Icon = provider.icon;
            const accounts = connections.filter((item) => item.provider === provider.id);
            return (
              <article key={provider.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"><Icon size={24} /></span>
                    <div><h2 className="text-xl font-bold">{provider.name}</h2><p className="text-xs text-slate-500">Conector de leitura</p></div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{loading ? "A verificar..." : statusLabel(provider.id)}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{provider.description}</p>
                <div className="mt-5">
                  <h3 className="text-sm font-bold">Autorização prevista</h3>
                  <ul className="mt-2 space-y-2">{provider.scopes.map((scope) => <li key={scope} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />{scope}</li>)}</ul>
                </div>
                <div className="mt-5">
                  <h3 className="text-sm font-bold">Pré-requisitos</h3>
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">{provider.setup.map((item) => <li key={item}>{item}</li>)}</ol>
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-slate-950">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200"><LockKeyhole size={14} /> Capacidades permitidas</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Consultar contas, campanhas e insights. Todas as operações de escrita permanecem desativadas no contrato do conector.</p>
                </div>
                {accounts.length > 0 && <div className="mt-4 space-y-2">{accounts.map((account) => <div key={account.id} className="rounded-lg border border-slate-200 p-3 text-xs dark:border-slate-700"><strong>{account.account_name || "Conta sem nome"}</strong><p className="mt-1 text-slate-500">{account.external_account_id || "ID ainda não registado"} · {account.connection_status}</p></div>)}</div>}
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 text-lg font-bold"><Workflow size={19} /> Fluxo de dados planeado</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Step title="1. OAuth seguro" detail="Consentimento do utilizador e tokens guardados apenas no servidor." />
            <Step title="2. Leitura API" detail="Consultar contas, campanhas e relatórios sem endpoints de escrita." />
            <Step title="3. Normalização" detail="Converter Google e Meta para o mesmo formato de métricas." />
            <Step title="4. Analytics AI" detail="Guardar origem, moeda, data e modo; apresentar os relatórios." />
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Clock3 size={15} className="mt-0.5 shrink-0" />A ligação OAuth e a importação real ainda não estão ativadas. O estado atual é preparação técnica, não uma conta ligada.</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="flex items-center gap-2 font-bold"><BarChart3 size={18} /> Separação dos dados</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/30"><strong className="text-sm">Simulação</strong><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Dados de teste claramente identificados. Não representam desempenho real.</p></div>
            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30"><strong className="text-sm">Importação de leitura</strong><p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Futura importação dos números reais fornecidos pelas APIs, sem permitir alterações nas campanhas.</p></div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:justify-between">
          <span>AI Business Autopilot · Integrations AI</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Seguro por defeito · Somente leitura</span>
        </footer>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, detail }: { icon: typeof Database; label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p><Icon size={18} className="text-indigo-600" /></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>;
}

function Step({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{detail}</p></div>;
}
