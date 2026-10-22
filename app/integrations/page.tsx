
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
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Category =
  | "Dados"
  | "Lojas"
  | "Marketing"
  | "Comunicação"
  | "Pagamentos";

type Integration = {
  id: string;
  name: string;
  description: string;
  category: Category;
  icon: LucideIcon;
  color: string;
  requirements: string[];
  purpose: string;
};

const categories = [
  "Todas",
  "Dados",
  "Lojas",
  "Marketing",
  "Comunicação",
  "Pagamentos",
] as const;

const integrations: Integration[] = [
  {
    id: "supabase",
    name: "Supabase",
    description: "Base de dados e autenticação da aplicação.",
    category: "Dados",
    icon: Database,
    color: "#3ecf8e",
    requirements: [
      "Confirmar o projeto Supabase",
      "Verificar as variáveis de ambiente",
      "Testar a ligação em ambiente seguro",
    ],
    purpose:
      "Armazenar dados da aplicação, utilizadores e registos dos módulos, de acordo com as permissões configuradas.",
  },
  {
    id: "store",
    name: "Loja online",
    description: "Preparar a ligação a uma plataforma de comércio eletrónico.",
    category: "Lojas",
    icon: ShoppingBag,
    color: "#a78bfa",
    requirements: [
      "Escolher a plataforma da loja",
      "Definir as permissões necessárias",
      "Testar a leitura de produtos",
    ],
    purpose:
      "Preparar a sincronização de produtos e dados da loja. Não cria encomendas nem altera produtos reais nesta demonstração.",
  },
  {
    id: "meta",
    name: "Meta Ads",
    description: "Preparar a integração com ferramentas de publicidade.",
    category: "Marketing",
    icon: Globe,
    color: "#60a5fa",
    requirements: [
      "Identificar a conta de anúncios",
      "Configurar permissões de acesso",
      "Testar a leitura de relatórios",
    ],
    purpose:
      "Permitir uma futura análise de campanhas e resultados publicitários. Não publica nem altera anúncios.",
  },
  {
    id: "google",
    name: "Google",
    description: "Preparar serviços e fontes de dados Google.",
    category: "Dados",
    icon: Cloud,
    color: "#fbbf24",
    requirements: [
      "Escolher o serviço Google",
      "Configurar credenciais seguras",
      "Verificar os acessos autorizados",
    ],
    purpose:
      "Preparar o acesso a serviços Google compatíveis, conforme as APIs e permissões que vierem a ser configuradas.",
  },
  {
    id: "messages",
    name: "Mensagens",
    description: "Preparar canais de comunicação com clientes.",
    category: "Comunicação",
    icon: MessageSquare,
    color: "#34d399",
    requirements: [
      "Escolher o canal de comunicação",
      "Definir as permissões",
      "Testar num ambiente de demonstração",
    ],
    purpose:
      "Preparar futuras integrações de comunicação. Não envia mensagens reais nem contacta clientes.",
  },
  {
    id: "payments",
    name: "Pagamentos",
    description: "Preparar uma futura integração com um fornecedor de pagamentos.",
    category: "Pagamentos",
    icon: Wallet,
    color: "#fb923c",
    requirements: [
      "Escolher um fornecedor compatível",
      "Configurar credenciais de teste",
      "Validar o fluxo de pagamento de teste",
    ],
    purpose:
      "Preparar testes de pagamentos em ambiente sandbox. Não cobra, transfere ou movimenta dinheiro.",
  },
];

export default function IntegrationsPage() {
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Todas");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  const filteredIntegrations = useMemo(() => {
    const term = search.trim().toLowerCase();

    return integrations.filter((integration) => {
      const matchesCategory =
        category === "Todas" || integration.category === category;

      const matchesSearch =
        !term ||
        integration.name.toLowerCase().includes(term) ||
        integration.description.toLowerCase().includes(term) ||
        integration.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const selectedIntegration =
    integrations.find((item) => item.id === selectedId) ?? null;

  const progress =
    selectedIntegration && selectedIntegration.requirements.length > 0
      ? Math.round(
          (selectedIntegration.requirements.filter((item) =>
            completed.includes(`${selectedIntegration.id}:${item}`)
          ).length /
            selectedIntegration.requirements.length) *
            100
        )
      : 0;

  function toggleRequirement(integrationId: string, requirement: string) {
    const key = `${integrationId}:${requirement}`;

    setCompleted((previous) =>
      previous.includes(key)
        ? previous.filter((item) => item !== key)
        : [...previous, key]
    );
  }

  function markReviewed(integrationId: string) {
    setReviewed((previous) =>
      previous.includes(integrationId)
        ? previous
        : [...previous, integrationId]
    );
  }

  return (
    <main className="integrations-page">
      <header className="topbar">
        <a className="back-link" href="/">
          <ArrowLeft size={17} />
          <span>Painel principal</span>
        </a>

        <div className="environment">
          <span className="environment-dot" />
          Modo de demonstração
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <Zap size={15} />
            AI BUSINESS AUTOPILOT
          </div>

          <h1>
            Integrations <span>AI</span>
          </h1>

          <p>
            Organiza as integrações do teu negócio num único lugar.
            Prepara os requisitos, acompanha a configuração e mantém
            o controlo dos acessos.
          </p>

          <div className="hero-note">
            <ShieldCheck size={17} />
            <span>
              Seguro por defeito: nenhuma conta real é ligada neste módulo.
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-core">
            <Link2 size={35} />
          </div>
          <div className="orbit-node node-one">
            <Database size={19} />
          </div>
          <div className="orbit-node node-two">
            <Globe size={19} />
          </div>
          <div className="orbit-node node-three">
            <Cloud size={19} />
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon purple">
            <Link2 size={19} />
          </div>
          <div>
            <span className="stat-label">Integrações disponíveis</span>
            <strong>{integrations.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green">
            <CheckCircle2 size={19} />
          </div>
          <div>
            <span className="stat-label">Revisões realizadas</span>
            <strong>{reviewed.length}</strong>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue">
            <Activity size={19} />
          </div>
          <div>
            <span className="stat-label">Etapas verificadas</span>
            <strong>{completed.length}</strong>
          </div>
        </article>
      </section>

      <section className="workspace">
        <div className="section-heading">
          <div>
            <span className="section-kicker">CENTRO DE LIGAÇÕES</span>
            <h2>As tuas integrações</h2>
            <p>Seleciona um serviço para consultar os requisitos.</p>
          </div>

          <div className="available-label">
            <span />
            Catálogo disponível
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar integrações..."
              aria-label="Pesquisar integrações"
            />
            {search && (
              <button
                className="clear-search"
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpar pesquisa"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-label">
            <SlidersHorizontal size={17} />
            <span>Categoria</span>
          </div>
        </div>

        <div className="category-list" aria-label="Filtrar por categoria">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`category-button ${
                category === item ? "active" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredIntegrations.length === 0 ? (
          <div className="empty-state">
            <Search size={28} />
            <h3>Nenhum resultado encontrado</h3>
            <p>Tenta outro nome ou seleciona uma categoria diferente.</p>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSearch("");
                setCategory("Todas");
              }}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="integration-grid">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              const isSelected = selectedId === integration.id;
              const isReviewed = reviewed.includes(integration.id);

              return (
                <article
                  className={`integration-card ${
                    isSelected ? "selected" : ""
                  }`}
                  key={integration.id}
                >
                  <div className="card-top">
                    <div
                      className="integration-icon"
                      style={{
                        color: integration.color,
                        backgroundColor: `${integration.color}18`,
                      }}
                    >
                      <Icon size={23} />
                    </div>

                    <span
                      className={`status-pill ${
                        isReviewed ? "reviewed" : ""
                      }`}
                    >
                      <span />
                      {isReviewed ? "Revista" : "Por configurar"}
                    </span>
                  </div>

                  <div className="card-content">
                    <span className="card-category">
                      {integration.category}
                    </span>
                    <h3>{integration.name}</h3>
                    <p>{integration.description}</p>
                  </div>

                  <button
                    type="button"
                    className="card-action"
                    onClick={() => setSelectedId(integration.id)}
                  >
                    Consultar requisitos
                    <ExternalLink size={16} />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedIntegration && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedId(null);
            }
          }}
        >
          <section
            className="details-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-title"
          >
            <div className="details-header">
              <div>
                <span className="section-kicker">DETALHES DA INTEGRAÇÃO</span>
                <h2 id="details-title">{selectedIntegration.name}</h2>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedId(null)}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <p className="details-description">
              {selectedIntegration.purpose}
            </p>

            <div className="safety-message">
              <LockKeyhole size={19} />
              <div>
                <strong>Ligação real ainda não configurada</strong>
                <p>
                  Esta lista serve para planear e acompanhar tarefas.
                  Assinalar etapas não testa credenciais nem estabelece
                  uma ligação externa.
                </p>
              </div>
            </div>

            <div className="progress-heading">
              <span>Lista de preparação</span>
              <strong>{progress}%</strong>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="Progresso da preparação"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="requirements-list">
              {selectedIntegration.requirements.map((requirement) => {
                const key = `${selectedIntegration.id}:${requirement}`;
                const isComplete = completed.includes(key);

                return (
                  <button
                    type="button"
                    key={requirement}
                    className={`requirement-row ${
                      isComplete ? "complete" : ""
                    }`}
                    onClick={() =>
                      toggleRequirement(selectedIntegration.id, requirement)
                    }
                  >
                    {isComplete ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                    <span>{requirement}</span>
                  </button>
                );
              })}
            </div>

            <div className="details-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setSelectedId(null)}
              >
                Fechar
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  markReviewed(selectedIntegration.id);
                  setSelectedId(null);
                }}
              >
                <CheckCircle2 size={17} />
                Marcar como revista
              </button>
            </div>
          </section>
        </div>
      )}

      <footer className="page-footer">
        <div className="footer-icon">
          <ShieldCheck size={18} />
        </div>
        <div>
          <strong>Controlo e segurança</strong>
          <p>
            Não introduzas palavras-passe, chaves privadas ou tokens
            neste ecrã. Quando houver integrações reais, as credenciais
            deverão ser guardadas em variáveis de ambiente seguras.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .integrations-page {
          --bg: #0a0d14;
          --panel: #111722;
          --panel-light: #151d2b;
          --border: #253044;
          --text: #f3f6fc;
          --muted: #96a2b7;
          --accent: #a78bfa;
          min-height: 100vh;
          padding: 28px;
          background: var(--bg);
          color: var(--text);
          font-family: Arial, Helvetica, sans-serif;
        }

        .topbar {
          max-width: 1240px;
          margin: 0 auto 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #c4ccda;
          text-decoration: none;
          font-size: 14px;
        }

        .back-link:hover {
          color: white;
        }

        .environment,
        .available-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 9px 12px;
          color: #c6d0df;
          background: #101621;
          font-size: 12px;
        }

        .environment-dot,
        .available-label > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fbbf24;
        }

        .hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          max-width: 1240px;
          min-height: 265px;
          margin: 0 auto 22px;
          padding: 34px 38px;
          overflow: hidden;
          border: 1px solid #2c2948;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 78% 50%,
              rgba(124, 92, 246, 0.16),
              transparent 34%
            ),
            linear-gradient(115deg, #151625, #111827 75%);
        }

        .hero-copy {
          position: relative;
          z-index: 2;
          max-width: 650px;
        }

        .eyebrow,
        .section-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #b5a2ff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 18px 0 12px;
          font-size: clamp(34px, 5vw, 54px);
          line-height: 1.05;
          letter-spacing: -2px;
        }

        h1 span {
          color: #b5a2ff;
        }

        .hero-copy > p {
          max-width: 590px;
          margin: 0;
          color: #aab5c8;
          font-size: 15px;
          line-height: 1.8;
        }

        .hero-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 22px;
          color: #c3b7ff;
          font-size: 12px;
          line-height: 1.6;
        }

        .hero-note :global(svg) {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .hero-visual {
          position: relative;
          width: 225px;
          height: 225px;
          flex-shrink: 0;
          margin-right: 25px;
        }

        .orbit {
          position: absolute;
          inset: 15px;
          border: 1px solid rgba(167, 139, 250, 0.28);
          border-radius: 50%;
        }

        .orbit-one {
          transform: rotateX(58deg) rotate(-25deg);
        }

        .orbit-two {
          transform: rotateY(58deg) rotate(25deg);
        }

        .orbit-core {
          position: ab