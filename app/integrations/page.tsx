
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Cloud,
  Database,
  ExternalLink,
  Globe,
  Link2,
  LockKeyhole,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";

type Category = "Todos" | "Dados" | "Lojas" | "Marketing" | "Comunicação" | "Pagamentos";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, "Todos">;
  icon: typeof Database;
  color: string;
  requirements: string[];
};

const integrations: Integration[] = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Base de dados, autenticação e armazenamento.",
    category: "Dados",
    icon: Database,
    color: "#3ecf8e",
    requirements: ["URL do projeto", "Chave pública apropriada", "Políticas de segurança"],
  },
  {
    id: "store",
    name: "Loja online",
    description: "Preparar a ligação a uma plataforma de comércio eletrónico.",
    category: "Lojas",
    icon: ShoppingBag,
    color: "#8b5cf6",
    requirements: ["Plataforma escolhida", "Credenciais de API", "Permissões mínimas"],
  },
  {
    id: "meta",
    name: "Meta Ads",
    description: "Preparar a integração para análise de campanhas publicitárias.",
    category: "Marketing",
    icon: Activity,
    color: "#4388ff",
    requirements: ["Conta empresarial", "Aplicação autorizada", "Permissões de leitura"],
  },
  {
    id: "google",
    name: "Google",
    description: "Preparar serviços de análise e dados de desempenho.",
    category: "Marketing",
    icon: Globe,
    color: "#eab308",
    requirements: ["Serviço selecionado", "Projeto configurado", "Autorização"],
  },
  {
    id: "messaging",
    name: "Mensagens",
    description: "Preparar um canal de atendimento ao cliente.",
    category: "Comunicação",
    icon: MessageSquare,
    color: "#22c55e",
    requirements: ["Fornecedor escolhido", "Número ou canal autorizado", "Consentimento aplicável"],
  },
  {
    id: "payments",
    name: "Pagamentos",
    description: "Planear a integração futura de pagamentos com segurança.",
    category: "Pagamentos",
    icon: Wallet,
    color: "#f59e0b",
    requirements: ["Fornecedor de pagamentos", "Ambiente de testes", "Verificação de segurança"],
  },
];

