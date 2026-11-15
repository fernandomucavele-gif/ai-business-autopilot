"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAutopilot } from "./context/autopilot-context";

const menu = [
  ["🏠", "Dashboard", "/"],
  ["🔎", "Research AI", "/research"],
  ["🏭", "Supplier AI", "/suppliers"],
  ["🎨", "Creative AI", "/creative"],
  ["📢", "Ads AI", "/ads"],
  ["📊", "Analytics AI", "/analytics"],
  ["💰", "Finance AI", "/finance"],
  ["🤝", "Customer AI", "/customers"],
  ["📦", "Orders AI", "/orders"],
  ["🤖", "Supervisor AI", "/supervisor"],
  ["👁️", "Monitoramento", "/monitoring"],
  ["⚙️", "Configurações", "/settings/app/settings"],
] as const;

const saveLabels = {
  loading: "A carregar dados",
  idle: "Sessão não iniciada",
  saving: "A guardar alterações",
  saved: "Dados sincronizados",
  error: "Sincronização com erro",
} as const;

export default function DashboardHome() {
  const router = useRouter();
  const pathname = usePathname();
  const { state, metrics, saveStatus } = useAutopilot();

  const pipeline = [
    { label: "Produtos pesquisados", count: state.products.length, href: "/research", icon: "🔎" },
    { label: "Criativos preparados", count: state.creatives.length, href: "/creative", icon: "🎨" },
    { label: "Campanhas registadas", count: state.campaigns.length, href: "/ads", icon: "📢" },
    { label: "Pedidos registados", count: state.orders.length, href: "/orders", icon: "📦" },
    { label: "Registos financeiros", count: state.finance.length, href: "/finance", icon: "💰" },
  ];

  const syncClass = saveStatus === "saved" ? "sync good" : saveStatus === "error" ? "sync bad" : "sync pending";

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">AI</div>
          <div><strong>Business</strong><span>Autopilot</span></div>
        </div>
        <nav aria-label="Menu principal">
          {menu.map(([icon, name, path]) => {
            const active = pathname === path || (path !== "/" && pathname.startsWith(path + "/"));
            return (
              <button key={path} type="button" onClick={() => router.push(path)}
                className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}>
                <span className="nav-icon">{icon}</span><span>{name}</span>
              </button>
            );
          })}
        </nav>
        <div className="safe"><span className="safe-dot" /><div><strong>Modo simulação</strong><small>Operações reais bloqueadas</small></div></div>
      </aside>

      <section className="content">
        <header className="header">
          <div className="heading"><span className="eyebrow">CENTRO DE CONTROLO</span><h1>AI Business Autopilot</h1><p>Visão geral dos módulos e dos dados do teu negócio.</p></div>
          <div className={syncClass}><span className="sync-dot" />{saveLabels[saveStatus]}</div>
        </header>

        <section className="banner">
          <div className="banner-icon">🛡️</div>
          <div className="banner-copy"><strong>Ambiente seguro de testes</strong><p>O sistema continua em simulação. Compras, anúncios, pagamentos automáticos e levantamentos reais permanecem bloqueados.</p></div>
          <span className="simulation-tag">SIMULAÇÃO ATIVA</span>
        </section>

        {saveStatus === "error" && <div className="warning" role="status">A gravação não foi confirmada. Evita sair desta sessão antes de verificares a ligação.</div>}

        <section className="cards" aria-label="Indicadores principais">
          <Card icon="💰" title="Receita simulada" value={money(metrics.revenue)} note="Não é receita real confirmada" />
          <Card icon="📦" title="Produtos" value={String(state.products.length)} note="Registados no sistema" />
          <Card icon="🎨" title="Criativos" value={String(state.creatives.length)} note="Rascunhos e materiais" />
          <Card icon="📢" title="Campanhas" value={String(state.campaigns.length)} note="Registadas no sistema" />
          <Card icon="🛒" title="Pedidos" value={String(state.orders.length)} note="Registados no sistema" />
        </section>

        <div className="main-grid">
          <section className="panel">
            <div className="panel-head"><div><h2>Fluxo operacional</h2><p>Acompanha os registos que passam pelos módulos.</p></div><span className="badge">DADOS PARTILHADOS</span></div>
            <div className="pipeline">
              {pipeline.map((item, index) => (
                <button className="pipeline-row" key={item.href} onClick={() => router.push(item.href)} type="button">
                  <span className="pipeline-icon">{item.icon}</span>
                  <span className="pipeline-label">{item.label}<small>Ver módulo</small></span>
                  <strong>{item.count}</strong>
                  {index < pipeline.length - 1 && <span className="pipeline-arrow">›</span>}
                </button>
              ))}
            </div>
            <p className="helper">Os números são lidos do estado partilhado do Autopilot; não representam atividade externa ou vendas confirmadas.</p>
          </section>

          <section className="panel security-panel">
            <div className="panel-head"><div><h2>🛡️ Proteção do sistema</h2><p>Controlos de segurança atuais.</p></div></div>
            <Security title="Modo simulação" value="ATIVO" safe />
            <Security title="Compras reais" value="BLOQUEADAS" safe />
            <Security title="Anúncios reais" value="BLOQUEADOS" safe />
            <Security title="Pagamentos automáticos" value="BLOQUEADOS" safe />
            <Security title="Levantamentos" value="BLOQUEADOS" safe />
            <div className="security-note">Estas proteções são impostas pelo estado central do Autopilot. Não são ativadas a partir do Dashboard.</div>
          </section>
        </div>

        <section className="panel finance">
          <div className="panel-head"><div><h2>📊 Resumo financeiro</h2><p>Valores agregados em meticais (MT).</p></div><span className="badge">SIMULAÇÃO</span></div>
          <div className="finance-grid">
            <Finance title="Receita" value={money(metrics.revenue)} />
            <Finance title="Custos" value={money(metrics.costs)} />
            <Finance title="Resultado" value={money(metrics.profit)} />
            <Finance title="ROAS indicativo" value={metrics.roas.toFixed(2) + "x"} />
          </div>
          <p className="finance-disclaimer">O ROAS é um rácio global indicativo calculado com os registos atuais, não uma atribuição por campanha. Os valores não representam resultados reais confirmados.</p>
        </section>

        <section className="quick-links">
          <div><h2>Próximos passos</h2><p>Continua a configurar e validar cada área antes de qualquer operação real.</p></div>
          <button type="button" onClick={() => router.push("/supervisor")}>Abrir Supervisor AI <span>›</span></button>
        </section>

        <footer className="footer">AI Business Autopilot <span>•</span> Sistema privado <span>•</span> Modo de simulação</footer>
      </section>

      <style jsx>{`
        * { box-sizing: border-box; }
        .dashboard { --bg:#080d19; --panel:#101a2c; --border:rgba(148,163,184,.14); --muted:#94a3b8; --cyan:#67e8f9; min-height:100vh; display:flex; color:#f8fafc; background:radial-gradient(ellipse at 90% 0%,rgba(30,64,175,.2),transparent 38%),var(--bg); font-family:Arial,Helvetica,sans-serif; }
        .sidebar { flex:0 0 244px; width:244px; min-height:100vh; padding:22px 14px; background:rgba(12,20,35,.96); border-right:1px solid var(--border); }
        .brand { display:flex; align-items:center; gap:11px; margin:0 4px 28px; }
        .logo { flex:0 0 44px; width:44px; height:44px; display:grid; place-items:center; border-radius:13px; background:linear-gradient(135deg,#22d3ee,#6366f1); color:#07111f; font-weight:900; }
        .brand strong,.brand span { display:block; } .brand strong { font-size:15px; } .brand span { margin-top:4px; color:var(--muted); font-size:12px; }
        nav { display:grid; gap:5px; }
        .nav-link { width:100%; min-height:43px; display:flex; align-items:center; gap:10px; padding:10px; border:1px solid transparent; border-radius:10px; background:transparent; color:#cbd5e1; text-align:left; font-size:13px; cursor:pointer; }
        .nav-icon { width:22px; text-align:center; } .nav-link:hover,.nav-link.active { background:rgba(34,211,238,.09); border-color:rgba(34,211,238,.2); color:var(--cyan); }
        .safe { display:flex; align-items:flex-start; gap:10px; margin-top:24px; padding:13px 10px; border:1px solid rgba(34,197,94,.2); border-radius:12px; background:rgba(34,197,94,.06); }
        .safe-dot,.sync-dot { flex:0 0 8px; width:8px; height:8px; margin-top:4px; border-radius:50%; background:#4ade80; }
        .safe strong,.safe small { display:block; } .safe strong { font-size:12px; } .safe small { margin-top:5px; color:var(--muted); font-size:10px; }
        .content { flex:1; min-width:0; width:0; max-width:1500px; margin:0 auto; padding:30px clamp(16px,2.5vw,36px); }
        .header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:23px; }
        .heading { min-width:0; } .eyebrow { color:var(--cyan); font-size:10px; font-weight:700; letter-spacing:2px; }
        h1 { max-width:100%; margin:9px 0; font-size:clamp(25px,3.1vw,42px); line-height:1.12; letter-spacing:-1.2px; overflow-wrap:anywhere; }
        h2 { margin:0; font-size:17px; line-height:1.4; } p { color:var(--muted); line-height:1.55; } .heading p { margin:8px 0 0; font-size:13px; }
        .sync { flex:0 0 auto; display:inline-flex; align-items:center; gap:8px; padding:9px 12px; border:1px solid; border-radius:999px; font-size:11px; white-space:nowrap; }
        .sync .sync-dot { margin:0; } .sync.good { border-color:rgba(34,197,94,.2); background:rgba(34,197,94,.06); color:#86efac; } .sync.pending { border-color:rgba(250,204,21,.22); background:rgba(250,204,21,.07); color:#fde68a; } .sync.pending .sync-dot { background:#fbbf24; } .sync.bad { border-color:rgba(248,113,113,.25); background:rgba(248,113,113,.08); color:#fca5a5; } .sync.bad .sync-dot { background:#f87171; }
        .banner { display:flex; align-items:center; gap:13px; padding:17px; margin-bottom:17px; border:1px solid rgba(34,211,238,.17); border-radius:15px; background:linear-gradient(115deg,rgba(34,211,238,.08),rgba(99,102,241,.07)); }
        .banner-icon { font-size:24px; } .banner-copy { flex:1; min-width:0; } .banner-copy strong { font-size:13px; } .banner-copy p { margin:5px 0 0; font-size:12px; }
        .simulation-tag,.badge { flex:0 0 auto; align-self:center; padding:7px 9px; border-radius:999px; background:rgba(250,204,21,.08); color:#fde68a; font-size:9px; font-weight:700; letter-spacing:.3px; }
        .warning { padding:12px 14px; margin-bottom:16px; border:1px solid rgba(248,113,113,.25); border-radius:11px; background:rgba(248,113,113,.08); color:#fecaca; font-size:12px; }
        .cards { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; margin-bottom:17px; }
        .card,.panel { min-width:0; border:1px solid var(--border); background:rgba(16,26,44,.9); box-shadow:0 12px 35px rgba(0,0,0,.12); }
        .card { padding:16px; border-radius:15px; } .card-icon { font-size:21px; } .card-title { margin:12px 0 6px; color:var(--muted); font-size:11px; } .card-value { font-size:clamp(16px,1.7vw,22px); font-weight:700; overflow-wrap:anywhere; } .card-note { display:block; margin-top:7px; color:#64748b; font-size:10px; }
        .main-grid { display:grid; grid-template-columns:minmax(0,1.7fr) minmax(250px,1fr); align-items:start; gap:16px; }
        .panel { padding:19px; border-radius:17px; } .panel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:16px; } .panel-head p { margin:5px 0 0; font-size:12px; }
        .pipeline { display:grid; gap:8px; } .pipeline-row { display:flex; align-items:center; gap:11px; width:100%; min-height:58px; padding:10px 12px; border:1px solid rgba(148,163,184,.1); border-radius:11px; background:rgba(30,41,59,.4); color:#f8fafc; text-align:left; cursor:pointer; }
        .pipeline-row:hover { border-color:rgba(34,211,238,.3); background:rgba(34,211,238,.06); } .pipeline-icon { width:34px; height:34px; display:grid; place-items:center; border-radius:9px; background:rgba(255,255,255,.05); }
        .pipeline-label { flex:1; font-size:12px; } .pipeline-label small { display:block; margin-top:4px; color:var(--muted); font-size:10px; } .pipeline-row strong { min-width:24px; color:var(--cyan); text-align:right; font-size:16px; } .pipeline-arrow { color:#64748b; font-size:20px; }
        .helper { margin:13px 0 0; font-size:10px; } .security-row { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; padding:13px 0; border-bottom:1px solid rgba(148,163,184,.1); font-size:12px; }
        .security-row span { min-width:0; color:#cbd5e1; } .security-row strong { flex:0 0 auto; color:#86efac; font-size:9px; text-align:right; } .security-note { margin-top:14px; padding:11px; border-radius:10px; background:rgba(34,197,94,.05); color:#cbd5e1; font-size:11px; line-height:1.5; }
        .finance { margin-top:16px; } .finance-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-top:16px; } .finance-grid>div { min-width:0; padding:14px; border:1px solid rgba(148,163,184,.08); border-radius:11px; background:rgba(30,41,59,.4); }
        .finance-grid span { color:var(--muted); font-size:11px; } .finance-grid strong { display:block; margin-top:8px; font-size:clamp(15px,1.8vw,19px); overflow-wrap:anywhere; } .finance-disclaimer { margin:13px 0 0; font-size:10px; }
        .quick-links { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-top:16px; padding:18px; border:1px solid var(--border); border-radius:15px; background:rgba(16,26,44,.65); } .quick-links p { margin:5px 0 0; font-size:12px; }
        .quick-links button { flex:0 0 auto; padding:11px 14px; border:1px solid rgba(34,211,238,.25); border-radius:10px; background:rgba(34,211,238,.08); color:var(--cyan); font-size:12px; font-weight:700; cursor:pointer; } .quick-links button span { padding-left:8px; }
        .footer { padding:22px 5px 5px; color:#64748b; text-align:center; font-size:10px; line-height:1.8; } .footer span { padding:0 5px; color:#475569; }
        @media(max-width:1150px) { .sidebar { flex-basis:215px; width:215px; } .content { padding:24px 18px; } .cards { grid-template-columns:repeat(3,minmax(0,1fr)); } .main-grid { grid-template-columns:minmax(0,1.3fr) minmax(230px,1fr); } }
        @media(max-width:800px) { .dashboard { display:block; } .sidebar { width:100%; min-height:0; padding:14px; border-right:0; border-bottom:1px solid var(--border); } .brand { margin-bottom:14px; } nav { display:flex; gap:7px; overflow-x:auto; padding:2px 0 8px; scrollbar-width:thin; } .nav-link { flex:0 0 auto; width:auto; min-height:40px; white-space:nowrap; } .safe { margin-top:9px; padding:10px; } .content { width:100%; padding:20px 14px; } .main-grid { grid-template-columns:1fr; } .header { gap:12px; } }
        @media(max-width:520px) { .content { padding:18px 12px; } .header { display:block; } h1 { font-size:clamp(25px,7vw,32px); letter-spacing:-.7px; } .heading p { font-size:12px; } .sync { margin-top:13px; } .banner { align-items:flex-start; flex-wrap:wrap; padding:14px; } .banner-copy { flex-basis:calc(100% - 42px); } .simulation-tag { margin-left:37px; } .cards { grid-template-columns:repeat(2,minmax(0,1fr)); gap:9px; } .card { padding:13px; } .card-value { font-size:clamp(15px,4.4vw,20px); } .panel { padding:14px; } .finance-grid { grid-template-columns:repeat(2,minmax(0,1fr)); } .finance-grid>div { padding:12px; } .panel-head { gap:8px; } .badge { font-size:8px; } .quick-links { align-items:flex-start; flex-direction:column; } .quick-links button { width:100%; } }
        @media(prefers-reduced-motion:no-preference) { .nav-link,.pipeline-row,.quick-links button { transition:background .15s ease,border-color .15s ease; } }
      `}</style>
    </main>
  );
}

function money(value: number) { return value.toLocaleString("pt-PT") + " MT"; }

function Card({ icon, title, value, note }: { icon: string; title: string; value: string; note: string }) {
  return <article className="card"><div className="card-icon">{icon}</div><div className="card-title">{title}</div><div className="card-value">{value}</div><small className="card-note">{note}</small></article>;
}

function Security({ title, value, safe }: { title: string; value: string; safe: boolean }) {
  return <div className="security-row"><span>{title}</span><strong className={safe ? "safe-value" : "warning-value"}>{value}</strong></div>;
}

function Finance({ title, value }: { title: string; value: string }) {
  return <div><span>{title}</span><strong>{value}</strong></div>;
}
