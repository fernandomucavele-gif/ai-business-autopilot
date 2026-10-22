
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  X,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Menu,
  Trash2,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Check,
  ChevronDown,
  SlidersHorizontal,
  Star,
  Truck,
  RotateCcw,
  LockKeyhole,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  tag?: string;
  rating: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Aurora Signature",
    category: "Acessórios",
    price: 12500,
    oldPrice: 15000,
    description: "Elegância minimalista para todos os dias.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85",
    tag: "MAIS VENDIDO",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Éclat Prestige",
    category: "Acessórios",
    price: 18900,
    description: "Um detalhe distinto, uma presença inesquecível.",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85",
    tag: "SELEÇÃO EXCLUSIVA",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Noir Collection",
    category: "Moda",
    price: 9800,
    description: "Design contemporâneo com acabamento premium.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Velvet Essence",
    category: "Beleza",
    price: 7500,
    description: "Uma experiência sensorial sofisticada.",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85",
    tag: "NOVO",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Maison Élégance",
    category: "Casa & Lifestyle",
    price: 14200,
    description: "Peças escolhidas para elevar o seu espaço.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Urban Gold",
    category: "Moda",
    price: 11200,
    description: "Personalidade urbana com um toque de luxo.",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Lumière Atelier",
    category: "Beleza",
    price: 8900,
    description: "Sofisticação nos pequenos detalhes.",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Signature Living",
    category: "Casa & Lifestyle",
    price: 16500,
    description: "Uma seleção que transforma o quotidiano.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    tag: "ESCOLHA DO ATELIER",
    rating: 4.9,
  },
];

const categories = [
  "Todos",
  "Moda",
  "Acessórios",
  "Beleza",
  "Casa & Lifestyle",
];

