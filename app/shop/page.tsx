"use client";

import { useMemo, useState } from "react";
import { Search, ShoppingBag, Plus, Minus, X, ShieldCheck, Store } from "lucide-react";

type Product = { id: number; name: string; category: string; price: number; description: string; image: string };
type CartLine = { product: Product; quantity: number };

const products: Product[] = [
  { id: 1, name: "Aurora Signature", category: "Acessórios", price: 12500, description: "Elegância minimalista para todos os dias.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" },
  { id: 2, name: "Éclat Prestige", category: "Acessórios", price: 18900, description: "Um detalhe distinto, uma presença inesquecível.", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80" },
  { id: 3, name: "Casa Serena", category: "Casa", price: 7600, description: "Peças funcionais para um espaço mais harmonioso.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80" },
  { id: 4, name: "Essencial Diário", category: "Tecnologia", price: 9900, description: "Tecnologia prática com design intemporal.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80" },
];

const money = (value: number) => new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN", maximumFractionDigits: 0 }).format(value);

export default function PublicShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notice, setNotice] = useState("");
  const categories = ["Todos", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = useMemo(() => products.filter((product) => (category === "Todos" || product.category === category) && (product.name + " " + product.description).toLowerCase().includes(search.toLowerCase())), [category, search]);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  function add(product: Product) {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      return found ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }];
    });
    setNotice("");
  }
  function change(id: number, delta: number) {
    setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
  }
  function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Pedido de demonstração validado. Nenhuma encomenda real foi enviada e nenhum pagamento foi cobrado. A integração de encomendas e pagamentos será configurada antes da abertura comercial.");
    setCheckoutOpen(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#171713]">
      <div className="bg-[#171713] px-4 py-2 text-center text-[10px] tracking-[0.18em] text-white sm:text-xs">AUTOPILOT MARKETPLACE · LOJA EM DEMONSTRAÇÃO</div>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/shop" className="flex items-center gap-3" aria-label="Autopilot Marketplace início"><span className="grid h-10 w-10 place-items-center bg-[#171713] text-white"><Store size={20}/></span><span><strong className="block text-sm tracking-[0.16em]">AUTOPILOT</strong><span className="text-[10px] tracking-[0.25em] text-black/55">MARKETPLACE</span></span></a>
        <div className="flex items-center gap-3"><span className="hidden text-xs text-black/55 sm:inline">Uma seleção para o dia a dia</span><button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 border border-black/20 px-4 py-3 text-xs uppercase tracking-wider hover:bg-black hover:text-white"><ShoppingBag size={16}/> Carrinho <span>({count})</span></button></div>
      </header>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-5 pb-12 pt-6 sm:px-8 md:grid-cols-2 md:pb-20">
        <div className="py-8 md:py-14"><p className="mb-5 text-[10px] tracking-[0.3em] text-[#8d7445]">DESIGN · QUALIDADE · SIMPLICIDADE</p><h1 className="max-w-xl text-4xl leading-[1.08] tracking-tight sm:text-6xl">Escolhas cuidadas. <em className="font-serif font-normal">Vida mais simples.</em></h1><p className="mt-6 max-w-md text-sm leading-7 text-black/60">Descobre a nossa seleção de produtos para casa, acessórios e tecnologia.</p><a href="#catalogo" className="mt-8 inline-flex bg-[#171713] px-6 py-4 text-xs uppercase tracking-[0.16em] text-white hover:bg-[#8d7445]">Explorar coleção</a></div>
        <div className="relative"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Interior elegante e acolhedor" className="h-[300px] w-full object-cover sm:h-[430px]"/><div className="absolute bottom-4 left-4 bg-[#f8f6f1]/95 px-4 py-3 text-xs tracking-wide">COLEÇÃO · ESSENCIAIS CONTEMPORÂNEOS</div></div>
      </section>
      <section id="catalogo" className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-black/15 pb-6 sm:flex-row sm:items-end"><div><p className="mb-3 text-[10px] tracking-[0.25em] text-[#8d7445]">A NOSSA SELEÇÃO</p><h2 className="text-3xl tracking-tight sm:text-4xl">Catálogo</h2></div><label className="flex items-center gap-2 border border-black/20 bg-white/60 px-3 py-3 sm:w-72"><Search size={16} className="text-black/45"/><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar produtos..." className="w-full bg-transparent text-sm outline-none"/></label></div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap border px-4 py-2.5 text-[10px] uppercase tracking-[0.13em] ${category === item ? "border-[#171713] bg-[#171713] text-white" : "border-black/15 hover:border-[#8d7445]"}`}>{item}</button>)}</div>
        {filtered.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">{filtered.map((product) => <article key={product.id} className="group min-w-0"><div className="overflow-hidden bg-[#ece8df]"><img src={product.image} alt={product.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"/></div><p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-black/45">{product.category}</p><h3 className="mt-2 text-sm sm:text-base">{product.name}</h3><p className="mt-2 text-xs leading-5 text-black/55">{product.description}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-2"><strong className="text-sm">{money(product.price)}</strong><button onClick={() => add(product)} className="bg-[#171713] px-3 py-2.5 text-[10px] uppercase tracking-wider text-white hover:bg-[#8d7445]">Adicionar +</button></div></article>)}</div> : <p className="py-12 text-center text-sm text-black/55">Não encontrámos produtos para essa pesquisa.</p>}
        <p className="mt-12 border border-[#b79c67]/40 bg-[#eee8da] p-4 text-xs leading-6 text-black/65"><ShieldCheck size={16} className="mr-2 inline-block"/> <strong>Modo de demonstração:</strong> produtos e preços ilustrativos. O checkout não processa pagamentos nem envia encomendas reais.</p>
      </section>
      <footer className="border-t border-black/15 px-5 py-8 text-center text-[10px] tracking-[0.15em] text-black/50">AUTOPILOT MARKETPLACE · EXPERIÊNCIA DE DEMONSTRAÇÃO</footer>
      {cartOpen && <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setCartOpen(false)}><aside className="h-full w-full max-w-md overflow-y-auto bg-[#f8f6f1] p-5 sm:p-7" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-black/15 pb-5"><h2 className="text-xl">O teu carrinho ({count})</h2><button aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}><X/></button></div>{cart.length ? <><div className="divide-y divide-black/10">{cart.map((line) => <div key={line.product.id} className="flex gap-4 py-5"><img src={line.product.image} alt="" className="h-20 w-16 object-cover"/><div className="flex-1"><strong className="text-sm">{line.product.name}</strong><p className="mt-2 text-sm">{money(line.product.price * line.quantity)}</p><div className="mt-3 flex items-center gap-3"><button aria-label="Diminuir quantidade" onClick={() => change(line.product.id, -1)}><Minus size={15}/></button><span className="text-sm">{line.quantity}</span><button aria-label="Aumentar quantidade" onClick={() => change(line.product.id, 1)}><Plus size={15}/></button></div></div></div>)}</div><div className="border-t border-black/15 pt-5"><div className="mb-5 flex justify-between"><span>Total estimado</span><strong>{money(total)}</strong></div><button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="w-full bg-[#171713] px-5 py-4 text-xs uppercase tracking-widest text-white">Continuar para checkout</button><p className="mt-3 text-xs leading-5 text-black/55">Demonstração apenas. Não haverá cobrança.</p></div></> : <p className="py-12 text-sm text-black/55">O carrinho ainda está vazio.</p>}</aside></div>}
      {checkoutOpen && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"><section className="my-6 w-full max-w-lg bg-[#f8f6f1] p-6 sm:p-8"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl">Dados de demonstração</h2><button aria-label="Fechar checkout" onClick={() => setCheckoutOpen(false)}><X/></button></div><p className="mb-5 text-xs leading-5 text-black/55">Este formulário não envia pedidos reais nem processa pagamentos.</p><form onSubmit={submitOrder} className="grid gap-4"><label className="grid gap-2 text-xs">Nome<input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="border border-black/20 bg-white/60 px-3 py-3 text-sm" placeholder="Nome completo"/></label><label className="grid gap-2 text-xs">Email<input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} className="border border-black/20 bg-white/60 px-3 py-3 text-sm" placeholder="email@exemplo.com"/></label><label className="grid gap-2 text-xs">Telefone<input required value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} className="border border-black/20 bg-white/60 px-3 py-3 text-sm" placeholder="+258"/></label><div className="flex justify-between border-t border-black/15 pt-4 text-sm"><span>Total estimado</span><strong>{money(total)}</strong></div><button type="submit" className="bg-[#171713] px-5 py-4 text-xs uppercase tracking-widest text-white">Validar demonstração</button></form></section></div>}
      {notice && <div role="status" className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl border border-[#b79c67] bg-[#f8f6f1] p-4 text-sm shadow-xl"><div className="flex items-start justify-between gap-3"><p className="leading-6">{notice}</p><button aria-label="Fechar aviso" onClick={() => setNotice("")}><X size={18}/></button></div></div>}
    </main>
  );
}
