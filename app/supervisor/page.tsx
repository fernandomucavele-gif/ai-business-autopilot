
"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import Link from "next/link";
import {
  ShieldCheck,
  Activity,
  LockKeyhole,
  ClipboardCheck,
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
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";
import styles from "./supervisor.module.css";

const modules = [
  { name: "Research AI", href: "/research", icon: Search },
  { name: "Supplier AI", href: "/supplier", icon: Truck },
  { name: "Creative AI", href: "/creative", icon: Palette },
  { name: "Ads AI", href: "/ads", icon: Megaphone },
  { name: "Analytics AI", href: "/analytics", icon: ChartNoAxesCombined },
  { name: "Finance AI", href: "/finance", icon: Wallet },
  { name: "Customer AI", href: "/customers", icon: Users },
  { name: "Orders AI", href: "/orders", icon: Package },
  { name: "Monitoramento", href: "/monitoring", icon: Activity },
];

const protections = [
  "Compras reais bloqueadas",
  "Pagamentos automáticos bloqueados",
  "Anúncios reais bloqueados",
  "Levantamentos bloqueados",
];

export default function SupervisorPage() {
  const { state, metrics } = useAutopilot();
  const [checking, setChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  function runCheck() {
    if (checking) return;

    setChecking(true);
    setMessage("");

    // Diagnóstico local de demonstração.
    // Não executa compras, pagamentos, anúncios ou levantamentos.
    const result =
      `Diagnóstico local concluído: ${state.products.length} produto(s), ${state.campaigns.length} campanha(s), ${state.orders.length} encomenda(s); lucro simulado de ${metrics.profit.toLocaleString("pt-PT")} MT. Compras, pagamentos e anúncios reais continuam bloqueados.`;

    setLastCheck(
      new Date().toLocaleString("pt-MZ", {
        dateStyle: "short",
        timeStyle: "short",
      })
    );
    setHistory((previous) => [result, ...previous].slice(0, 5));
    setMessage(result);
    setChecking(false);
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">AI Business Autopilot</Link>
          <ChevronRight size={15} />
          <span>Supervisor AI</span>
        </div>

        <header className={styles.pageHeading}>
          <div>
            <span className={styles.eyebrow}>CENTRO DE CONTROLO</span>
            <h1>Supervisor AI</h1>
            <p>Supervisão, segurança e diagnóstico do sistema.</p>
          </div>
          <span className={styles.simulationBadge}>
            <span className={styles.statusDot} />
            SIMULAÇÃO
          </span>
        </header>

        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <div className={styles.brandIcon}>
              <ShieldCheck size={27} />
            </div>
            <div className={styles.brandText}>
              <h2>Supervisor AI</h2>
              <p>Centro de controlo e segurança</p>
            </div>
          </header>

          <div className={styles.separator} />

          <section className={styles.statsGrid} aria-label="Estado do sistema">
            <article className={styles.statCard}>
              <span className={styles.statLabel}>Modo de operação</span>
              <strong className={styles.statValue}>Simulação</strong>
              <span className={styles.successText}>Ativo</span>
            </article>

            <article className={styles.statCard}>
              <span className={styles.statLabel}>Controlos de segurança</span>
              <strong className={styles.statValue}>4 bloqueios</strong>
              <span className={styles.successText}>
                Operações reais desativadas
              </span>
            </article>
          </section>

          <section className={styles.diagnosticCard}>
            <div className={styles.diagnosticHeading}>
              <Activity size={25} />
              <div>
                <h3>Diagnóstico do sistema</h3>
                <p>Verifica os registos atuais do Autopilot e os controlos locais</p>
              </div>
            </div>

            <button
              className={styles.checkButton}
              type="button"
              onClick={runCheck}
              disabled={checking}
            >
              {checking ? "A verificar..." : "Verificar sistema"}
            </button>

            {message && (
              <div className={styles.resultMessage} role="status">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            )}
          </section>

          <section className={styles.modulesSection}>
            <div className={styles.sectionHeading}>
              <h3>Módulos</h3>
              <span>{modules.length} módulos</span>
            </div>

            <div className={styles.modulesGrid}>
              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    className={styles.moduleLink}
                    href={module.href}
                    key={module.name}
                  >
                    <Icon size={22} className={styles.moduleIcon} />
                    <span>{module.name}</span>
                    <ChevronRight
                      size={20}
                      className={styles.moduleArrow}
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className={styles.securitySection}>
            <div className={styles.sectionHeading}>
              <h3>Controlos de segurança</h3>
              <LockKeyhole size={19} />
            </div>

            <div className={styles.protectionList}>
              {protections.map((protection) => (
                <div className={styles.protectionItem} key={protection}>
                  <ShieldCheck size={19} />
                  <span>{protection}</span>
                  <span className={styles.blockedBadge}>BLOQUEADO</span>
                </div>
              ))}
            </div>

            <p className={styles.securityNote}>
              Este painel é uma demonstração. Os bloqueios apresentados são
              indicadores da interface e não substituem controlos de segurança
              implementados nos serviços que executam operações reais.
            </p>
          </section>

          <section className={styles.detailsGrid}>
            <article className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <ClipboardCheck size={21} />
              </div>
              <span>Verificações nesta sessão</span>
              <strong>{history.length}</strong>
            </article>

            <article className={styles.detailCard}>
              <div className={styles.detailIcon}>
                <Clock3 size={21} />
              </div>
              <span>Última verificação</span>
              <strong className={styles.dateValue}>
                {lastCheck || "Ainda não executada"}
              </strong>
            </article>
          </section>

          {history.length > 0 && (
            <section className={styles.historySection}>
              <h3>Registos recentes nesta sessão</h3>
              {history.map((item, index) => (
                <div className={styles.historyItem} key={`${item}-${index}`}>
                  <CheckCircle2 size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </section>
          )}

          <footer className={styles.panelFooter}>
            <div className={styles.footerIcon}>
              <ShieldAlert size={19} />
            </div>
            <p>
              <strong>Modo de segurança ativo</strong>
              <span>
                Nenhuma operação comercial real é executada por esta página.
              </span>
            </p>
            <Link href="/settings" aria-label="Configurações">
              <Settings size={21} />
            </Link>
          </footer>
        </section>

        <p className={styles.pageFootnote}>
          Supervisor AI · Ambiente de testes · Os registos desta página são
          mantidos apenas durante a sessão atual.
        </p>
      </div>
    </main>
  );
}