const money = (amount: number) =>
  new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ShopPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.category === category;
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [category, search, sort]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { product, quantity: 1 }];
    });

    setNotice(`${product.name} foi adicionado ao carrinho.`);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const changeQuantity = (productId: number, amount: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((current) =>
      current.filter((item) => item.product.id !== productId)
    );
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const submitOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // A integração com pagamentos e registo real de encomendas
    // será adicionada através de um backend seguro.
    setNotice(
      "Formulário validado. A finalização real será ativada após a integração dos pagamentos."
    );
    setCheckoutOpen(false);
    setCartOpen(false);
    window.setTimeout(() => setNotice(""), 5500);
  };

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-[#171713]">
      {/* Top announcement */}
      <div className="bg-[#171713] px-4 py-2.5 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#e4c98b] sm:text-xs">
        Uma experiência de compra extraordinária · Descubra a coleção
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f8f6f1]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
          <button
            className="rounded-full p-2 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          <a href="#inicio" className="group text-center">
            <span className="block font-serif text-2xl tracking-[0.16em] sm:text-3xl">
              ATELIER
            </span>
            <span className="mt-0.5 block text-[8px] tracking-[0.42em] text-[#9a793a] sm:text-[9px]">
              MAISON DE LUXE
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#colecao"
              className="text-xs uppercase tracking-[0.16em] transition hover:text-[#9a793a]"
            >
              Coleção
            </a>
            <a
              href="#sobre"
              className="text-xs uppercase tracking-[0.16em] transition hover:text-[#9a793a]"
            >
              A nossa essência
            </a>
            <a
              href="#vantagens"
              className="text-xs uppercase tracking-[0.16em] transition hover:text-[#9a793a]"
            >
              Serviço exclusivo
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center border-b border-black/30 pb-1 md:flex">
              <Search size={16} className="mr-2 text-black/60" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar..."
                className="w-28 bg-transparent text-xs outline-none placeholder:text-black/40 lg:w-36"
                aria-label="Pesquisar produtos"
              />
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full p-2 transition hover:bg-black/5"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              <span className="hidden text-xs uppercase tracking-wider sm:inline">
                Sacola
              </span>
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b39455] px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-black/10 px-5 py-4 lg:hidden">
            <div className="mb-4 flex items-center border-b border-black/20 pb-2">
              <Search size={17} className="mr-2" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Pesquisar produtos..."
                className="w-full bg-transparent py-1 text-sm outline-none"
              />
            </div>
            <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.18em]">
              <a href="#colecao" onClick={() => setMobileMenuOpen(false)}>
                Coleção
              </a>
              <a href="#sobre" onClick={() => setMobileMenuOpen(false)}>
                A nossa essência
              </a>
              <a href="#vantagens" onClick={() => setMobileMenuOpen(false)}>
                Serviço exclusivo
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        id="inicio"
        className="relative isolate flex min-h-[580px] items-center overflow-hidden bg-[#24231f] sm:min-h-[680px]"
      >
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2200&q=90')",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="mx-auto w-full max-w-[1500px] px-6 py-20 sm:px-12 lg:px-20">
          <div className="max-w-2xl">
            <div className="mb-7 flex items-center gap-3 text-[#e4c98b]">
              <span className="h-px w-10 bg-[#c6a96b]" />
              <span className="text-[10px] uppercase tracking-[0.32em] sm:text-xs">
                A arte de escolher bem
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.08] text-[#fffdf7] sm:text-7xl lg:text-8xl">
              O luxo está
              <br />
              nos <span className="italic text-[#d9bd7e]">detalhes.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Descubra uma seleção especial de peças, acessórios e objetos
              pensados para quem valoriza a elegância, a qualidade e a
              individualidade.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#colecao"
                className="group inline-flex items-center gap-4 bg-[#c4a568] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171713] transition hover:bg-[#dfc58f] sm:text-xs"
              >
                Explorar coleção
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              </a>
              <a
                href="#sobre"
                className="inline-flex items-center border border-white/40 px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/10 sm:text-xs"
              >
                Conheça-nos
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 text-white/65">
              <div className="flex text-[#d9bd7e]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={12} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] tracking-[0.08em] sm:text-xs">
                Curadoria com atenção a cada detalhe
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 hidden items-center gap-3 text-white/60 lg:flex">
          <span className="text-[9px] uppercase tracking-[0.25em]">
            Elegância intemporal
          </span>
          <span className="h-px w-12 bg-white/40" />
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-b border-black/10 bg-[#efebe2]">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 divide-y divide-black/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">
          <div className="flex items-center justify-center gap-3 py-5">
            <ShieldCheck size={20} className="text-[#a08449]" strokeWidth={1.4} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Escolha cuidada
              </p>
              <p className="mt-1 text-[11px] text-black/55">
                Seleção de produtos
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 py-5">
            <Truck size={20} className="text-[#a08449]" strokeWidth={1.4} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Entrega a combinar
              </p>
              <p className="mt-1 text-[11px] text-black/55">
                Informação antes da compra
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 py-5">
            <RotateCcw size={20} className="text-[#a08449]" strokeWidth={1.4} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Apoio personalizado
              </p>
              <p className="mt-1 text-[11px] text-black/55">
                Atendimento dedicado
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="colecao" className="mx-auto max-w-[1500px] px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 text-[#9a793a]">
              <Sparkles size={15} />
              <span className="text-[10px] uppercase tracking-[0.28em]">
                A seleção do atelier
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl">
              Peças para <span className="italic text-[#a1844b]">admirar.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/55">
              Produtos escolhidos para complementar o seu estilo e tornar
              especiais os momentos do dia a dia.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-black/55">
            <span className="font-medium text-black">
              {filteredProducts.length}
            </span>
            produtos
          </div>
        </div>

        {/* Search and filters */}
        <div className="mb-8 space-y-5 border-y border-black/10 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap border px-4 py-2.5 text-[10px] uppercase tracking-[0.13em] transition sm:text-xs ${
                    category === item
                      ? "border-[#171713] bg-[#171713] text-white"
                      : "border-black/15 text-black/60 hover:border-[#a1844b] hover:text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center border border-black/15 bg-white/60 px-3 py-2.5 lg:hidden">
                <Search size={16} className="mr-2 shrink-0 text-black/45" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full min-w-0 bg-transparent text-xs outline-none"
                />
              </div>
              <SlidersHorizontal size={16} className="hidden text-black/50 sm:block" />
              <div className="relative">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none border border-black/15 bg-transparent py-2.5 pl-3 pr-8 text-[10px] uppercase tracking-[0.1em] outline-none sm:text-xs"
                  aria-label="Ordenar produtos"
                >
                  <option value="featured">Destaques</option>
                  <option value="price-low">Menor preço</option>
                  <option value="price-high">Maior preço</option>
                  <option value="rating">Melhor avaliação</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group min-w-0">
                <div className="relative overflow-hidden bg-[#ece8df]">
                  <a
                    href={`#produto-${product.id}`}
                    onClick={(event) => event.preventDefault()}
                    aria-label={`Ver ${product.name}`}
                    className="block aspect-[4/5] overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      classN
