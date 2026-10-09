
"use client";

import { useState } from "react";
import {
  Search,
  Globe,
  ExternalLink,
  ShieldCheck,
  Info,
} from "lucide-react";

export default function SuppliersPage() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("Qualquer país");
  const [market, setMarket] = useState("Moçambique");

  const ready = product.trim().length > 0;

  const searchText = [
    product.trim(),
    country !== "Qualquer país" ? country : "",
    market ? `for export to ${market}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const externalSearch = (base: string) =>
    `${base}${encodeURIComponent(searchText)}`;

  const platforms = [
    {
      name: "Alibaba",
      description: "Produtos por grosso e fabricantes internacionais.",
      url: externalSearch(
        "https://www.alibaba.com/trade/search?SearchText="
      ),
    },
    {
      name: "Global Sources",
      description: "Pesquisa de fornecedores e fabricantes internacionais.",
      url: externalSearch(
        "https://www.google.com/search?q=site%3Aglobalsources.com+"
      ),
    },
    {
      name: "Made-in-China",
      description: "Fabricantes e produtos para comércio internacional.",
      url: externalSearch(
        "https://www.google.com/search?q=site%3Amade-in-china.com+"
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
            <Globe size={30} />
          </div>
          <div>
            <p className="text-sm text-cyan-300">
              AI BUSINESS AUTOPILOT
            </p>
            <h1 className="text-3xl font-bold">Fornecedores</h1>
            <p className="mt-1 text-sm text-slate-400">
              Pesquisa oportunidades em plataformas internacionais.
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <h2 className="text-xl font-semibold">
            Encontrar fornecedores
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Indica o produto e os países para orientar a pesquisa externa.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">
                Produto que pretendes comprar
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3">
                <Search size={18} className="text-slate-400" />
                <input
                  value={product}
                  onChange={(event) => setProduct(event.target.value)}
                  placeholder="Ex.: organizadores inteligentes para casa"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  País de origem
                </span>
                <select
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  {[
                    "Qualquer país",
                    "China",
                    "Moçambique",
                    "África do Sul",
                    "Brasil",
                    "Portugal",
                    "Índia",
                    "Turquia",
                    "Alemanha",
                    "Estados Unidos",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">
                  Mercado onde pretendes vender
                </span>
                <select
                  value={market}
                  onChange={(event) => setMarket(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                >
                  {[
                    "Moçambique",
                    "Brasil",
                    "Portugal",
                    "África do Sul",
                    "Europa",
                    "Estados Unidos",
                    "Global",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Pesquisar nas plataformas
          </h2>

          {!ready && (
            <p className="text-sm text-amber-300">
              Escreve primeiro o nome de um produto.
            </p>
          )}

          {platforms.map((platform) => (
            <article
              key={platform.name}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-semibold">{platform.name}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {platform.description}
                </p>
              </div>

              <a
                href={ready ? platform.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!ready}
                onClick={(event) => {
                  if (!ready) event.preventDefault();
                }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                  ready
                    ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                }`}
              >
                Pesquisar
                <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="shrink-0 text-amber-300" />
            <div>
              <h3 className="font-semibold">
                Verificação antes de comprar
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Confirma a identidade da empresa, certificados, amostras,
                quantidade mínima, custo de transporte, impostos e proteção
                de pagamento. Os resultados externos não são automaticamente
                verificados pelo Autopilot.
              </p>
            </div>
          </div>
        </section>

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Info size={16} className="shrink-0" />
          Esta versão abre pesquisas externas. Ainda não recolhe resultados
          automaticamente, não contacta fornecedores e não realiza compras.
        </p>
      </div>
    </main>
  );
    }
        
