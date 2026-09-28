"use client";

import { useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  PauseCircle,
  PlayCircle,
  RefreshCw,
} from "lucide-react";

type Log = {
  id: number;
  time: string;
  type: "success" | "warning" | "info";
  message: string;
};

const initialLogs: Log[] = [
  {
    id: 1,
    time: "Agora",
    type: "success",
    message: "Autopilot está online em modo simulação.",
  },
  {
    id: 2,
    time: "Agora",
    type: "info",
    message: "Monitoramento automático ativo.",
  },
  {
    id: 3,
    time: "Agora",
    type: "warning",
    message: "Ações reais permanecem bloqueadas.",
  },
];

export default function MonitoringPage() {
  const [autopilotActive, setAutopilotActive] = useState(true);
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  function refreshMonitoring() {
    setLogs((current) => [
      {
        id: Date.now(),
        time: "Agora",
        type: "success",
        message: "Monitoramento atualizado com sucesso.",
      },
      ...current,
    ]);
  }

  function toggleAutopilot() {
    const next = !autopilotActive;
    setAutopilotActive(next);

    setLogs((current) => [
      {
        id: Date.now(),
        time: "Agora",
        type: next ? "success" : "warning",
        message: next
          ? "Autopilot ativado em modo simulação."
          : "Autopilot pausado.",
      },
      ...current,
    ]);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <Activity className="text-cyan-400" size={32} />
              <h1 className="text-3xl font-bold">Monitoramento</h1>
            </div>

            <p className="text-slate-400 mt-2">
              Centro de controlo e segurança do AI Business Autopilot.
            </p>
          </div>

          <button
            onClick={refreshMonitoring}
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 hover:bg-slate-700"
          >
            <RefreshCw size={18} />
            Atualizar
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-emerald-400" />
              <div>
                <p className="text-sm text-slate-400">Sistema</p>
                <p className="text-xl font-semibold">Online</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <div className="flex items-center gap-3">
              <Bot className="text-cyan-400" />
              <div>
                <p className="text-sm text-slate-400">Autopilot</p>
                <p className="text-xl font-semibold">
                  {autopilotActive ? "Ativo" : "Pausado"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-yellow-400" />
              <div>
                <p className="text-sm text-slate-400">Modo</p>
                <p className="text-xl font-semibold">Simulação</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Controlo do Autopilot</h2>
              <p className="text-slate-400 mt-1">
                Podes pausar ou ativar a automação durante os testes.
              </p>
            </div>

            <button
              onClick={toggleAutopilot}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold ${
                autopilotActive
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {autopilotActive ? (
                <>
                  <PauseCircle size={20} />
                  Pausar Autopilot
                </>
              ) : (
                <>
                  <PlayCircle size={20} />
                  Ativar Autopilot
                </>
              )}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex gap-4">
            <AlertTriangle
              className="text-yellow-400 shrink-0"
              size={26}
            />

            <div>
              <h2 className="font-semibold text-lg">
                Segurança: modo simulação ativo
              </h2>

              <p className="text-slate-300 mt-2">
                Compras automáticas, pagamentos automáticos, levantamentos e
                publicação real de anúncios continuam bloqueados.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-3 mb-5">
            <Activity className="text-cyan-400" />
            <h2 className="text-xl font-semibold">Atividade do sistema</h2>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl bg-slate-800/70 p-4"
              >
                {log.type === "success" && (
                  <CheckCircle2
                    className="text-emerald-400 mt-0.5 shrink-0"
                    size={20}
                  />
                )}

                {log.type === "warning" && (
                  <AlertTriangle
                    className="text-yellow-400 mt-0.5 shrink-0"
                    size={20}
                  />
                )}

                {log.type === "info" && (
                  <Activity
                    className="text-cyan-400 mt-0.5 shrink-0"
                    size={20}
                  />
                )}

                <div className="flex-1">
                  <p className="text-white">{log.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <
