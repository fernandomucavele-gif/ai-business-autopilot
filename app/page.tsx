"use client";

import { useMemo, useState } from "react";
import {
  initialAutopilotState,
  getSystemStatus,
  type Market,
} from "../lib/autopilot";

type MenuItem = {
  icon: string;
  name: string;
};

const menu: MenuItem[] = [
  { icon: "🏠", name: "Dashboard" },
  { icon: "🔎", name: "Research AI" },
  { icon: "🏭", name: "Fornecedores" },
  { icon: "🎨", name: "Creative AI" },
  { icon: "📢", name: "Ads AI" },
  { icon: "📊", name: "Analytics" },
  { icon: "👥", name: "Customer AI" },
  { icon: "📦", name: "Orders AI" },
  { icon: "💰", name: "Finanças" },
  { icon: "🤖", name: "Supervisor AI" },
  { icon: "👁️", name: "Monitoramento" },
  { icon: "⚙️", name: "Configurações" },
];

const markets: Market[] = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

const simulatedProducts = [
  {
    name: "Organizador inteligente para casa",
    market: "Moçambique",
    score: 88,
    reason: "Problema simples, fácil demonstração em vídeo e possibilidade de margem.",
  },
  {
    name: "Acessório portátil para automóvel",
    market: "Brasil",
    score: 84,
    reason: "Produto visual, público amplo e possibilidade de venda por impulso.",
  },
  {
    name: "Acessório de fitness doméstico",
    market: "Europa",
    score: 81,
    reason: "Categoria com vários públicos e possibilidade de conteúdo curto.",
  },
];

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [market, setMarket] = useState<Market>("Moçambique");
  const [researchRunning, setResearchRunning] = useState(false);
  const [researchDone, setResearchDone] = useState(false);
  const [automation, setAutomation] = useState(false);

  const systemStatus = useMemo(
    () => getSystemStatus(initialAutopilotState),
    []
  );

  function startResearch() {
    setResearchRunning(true);
    setResearchDone(false);

    setTimeout(() => {
      setResearchRunning(false);
      setResearchDone(true);
    }, 1800);
  }

  function renderDashboard() {
    return (
      <>
        <div className="pageHeader">
          <div>
            <p className="eyebrow">PRIVATE AI SYSTEM</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Centro de controlo do teu AI Business Autopilot.
            </p>
          </div>

          <div className="online">
            <span>●</span> Sistema online
          </div>
        </div>

        <div className="cards">
          <div className="card">
            <span>💰 Receita</span>
            <strong>{systemStatus.revenue} MT</strong>
            <small>Modo simulação</small>
          </div>

          <div className="card">
            <span>📈 Campanhas</span>
            <strong>{systemStatus.campaigns}</strong>
            <small>Nenhuma campanha real ativa</small>
          </div>

          <div className="card">
            <span>🤖 Tarefas IA</span>
            <strong>{systemStatus.orders + systemStatus.products}</strong>
            <small>Processos preparados</small>
          </div>

          <div className="card">
            <span>⚡ Automação</span>
            <strong>{automation ? "TESTE" : "OFF"}</strong>
            <small>Ações reais continuam bloqueadas</small>
          </div>
        </div>

        <div className="grid2">
          <section className="panel">
            <div className="panelTitle">
              <div>
                <h2>🎯 Centro de atividade</h2>
                <p>Atividade atual do sistema.</p>
              </div>

              <span className="simulationBadge">SIMULAÇÃO</span>
            </div>

            <div className="activity">
              <div className="activityIcon">🤖</div>
              <div>
                <strong>O Autopilot está pronto</strong>
                <p>
                  Os agentes de pesquisa, fornecedores, criativos, anúncios,
                  clientes, encomendas e finanças estão preparados.
                </p>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>🔐 Segurança</h2>

            <div className="securityRow">
              <span>Modo simulação</span>
              <b>ATIVO</b>
            </div>

            <div className="securityRow">
              <span>Compras automáticas</span>
              <b>BLOQUEADAS</b>
            </div>

            <div className="securityRow">
              <span>Pagamentos automáticos</span>
              <b>BLOQUEADOS</b>
            </div>

            <div className="securityRow">
              <span>Publicação real de anúncios</span>
              <b>BLOQUEADA</b>
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panelTitle">
            <div>
              <h2>🌍 Mercados</h2>
              <p>Mercados que o Autopilot poderá analisar.</p>
            </div>
          </div>

          <div className="marketList">
            {markets.map((item) => (
              <button
                key={item}
                className={market