const categories: Category[] = [
  "Todos",
  "Dados",
  "Lojas",
  "Marketing",
  "Comunicação",
  "Pagamentos",
];

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("Todos");
  const [selected, setSelected] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return integrations.filter((item) => {
      const matchesCategory = category === "Todos" || item.category === category;
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  function toggleSelected(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function toggleTask(task: string) {
    setCompleted((current) =>
      current.includes(task)
        ? current.filter((item) => item !== task)
        : [...current, task]
    );
  }

  const checklist = [
    "Escolher os serviços que serão integrados",
    "Confirmar as permissões necessárias",
    "Configurar variáveis de ambiente no Vercel",
    "Testar as ligações em ambiente de demonstração",
    "Rever segurança e proteção de dados",
    "Autorizar separadamente qualquer operação real",
  ];

  return (
    <main className="page">
      <div className="container">
        <a className="back" href="/">
          <ArrowLeft size={17} /> Voltar ao AI Business Autopilot
        </a>

        <header className="hero">
          <div className="heroTop">
            <div className="heroIcon"><Link2 size={27} /></div>
            <span className="mode"><span /> MODO DE DEMONSTRAÇÃO</span>
          </div>

          <p className="eyebrow">AI BUSINESS AUTOPILOT / SISTEMA</p>
          <h1>Integrations AI</h1>
          <p className="intro">
            Organiza as integrações do Autopilot num único local.
            Prepara os serviços, acompanha os requisitos e planeia os próximos passos.
          </p>

          <div className="notice">
            <ShieldCheck size={20} />
            <div>
              <strong>Controlo de segurança ativo</strong>
              <p>
                Nenhuma conta será ligada e nenhuma operação externa será executada
                por esta página. Os estados apresentados são demonstrativos.
              </p>
            </div>
          </div>
        </header>

        <section className="stats">
          <article className="stat">
            <span>Serviços disponíveis</span>
            <strong>{integrations.length}</strong>
            <small>Opções para planear</small>
          </article>
          <article className="stat">
            <span>Selecionados</span>
            <strong>{selected.length}</strong>
            <small>Seleção local</small>
          </article>
          <article className="stat">
            <span>Checklist concluída</span>
            <strong>{completed.length}/{checklist.length}</strong>
            <small>Progresso desta sessão</small>
          </article>
        </section>

        <section className="section">
          <div className="sectionHead">
            <div>
              <p className="eyebrow">CATÁLOGO</p>
              <h2>Serviços e plataformas</h2>
              <p className="muted">Seleciona os serviços que pretendes preparar.</p>
            </div>
            <button className="secondary" onClick={() => setShowChecklist(!showChecklist)}>
              <SlidersHorizontal size={16} />
              {showChecklist ? "Ocultar plano" : "Plano de integração"}
            </button>
          </div>

          <div className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar serviços..."
              aria-label="Pesquisar serviços"
            />
            {query && (
              <button className="iconButton" onClick={() => setQuery("")} aria-label="Limpar pesquisa">
                <XCircle size={18} />
              </button>
            )}
          </div>

          <div className="filters">
            {categories.map((item) => (
              <button
                key={item}
                className={`filter ${category === item ? "active" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid">
            {filtered.map((item) => {
              const Icon = item.icon;
              const isSelected = selected.includes(item.id);
              const isExpanded = expanded === item.id;

              return (
                <article className={`integration ${isSelected ? "chosen" : ""}`} key={item.id}>
                  <div className="cardTop">
                    <div className="serviceIcon" style={{ color: item.color }}>
                      <Icon size={24} />
                    </div>
                    <span className="status"><span /> Não ligado</span>
                  </div>

                  <div className="cardTitle">
                    <h3>{item.name}</h3>
                    <span className="category">{item.category}</span>
                  </div>
                  <p className="description">{item.description}</p>

                  <button className="details" onClick={() => setExpanded(isExpanded ? null : item.id)}>
                    {isExpanded ? "Ocultar requisitos" : "Ver requisitos"}
                    <ExternalLink size={14} />
                  </button>

                  {isExpanded && (
                    <div className="requirements">
                      <strong>Antes de ligar</strong>
                      {item.requirements.map((requirement) => (
                        <div className="requirement" key={requirement}>
                          <Circle size={14} /> {requirement}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className={isSelected ? "selectedButton" : "selectButton"}
                    onClick={() => toggleSelected(item.id)}
                  >
                    {isSelected ? <CheckCircle2 size={17} /> : <Link2 size={17} />}
                    {isSelected ? "Selecionado para planeamento" : "Selecionar serviço"}
                  </button>
                </article>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <Search size={25} />
              <strong>Nenhum serviço encontrado</strong>
              <p>Tenta outra pesquisa ou seleciona outra categoria.</p>
              <button className="secondary" onClick={() => { setQuery(""); setCategory("Todos"); }}>
                Limpar filtros
              </button>
            </div>
          )}
        </section>

        {selected.length > 0 && (
          <section className="selectedPanel">
            <div>
              <p className="eyebrow">PLANEAMENTO</p>
              <h2>{selected.length} serviço(s) selecionado(s)</h2>
              <p className="muted">
                {integrations
                  .filter((item) => selected.includes(item.id))
                  .map((item) => item.name)
                  .join(" · ")}
              </p>
            </div>
            <button className="secondary" onClick={() => setSelected([])}>
              Limpar seleção
            </button>
          </section>
        )}

        {showChecklist && (
          <section className="section checklist">
            <div className="sectionHead">
              <div>
                <p className="eyebrow">PRÓXIMAS ETAPAS</p>
                <h2>Checklist de integração</h2>
                <p className="muted">
                  Marca cada tarefa à medida que for concluída.
                </p>
              </div>
              <Zap size={25} />
            </div>

            <div className="progressTrack">
              <div style={{ width: `${(completed.length / checklist.length) * 100}%` }} />
            </div>

            {checklist.map((task) => {
              const done = completed.includes(task);
              return (
                <button
                  className={`task ${done ? "taskDone" : ""}`}
                  key={task}
                  onClick={() => toggleTask(task)}
                >
                  {done ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                  <span>{task}</span>
                </button>
              );
            })}
            <p className="footnote">
              O progresso é temporário e fica apenas nesta sessão. Não representa
              uma integração real.
            </p>
          </section>
        )}

        <section className="security">
          <div className="securityIcon"><LockKeyhole size={22} /></div>
          <div>
            <h3>Operações reais continuam protegidas</h3>
            <p>
              Credenciais devem ficar em variáveis de ambiente protegidas.
              Nunca coloques chaves secretas no código do navegador.
              A ativação de cada integração deverá ser implementada e testada
              separadamente.
            </p>
          </div>
        </section>

        <footer>
          <Cloud size={15} />
          Integrations AI · Interface de demonstração · AI Business Autopilot
        </footer>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #080d18;
          color: #edf2ff;
          padding: 28px 18px 60px;
          font-family: Arial, Helvetica, sans-serif;
        }
        .container { max-width: 1120px; margin: 0 auto; }
        .back {
          display: inline-flex; align-items: center; gap: 9px;
          color: #aab8d3; text-decoration: none; font-size: 14px;
          margin-bottom: 26px;
        }
        .back:hover { color: white; }
        .hero {
          padding: 30px; border: 1px solid #24334c; border-radius: 22px;
          background: linear-gradient(135deg, #111d32, #0b1220 70%);
        }
        .heroTop, .sectionHead, .cardTop, .cardTitle {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
        }
        .heroIcon {
          width: 54px; height: 54px; border-radius: 16px;
          display: grid; place-items: center; color: #83b7ff;
          background: #1b3457;
        }
        .mode {
          display: inline-flex; align-items: center; gap: 8px; padding: 8px 11px;
          border: 1px solid #42516a; border-radius: 30px; color: #c1cde0;
          font-size: 10px; letter-spacing: .07em;
        }
        .mode span, .status span {
          width: 7px; height: 7px; border-radius: 50%; background: #fbbf24;
        }
        .eyebrow { color: #8dbaff; font-size: 10px; letter-spacing: .16em; font-weight: 700; margin: 0 0 10px; }
        .hero .eyebrow { margin-top: 28px; }
        h1 { font-size: clamp(30px, 5vw, 46px); letter-spacing: -.04em; margin: 0 0 12px; }
        .intro { color: #afbdd3; max-width: 720px; line-height: 1.7; margin: 0; }
        .notice {
          display: flex; gap: 13px; margin-top: 25px; padding: 16px;
          border: 1px solid #294c48; border-radius: 13px;
          background: #102521; color: #81e4bd;
        }
        .notice strong { font-size: 13px; }
        .notice p { margin: 5px 0 0; color: #b2cfc5; font-size: 12px; line-height: 1.6; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 18px 0 38px; }
        .stat { border: 1px solid #25334a; border-radius: 15px; padding: 20px; background: #101827; }
        .stat span, .stat small { display: block; color: #9baac2; font-size: 12px; }
        .stat strong { display: block; font-size: 29px; margin: 10px 0 5px; }
        .stat small { color: #7487a3; }
        .section { margin-top: 34px; }
        h2 { margin: 0 0 7px; font-size: 22px; letter-spacing: -.025em; }
        .muted { margin: 0; color: #98a8c1; font-size: 13px; line-height: 1.6; }
        .secondary, .selectButton, .selectedButton, .filter, .iconButton {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          border-radius: 10px; border: 1px solid #34445e; cursor: pointer;
          font: inherit; transition: .15s ease;
        }
        .secondary { background: #111c2d; color: #dbe7fb; padding: 11px 13px; font-size: 12px; }
        .secondary:hover, .filter:hover { border-color: #719cdb; }
        .search {
          display: flex; align-items: center; gap: 11px; padding: 0 14px;
          border: 1px solid #2b3b55; border-radius: 12px; background: #0f1726;
          color: #8fa4c2; margin-top: 22px;
        }
        .search input { width: 100%; padding: 15px 0; border: 0; outline: 0; color: #f1f5ff; background: transparent; font-size: 14px; }
        .search input::placeholder { color: #73839d; }
        .iconButton { border: 0; background: transparent; color: #91a1bb; padding: 4px; }
        .filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 20px; }
        .filter { padding: 8px 12px; background: #101827; color: #aebbd0; font-size: 12px; }
        .filter.active { background: #1c3b62; border-color: #5487c7; color: #e4efff; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
        .integration { min-width: 0; padding: 20px; border-radius: 16px; background: #101827; border: 1px solid #27364d; }
        .integration.chosen { border-color: #5794d9; box-shadow: 0 0 0 1px #5794d933; }
        .serviceIcon { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 13px; background: #1a2638; }
        .status { display: inline-flex; align-items: center; gap: 6px; color: #c4cddd; font-size: 10px; }
        .cardTitle { align-items: flex-start; margin-top: 19px; flex-wrap: wrap; }
        h3 { margin: 0; font-size: 16px; }
        .category { color: #9eb3d0; background: #1a273b; border-radius: 6px; padding: 5px 7px; font-size: 10px; }
        .description { min-height: 44px; color: #9eacc2; font-size: 12px; line-height: 1.7; margin: 12px 0 15px; }
        .details { border: 0; background: transparent; color: #8ebcff; display: flex; align-items: center; gap: 7px; padding: 0; cursor: pointer; font-size: 12px; }
        .requirements { margin-top: 13px; padding: 12px; background: #0b1321; border-radius: 10px; color: #d8e4f7; font-size: 11px; }
        .requirements strong { display: block; margin-bottom: 10px; }
        .requirement { display: flex; gap: 7px; align-items: flex-start; margin: 8px 0; color: #9eafc7; line-height: 1.5; }
        .requirement :global(svg) { flex-shrink: 0; margin-top: 1px; }
        .selectButton, .selectedButton { width: 100%; padding: 11px 9px; margin-top: 19px; font-size: 11px; }
        .selectButton { background: #17253a; color: #d9e7fc; }
        .selectButton:hover { background: #203958; }
        .selectedButton { color: #9ae6c5; background: #102b25; border-color: #2c6654; }
        .empty { text-align: center; padding: 40px 15px; border: 1px dashed #34445e; border-radius: 15px; color: #9fb0c8; }
        .empty strong { display: block; margin: 12px 0 6px; color: #edf2ff; }
        .empty p { font-size: 13px; }
        .empty .secondary { margin-top: 12px; }
        .selectedPanel { display: flex; justify-content: space-between; align-items: center; gap: 18px; flex-wrap: wrap; margin-top: 20px; padding: 22px; border: 1px solid #2c4b70; background: #111e30; border-radius: 15px; }
        .checklist { padding: 24px; border: 1px solid #27364d; border-radius: 17px; background: #101827; }
        .checklist .sectionHead { margin-bottom: 20px; }
        .progressTrack { height: 6px; border-radius: 20px; overflow: hidden; background: #26354a; margin-bottom: 15px; }
        .progressTrack div { height: 100%; background: #56d6a2; transition: width .2s ease; }
        .task { width: 100%; display: flex; gap: 12px; align-items: center; text-align: left; padding: 13px 2px; border: 0; border-bottom: 1px solid #263349; color: #d2ddef; background: transparent; cursor: pointer; font-size: 13px; }
        .task :global(svg) { color: #8296b4; flex-shrink: 0; }
        .taskDone { color: #81dfb8; }
        .taskDone :global(svg) { color: #67d8a6; }
        .footnote { color: #788aa5; font-size: 11px; line-height: 1.6; margin: 15px 0 0; }
        .security { display: flex; gap: 14px; padding: 21px; margin-top: 30px; border: 1px solid #3d3940; background: #191821; border-radius: 15px; }
        .securityIcon { color: #f0c779; }
        .security h3 { font-size: 14px; }
        .security p { color: #a7a4b1; font-size: 12px; line-height: 1.8; margin: 8px 0 0; }
        footer { display: flex; align-items: center; justify-content: center; gap: 7px; margin-top: 30px; color: #71819b; font-size: 11px; text-align: center; }
        @media (max-width: 850px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 560px) {
          .page { padding: 18px 12px 40px; }
          .hero { padding: 21px; }
          .stats { gap: 8px; }
 
