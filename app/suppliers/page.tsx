"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import {
  Search,
  Globe,
  ExternalLink,
  ShieldCheck,
  Info,
  Plus,
  Trash2,
  Calculator,
  ClipboardList,
} from "lucide-react";



const emptyQuote = {
  company: "",
  country: "China",
  platform: "Alibaba",
  product: "",
  currency: "USD",
  unitPrice: "",
  minimumOrder: "1",
  shipping: "0",
  taxes: "0",
  notes: "",
};

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export default function SuppliersPage() {
  const [product, setProduct] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [country, setCountry] = useState("Qualquer país");
  const [market, setMarket] = useState("Moçambique");
  const { state, addSupplierQuote, removeSupplierQuote } = useAutopilot();
  const quotes = state.supplierQuotes;
  const [form, setForm] = useState(emptyQuote);
  const autoSelectionAttempted = useRef(false);

  // Se existir apenas um produto no Research AI, liga-o automaticamente uma vez.
  useEffect(() => {
    if (state.products.length === 0) {
      autoSelectionAttempted.current = false;
      return;
    }
    if (state.products.length !== 1 || autoSelectionAttempted.current) return;

    const onlyProduct = state.products[0];
    if (!onlyProduct) return;

    autoSelectionAttempted.current = true;
    setSelectedProductId(onlyProduct.id);
    setProduct(onlyProduct.name);
    setForm((current) => ({ ...current, product: onlyProduct.name }));
  }, [state.products]);

  const ready = product.trim().length > 0;
  const searchText = [
    product.trim(),
    country !== "Qualquer país" ? country : "",
    market ? `for export to ${market}` : "",
  ].filter(Boolean).join(" ");

  const externalSearch = (base: string) =>
    `${base}${encodeURIComponent(searchText)}`;

  const platforms = [
    {
      name: "Alibaba",
      description: "Produtos por grosso e fabricantes internacionais.",
      url: externalSearch("https://www.alibaba.com/trade/search?SearchText="),
    },
    {
      name: "Global Sources",
      description: "Pesquisa de fornecedores e fabricantes internacionais.",
      url: externalSearch("https://www.google.com/search?q=site%3Aglobalsources.com+"),
    },
    {
      name: "Made-in-China",
      description: "Fabricantes e produtos para comércio internacional.",
      url: externalSearch("https://www.google.com/search?q=site%3Amade-in-china.com+"),
    },
  ];

  const comparison = useMemo(() => {
    const groupKey = (quote: (typeof quotes)[number]) => [
      quote.productId || "",
      quote.product.trim().toLocaleLowerCase("pt-PT"),
      quote.currency.trim().toUpperCase(),
      quote.minimumOrder,
    ].join("::");

    const unitLandedCost = (quote: (typeof quotes)[number]) =>
      (quote.unitPrice * quote.minimumOrder + quote.shipping + quote.taxes) /
      quote.minimumOrder;

    return [...quotes].sort((a, b) => {
      const groupOrder = groupKey(a).localeCompare(groupKey(b), "pt-PT");
      if (groupOrder !== 0) return groupOrder;
      return unitLandedCost(a) - unitLandedCost(b);
    });
  }, [quotes]);

  // Só existe um vencedor quando há pelo menos duas propostas no mesmo grupo.
  const comparisonGroupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const quote of comparison) {
      const key = [
        quote.productId || "",
        quote.product.trim().toLocaleLowerCase("pt-PT"),
        quote.currency.trim().toUpperCase(),
        quote.minimumOrder,
      ].join("::");
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
  }, [comparison]);

  function addQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const unitPrice = Number(form.unitPrice);
    const minimumOrder = Number(form.minimumOrder);
    const shipping = Number(form.shipping);
    const taxes = Number(form.taxes);

    if (!form.company.trim() || !form.product.trim() ||
        !Number.isFinite(unitPrice) || unitPrice < 0 ||
        !Number.isInteger(minimumOrder) || minimumOrder < 1 ||
        !Number.isFinite(shipping) || shipping < 0 ||
        !Number.isFinite(taxes) || taxes < 0) return;

    addSupplierQuote({
        id: `quote-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        productId: selectedProductId || undefined,
        company: form.company.trim(),
        country: form.country,
        platform: form.platform,
        product: form.product.trim(),
        currency: form.currency,
        unitPrice,
        minimumOrder,
        shipping,
        taxes,
        notes: form.notes.trim(),
    });
    // Mantém o produto para registar várias propostas do mesmo artigo sem voltar a preenchê-lo.
    setForm((current) => ({ ...emptyQuote, product: current.product.trim() }));
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white sm:p-8">
      <div className="mx-auto max-w-5xl space-y-7">
        <header className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
            <Globe size={30} />
          </div>
          <div>
            <p className="text-sm text-cyan-300">AI BUSINESS AUTOPILOT</p>
            <h1 className="text-3xl font-bold">Supplier AI</h1>
            <p className="mt-1 text-sm text-slate-400">
              Pesquisa e compara propostas de fornecedores.
            </p>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-7">
          <h2 className="text-xl font-semibold">Encontrar fornecedores</h2>
          <p className="mt-2 text-sm text-slate-400">
            Seleciona um produto do Research AI para reutilizar o seu nome, ou escreve uma pesquisa independente.
          </p>

          <div className="mt-5">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Importar produto do Research AI</span>
              <select
                value={selectedProductId}
                disabled={state.products.length === 0}
                onChange={(event) => {
                  const id = event.target.value;
                  const selected = state.products.find((item) => item.id === id);
                  setSelectedProductId(id);
                  if (selected) {
                    setProduct(selected.name);
                    setForm((current) => ({ ...current, product: selected.name }));
                  }
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">
                  {state.products.length > 0
                    ? "Selecionar produto existente..."
                    : "Nenhum produto disponível no Autopilot"}
                </option>
                {state.products.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} — {item.market}</option>
                ))}
              </select>
            </label>
            {state.products.length === 0 ? (
              <p className="mt-2 text-xs text-amber-300">
                Ainda não recebemos produtos guardados. Volta ao Research AI, adiciona um produto e aguarda a confirmação de gravação antes de regressar.
                <a href="/research" className="ml-1 text-cyan-300 underline">Abrir Research AI</a>
              </p>
            ) : (
              <p className="mt-2 text-xs text-emerald-300">
                {state.products.length === 1
                  ? "O único produto disponível foi selecionado automaticamente e está ligado à futura cotação."
                  : `${state.products.length} produto(s) disponível(is). Seleciona um para preencher o nome e ligar a futura cotação.`}
              </p>
            )}
            {selectedProductId && (
              <span className="mt-2 block text-xs text-emerald-300">
                Produto ligado ao Research AI. Confirma especificações e custos com o fornecedor.
              </span>
            )}
          </div>

          <form className="mt-5 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Produto que pretendes comprar</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3">
                <Search size={18} className="text-slate-400" />
                <input
                  value={product}
                  onChange={(event) => {
                    setProduct(event.target.value);
                    setSelectedProductId("");
                    setForm((current) => ({ ...current, product: event.target.value }));
                  }}
                  placeholder="Ex.: organizadores inteligentes para casa"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">País de origem pretendido</span>
                <select value={country} onChange={(event) => setCountry(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
                  {["Qualquer país", "China", "Moçambique", "África do Sul", "Brasil", "Portugal", "Índia", "Turquia", "Alemanha", "Estados Unidos"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Mercado onde pretendes vender</span>
                <select value={market} onChange={(event) => setMarket(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
                  {["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "Estados Unidos", "Global"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pesquisar nas plataformas</h2>
          {!ready && <p className="text-sm text-amber-300">Escreve primeiro o nome de um produto.</p>}
          {platforms.map((platform) => (
            <article key={platform.name} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-semibold">{platform.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{platform.description}</p>
              </div>
              <a href={ready ? platform.url : undefined} target="_blank" rel="noopener noreferrer"
                aria-disabled={!ready} onClick={(event) => { if (!ready) event.preventDefault(); }}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${ready ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" : "cursor-not-allowed bg-slate-800 text-slate-500"}`}>
                Pesquisar <ExternalLink size={16} />
              </a>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-cyan-500/25 bg-slate-900 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-cyan-300" size={22} />
            <h2 className="text-xl font-semibold">Registar proposta para comparação</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Introduz os valores que recebeste diretamente do fornecedor. O Autopilot não recolhe nem confirma estes dados.
          </p>

          <form onSubmit={addQuote} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Nome da empresa fornecedora</span>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Nome indicado pelo fornecedor" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Produto / modelo cotado</span>
                <input
                  required
                  value={form.product}
                  onChange={(e) => {
                    const nextProduct = e.target.value;
                    setForm((current) => ({ ...current, product: nextProduct }));
                    const linkedProduct = state.products.find((item) => item.id === selectedProductId);
                    if (
                      linkedProduct &&
                      nextProduct.trim().toLocaleLowerCase("pt-PT") !==
                        linkedProduct.name.trim().toLocaleLowerCase("pt-PT")
                    ) {
                      setSelectedProductId("");
                    }
                  }}
                  placeholder="Produto e especificação"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">País de origem</span>
                <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
                  {["China", "Moçambique", "África do Sul", "Brasil", "Portugal", "Índia", "Turquia", "Alemanha", "Estados Unidos", "Outro / não confirmado"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Plataforma de origem</span>
                <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
                  {["Alibaba", "Global Sources", "Made-in-China", "Contacto direto", "Outra"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Preço por unidade</span>
                <input required type="number" min="0" step="0.01" value={form.unitPrice}
                  onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} placeholder="Ex.: 4.50"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Moeda dos valores</span>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3">
                  {["USD", "EUR", "MZN", "ZAR", "CNY"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Quantidade mínima (MOQ)</span>
                <input required type="number" min="1" step="1" value={form.minimumOrder}
                  onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Transporte total estimado</span>
                <input required type="number" min="0" step="0.01" value={form.shipping}
                  onChange={(e) => setForm({ ...form, shipping: e.target.value })} placeholder="0"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Impostos / taxas estimados</span>
                <input required type="number" min="0" step="0.01" value={form.taxes}
                  onChange={(e) => setForm({ ...form, taxes: e.target.value })} placeholder="0"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Notas (certificados, prazo, condições, etc.)</span>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3} placeholder="Regista o que o fornecedor declarou e o que ainda falta confirmar."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              <Plus size={18} /> Adicionar à comparação
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="text-cyan-300" size={22} />
            <h2 className="text-xl font-semibold">Comparação de propostas</h2>
          </div>
          {comparison.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-6 text-sm text-slate-400">
              Ainda não adicionaste propostas. Depois de registares os valores recebidos, a comparação aparecerá aqui.
            </div>
          ) : comparison.map((quote, index) => {
            const goods = quote.unitPrice * quote.minimumOrder;
            const total = goods + quote.shipping + quote.taxes;
            const perUnit = total / quote.minimumOrder;
            const comparableKey = [
              quote.productId || "",
              quote.product.trim().toLocaleLowerCase("pt-PT"),
              quote.currency.trim().toUpperCase(),
              quote.minimumOrder,
            ].join("::");
            const previousQuote = comparison[index - 1];
            const previousKey = previousQuote
              ? [
                  previousQuote.productId || "",
                  previousQuote.product.trim().toLocaleLowerCase("pt-PT"),
                  previousQuote.currency.trim().toUpperCase(),
                  previousQuote.minimumOrder,
                ].join("::")
              : null;
            const isFirstInGroup = comparableKey !== previousKey;
            const showLowestBadge = isFirstInGroup && (comparisonGroupCounts.get(comparableKey) || 0) > 1;
            return (
              <article key={quote.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-cyan-300">PROPOSTA REGISTADA · VALORES DECLARADOS</p>
                    {showLowestBadge && (
                      <span className="mt-2 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Menor custo estimado neste grupo
                      </span>
                    )}
                    <h3 className="mt-1 text-lg font-semibold">{quote.company}</h3>
                    <p className="text-sm text-slate-400">{quote.product} · {quote.country} · {quote.platform}</p>
                  </div>
                  <button type="button" onClick={() => removeSupplierQuote(quote.id)}
                    aria-label="Remover proposta" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-950 p-3"><p className="text-slate-400">Preço / unidade</p><p className="mt-1 font-semibold">{money(quote.unitPrice, quote.currency)}</p></div>
                  <div className="rounded-xl bg-slate-950 p-3"><p className="text-slate-400">MOQ</p><p className="mt-1 font-semibold">{quote.minimumOrder.toLocaleString("pt-PT")}</p></div>
                  <div className="rounded-xl bg-slate-950 p-3"><p className="text-slate-400">Transporte + taxas</p><p className="mt-1 font-semibold">{money(quote.shipping + quote.taxes, quote.currency)}</p></div>
                  <div className="rounded-xl bg-slate-950 p-3"><p className="text-slate-400">Custo total estimado</p><p className="mt-1 font-semibold text-cyan-300">{money(total, quote.currency)}</p></div>
                </div>
                <p className="mt-3 text-sm text-slate-300">Custo estimado por unidade com transporte e taxas: <strong>{money(perUnit, quote.currency)}</strong></p>
                {quote.notes && <p className="mt-2 whitespace-pre-wrap text-sm text-slate-400">Notas: {quote.notes}</p>}
                <p className="mt-3 text-xs text-amber-300">Fornecedor ainda não verificado. Os valores não foram confirmados pelo Autopilot.</p>
              </article>
            );
          })}
          {comparison.length > 1 && (
            <p className="text-xs text-slate-500">As propostas são agrupadas por produto, moeda, produto ligado e MOQ. Dentro de cada grupo, a menor estimativa de custo por unidade aparece primeiro. Confirma também especificações, qualidade, Incoterms, prazo, garantia e condições de pagamento: estes detalhes ainda não são validados automaticamente.</p>
          )}
        </section>

        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex gap-3">
            <ShieldCheck className="shrink-0 text-amber-300" />
            <div>
              <h3 className="font-semibold">Verificação antes de comprar</h3>
              <p className="mt-1 text-sm text-slate-300">
                Antes de qualquer compra, confirma a identidade legal da empresa, registo comercial, certificados aplicáveis, amostras, MOQ, condições de pagamento, custo de transporte, seguro, direitos aduaneiros e impostos. Confirma os dados por canais independentes.
              </p>
            </div>
          </div>
        </section>

        <p className="flex items-start gap-2 text-xs text-slate-500">
          <Info size={16} className="shrink-0" />
          As pesquisas abrem plataformas externas. As propostas são guardadas no estado do Autopilot e sincronizadas com Supabase quando a sessão está ativa. O módulo não verifica empresas, não envia mensagens, não faz encomendas nem pagamentos.
        </p>
      </div>
    </main>
  );
}
