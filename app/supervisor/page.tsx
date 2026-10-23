
'use client';

import { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Search,
  Truck,
  Palette,
  Megaphone,
  ChartNoAxesCombined,
  Wallet,
  Users,
  Package,
  Settings,
  ChevronRight,
  LockKeyhole,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ClipboardCheck,
} from 'lucide-react';

type ActivityEntry = {
  id: number;
  time: string;
  message: string;
};

const modules = [
  { name: 'Research AI', description: 'Pesquisa de oportunidades', href: '/research', icon: Search },
  { name: 'Supplier AI', description: 'Pesquisa de fornecedores', href: '/supplier', icon: Truck },
  { name: 'Creative AI', description: 'Criação de conteúdos', href: '/creative', icon: Palette },
  { name: 'Ads AI', description: 'Gestão de campanhas', href: '/ads', icon: Megaphone },
  { name: 'Analytics AI', description: 'Análise de desempenho', href: '/analytics', icon: ChartNoAxesCombined },
  { name: 'Finance AI', description: 'Controlo financeiro', href: '/finance', icon: Wallet },
  { name: 'Customer AI', description: 'Gestão de clientes', href: '/customer', icon: Users },
  { name: 'Orders AI', description: 'Gestão de encomendas', href: '/orders', icon: Package },
  { name: 'Monitoramento', description: 'Estado dos serviços', href: '/monitoring', icon: Activity },
];

const securityControls = [
  {
    title: 'Compras reais',
    description: 'Compras sem autorização estão bloqueadas.',
    status: 'BLOQUEADO',
  },
  {
    title: 'Anúncios reais',
    description: 'Publicação de anúncios reais desativada.',
    status: 'BLOQUEADO',
  },
  {
    title: 'Pagamentos automáticos',
    description: 'Pagamentos reais desativados.',
    status: 'BLOQUEADO',
  },
  {
    title: 'Levantamentos',
    description: 'Transferências de dinheiro desativadas.',
    status: 'BLOQUEADO',
  },
];

function Panel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

export default function SupervisorPage() {
  const [history, setHistory] = useState<ActivityEntry[]>([]);
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState('');

  function runCheck() {
    if (checking) return;

    setChecking(true);

    const now = new Date();
    const time = now.toLocaleString('pt-MZ', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    setLastCheck(time);
    setHistory((previous) =>
      [
        {
          id: Date.now(),
          time,
          message:
            'Verificação local concluída. Modo de simulação ativo; quatro operações reais permanecem bloqueadas.',
        },
        ...previous,
      ].slice(0, 5),
    );

    setChecking(false);
  }

  const IconHeader = Activity;

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <ShieldCheck size={27} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                AI Business Autopilot
              </p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Supervisor AI
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Supervisão, segurança e diagnóstico do sistema.
              </p>
            </div>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Modo de simulação
          </span>
        </header>

        {/* Aviso de segurança */}
        <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <LockKeyhole className="mt-0.5 shrink-0 text-blue-700" size={21} />
          <div>
            <p className="font-semibold text-blue-950">
              Centro de controlo protegido
            </p>
            <p className="mt-1 text-sm leading-6 text-blue-900">
              Esta página executa verificações locais. Não faz compras,
              pagamentos, levantamentos nem publica anúncios reais.
            </p>
          </div>
        </div>

        {/* Indicadores */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Panel>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Modo de operação</p>
                <p className="mt-2 text-2xl font-bold">Simulação</p>
                <p className="mt-1 text-xs text-slate-500">
                  Ambiente de testes
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                <Activity size={22} />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Operações bloqueadas</p>
                <p className="mt-2 text-2xl font-bold">4 de 4</p>
                <p className="mt-1 text-xs text-slate-500">
                  Configuração desta página
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                <LockKeyhole size={22} />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Verificações locais</p>
                <p className="mt-2 text-2xl font-bold">{history.length}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Registos recentes nesta sessão
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <ClipboardCheck size={22} />
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Última verificação</p>
                <p className="mt-2 break-words text-base font-bold">
                  {lastCheck || 'Ainda não executada'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Hora local do dispositivo
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                <Clock3 size={22} />
              </div>
            </div>
          </Panel>
        </div>

        {/* Diagnóstico e controlos */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <Panel className="xl:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <IconHeader size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Diagnóstico do sistema</h2>
                <p className="text-sm text-slate-500">
                  Verificação local dos controlos
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Executa uma verificação das configurações de segurança
              apresentadas nesta página. Não testa ligações externas nem
              confirma o estado do Supabase.
            </p>

            <button
              type="button"
              onClick={runCheck}
              disabled={checking}
              className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={18}
                className={checking ? 'animate-spin' : ''}
              />
              {checking ? 'A verificar...' : 'Verificar sistema'}
            </button>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <AlertTriangle
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              <p>
                Resultado local, não uma auditoria completa da aplicação.
              </p>
            </div>
          </Panel>

          <Panel className="xl:col-span-3">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Controlos de segurança</h2>
              <p className="mt-1 text-sm text-slate-500">
                Operações reais desativadas nesta demonstração.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {securityControls.map((control) => (
                <div
                  key={control.title}
                  className="flex flex-col gap-3 py-4 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-700">
                      <CheckCircle2 size={19} />
                    </div>
                    <div>
                      <p className="font-semibold">{control.title}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {control.description}
                      </p>
                    </div>
                  </div>

                  <span className="ml-11 w-fit shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 sm:ml-0">
                    {control.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              Estes estados descrevem a configuração desta interface.
              Não garantem, por si só, que todos os serviços externos estejam
              protegidos.
            </div>
          </Panel>
        </div>

        {/* Módulos */}
        <Panel>
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">Módulos do Autopilot</h2>
              <p className="mt-1 text-sm text-slate-500">
                Acede às áreas do sistema através de cartões separados.
              </p>
            </div>
            <span className="text-sm text-slate-400">
              {modules.length} atalhos
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const ModuleIcon = module.icon;

              return (
                <a
                  key={module.name}
                  href={module.href}
                  className="group flex min-h-24 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                    <ModuleIcon size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{module.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {module.description}
                    </p>
                  </div>
                  <ChevronRight
                    size={19}
                    className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
                  />
                </a>
              );
            })}
          </div>
        </Panel>

        {/* Histórico */}
        <Panel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Registo de atividade</h2>
              <p className="mt-1 text-sm text-slate-500">
                Até cinco verificações mais recentes desta sessão.
              </p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
              <Clock3 size={21} />
            </div>
          </div>

          {history.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center">
              <ClipboardCheck
                size={27}
                className="mx-auto text-slate-400"
              />
              <p className="mt-3 font-medium text-slate-700">
                Ainda não existem verificações nesta sessão
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Carrega em “Verificar sistema” para criar o primeiro registo.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex gap-3 rounded-xl bg-slate-50 p-3"
                >
                  <div className="mt-0.5 text-emerald-700">
                    <CheckCircle2 size={19} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-slate-700">
                      {entry.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {entry.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Rodapé */}
        <footer className="flex flex-col gap-2 border-t border-slate-200 py-4 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Segurança: operações reais desativadas nesta demonstração.
          </p>
          <a
            href="/settings"
            className="inline-flex items-center gap-2 font-medium text-slate-700 hover:text-slate-950"
          >
            <Settings size={15} />
            Configurações
            <ChevronRight size={14} />
          </a>
        </footer>
      </div>
    </main>
  );
}
