
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Store,
  Sparkles,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  description: string;
};

type CartItem = {
  productId: number;
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Organizador inteligente",
    category: "Casa",
    price: 1290,
    emoji: "🏠",
    description: "Uma solução prática para organizar a tua casa.",
  },
  {
    id: 2,
    name: "Acessório para telemóvel",
    category: "Tecnologia",
    price: 890,
    emoji: "📱",
    description: "Um acessório útil para o dia a dia.",
  },
  {
    id: 3,
    name: "Kit de treino doméstico",
    category: "Fitness",
    price: 2490,
    emoji: "💪",
    description: "Equipamento para treinar em casa.",
  },
  {
    id: 4,
    name: "Garrafa térmica",
    category: "Casa",
    price: 750,
    emoji: "🥤",
    description: "Mantém a tua bebida à mão durante o dia.",
  },
  {
    id: 5,
    name: "Suporte portátil",
    category: "Tecnologia",
    price: 1190,
    emoji: "💻",
    description: "Um suporte prático para o teu equipamento.",
  },
  {
    id: 6,
    name: "Organizador pessoal",
    category: "Pessoal",
    price: 990,
    emoji: "🎒",
    description: "Mantém os teus objetos essenciais organizados.",
  },
];

const categories = [
  "Todos",
  "Casa",
  "Tecnologia",
  "Fitness",
  "Pessoal",
];

export default function ShopPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.category === category;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    return total + (product?.price ?? 0) * item.quantity;
  }, 0);

  function addToCart(productId: number) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === productId
      );

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  }

  function changeQuantity(productId: number, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const money = (value: number) =>
    new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="shop">
      <header className="topbar">
        <a href="/shop" className="brand">
          <span className="brand-icon">
            <Store size={23} />
          </span>
          <span>
            <strong>Autopilot Store</strong>
            <small>Loja demonstrativa</small>
          </span>
        </a>

        <button
          className="cart-button"
          onClick={() => setCartOpen(!cartOpen)}
        >
          <ShoppingBag size={20} />
          Carrinho
          <span className="count">{cartCount}</span>
        </button>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={15} /> LOJA DE DEMONSTRAÇÃO
          </span>

          <h1>
            Descobre produtos
            <br />
            para o teu dia a dia.
          </h1>

          <p>
            Explora produtos, pesquisa categorias e experimenta
            o carrinho da nossa loja.
          </p>

          <a href="#produtos" className="hero-link">
            Explorar produtos ↓
          </a>
        </div>

        <div className="hero-art" aria-hidden="true">
          <span>🛍️</span>
          <div className="floating-item item-one">📱</div>
          <div className="floating-item item-two">🏠</div>
          <div className="floating-item item-three">🎧</div>
        </div>
      </section>

      <div className="notice">
        <span>ℹ️</span>
        <p>
          <strong>Modo de simulação ativo.</strong> Os produtos e
          preços são exemplos. Não existem pagamentos nem encomendas reais.
        </p>
      </div>

      <section id="produtos" className="catalog">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CATÁLOGO</span>
            <h2>Os nossos produtos</h2>
            <p>Escolhe uma categoria ou pesquisa um produto.</p>
          </div>
          <span className="product-count">
            {filteredProducts.length} produtos
          </span>
        </div>

        <div className="search-box">
          <Search size={20} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar produtos..."
            aria-label="Pesquisar produtos"
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Limpar pesquisa"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <div className="categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "category active" : "category"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className={`product-art art-${product.id}`}>
                <span>{product.emoji}</span>
                <span className="product-category">
                  {product.category}
                </span>
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <div className="product-bottom">
                  <strong>{money(product.price)}</strong>
                  <button
                    className="add-button"
                    onClick={() => addToCart(product.id)}
                    aria-label={`Adicionar ${product.name} ao carrinho`}
                  >
                    <Plus size={19} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="empty">
            <span>🔎</span>
            <h3>Nenhum produto encontrado</h3>
            <p>Experimenta outra pesquisa ou categoria.</p>
            <button
              className="primary-button"
              onClick={() => {
                setSearch("");
                setCategory("Todos");
              }}
            >
              Ver todos os produtos
            </button>
          </div>
        )}
      </section>

      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)}>
          <section
            className="cart-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-heading">
              <div>
                <h2>O teu carrinho</h2>
                <p>{cartCount} artigo(s)</p>
              </div>
              <button
                className="close-button"
                onClick={() => setCartOpen(false)}
                aria-label="Fechar carrinho"
              >
                <X size={22} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={38} />
                <h3>O carrinho está vazio</h3>
                <p>Adiciona um produto para começar.</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => {
                    const product = products.find(
                      (product) => product.id === item.productId
                    );

                    if (!product) return null;

                    return (
                      <div className="cart-item" key={item.productId}>
                        <span className="cart-emoji">
                          {product.emoji}
                        </span>
                        <div className="cart-item-info">
                          <strong>{product.name}</strong>
                          <span>{money(product.price)}</span>
                          <div className="quantity">
                            <button
                              onClick={() =>
                                changeQuantity(product.id, -1)
                              }
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                changeQuantity(product.id, 1)
                              }
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="cart-total">
                  <span>Total demonstrativo</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
                <p className="simulation-note">
                  O carrinho é apenas uma demonstração. O checkout
                  e os pagamentos reais ainda não estão ativados.
                </p>
                <button
                  className="primary-button full"
                  onClick={() =>
                    alert("Simulação: nenhum pagamento ou pedido foi criado.")
                  }
                >
                  Testar checkout demonstrativo
                </button>
                <button
                  className="clear-cart"
                  onClick={() => setCart([])}
                >
                  Esvaziar carrinho
                </button>
              </>
            )}
          </section>
        </div>
      )}

      <footer className="footer">
        <strong>Autopilot Store</strong>
        <p>Loja demonstrativa do AI Business Autopilot.</p>
        <small>© 2026 · Modo de simulação</small>
      </footer>

      <style jsx>{`
        .shop {
          min-height: 100vh;
          background: #f7f8fc;
          color: #172033;
          font-family: Arial, sans-serif;
        }

        button, input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .topbar {
          min-height: 76px;
          padding: 14px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border-bottom: 1px solid #e9ebf2;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          color: inherit;
          text-decoration: none;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          background: #e8edff;
          color: #4256c7;
          border-radius: 13px;
        }

        .brand strong, .brand small {
          display: block;
        }

        .brand strong { font-size: 16px; }
        .brand small {
          color: #788197;
          margin-top: 4px;
          font-size: 12px;
        }

        .cart-button {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          background: white;
          border: 1px solid #dfe3ee;
          border-radius: 12px;
          color: #172033;
          font-weight: 600;
        }

        .count {
          min-width: 23px;
          height: 23px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #4256c7;
          color: white;
          font-size: 12px;
        }

        .hero {
          margin: 28px auto 0;
          width: 88%;
          max-width: 1240px;
          min-height: 340px;
          padding: 48px 6%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(120deg, #e8edff, #f1eaff);
        }

        .hero-content { max-width: 590px; }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #4c5dc1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .hero h1 {
          margin: 17px 0;
          font-size: clamp(32px, 4.5vw, 53px);
          line-height: 1.12;
          letter-spacing: -1.5px;
        }

        .hero p {
          max-width: 440px;
          color: #626d85;
          line-height: 1.7;
          font-size: 15px;
        }

        .hero-link {
          display: inline-block;
          margin-top: 12px;
          padding: 13px 18px;
          background: #4256c7;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
        }

        .hero-art {
          position: relative;
          flex-shrink: 0;
          width: 210px;
          height: 210px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #ffffff8c;
        }

        .hero-art > span { font-size: 100px; }

        .floating-item {
          position: absolute;
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: white;
          box-shadow: 0 8px 25px #33406a18;
          font-size: 25px;
        }

        .item-one { top: 0; right: -3px; }
        .item-two { bottom: 4px; left: 0; }
        .item-three { bottom: 0; right: 10px; }

        .notice {
          width: 88%;
          max-width: 1240px;
          margin: 20px auto 0;
          padding: 13px 16px;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          border: 1px solid #f1dba0;
          border-radius: 12px;
          background: #fff9e9;
          color: #775817;
          font-size: 13px;
          line-height: 1.5;
        }

        .notice p { margin: 0; }

        .catalog {
          width: 88%;
          max-width: 1240px;
          margin: 48px auto 65px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
          margin-bottom: 22px;
        }

        .section-heading h2 {
          margin: 9px 0;
          font-size: clamp(25px, 3vw, 32px);
          letter-spacing: -.6px;
        }

        .section-heading p {
          margin: 0;
          color: #778096;
          font-size: 14px;
        }

        .product-count {
          color: #788197;
          font-size: 13px;
          white-space: nowrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 15px;
          height: 50px;
          background: white;
          border: 1px solid #e1e5ef;
          border-radius: 12px;
          color: #7c8599;
        }

        .search-box input {
          flex: 1;
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          color: #172033;
        }

        .clear-search, .close-button {
          border: 0;
          background: transparent;
          color: #69738a;
        }

        .categories {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin: 18px 0 25px;
        }

        .category {
          padding: 10px 16px;
          border: 1px solid #e1e5ef;
          border-radius: 30px;
          background: white;
          color: #626d85;
          font-size: 13px;
        }

        .category.active {
          background: #4256c7;
          border-color: #4256c7;
          color: white;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .product-card {
          overflow: hidden;
          background: white;
          border: 1px solid #e9ebf2;
          border-radius: 17px;
          transition: transform .2s, box-shadow .2s;
        }

        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px #25315b0c;
        }

        .product-art {
          height: 175px;
          position: relative;
          display: grid;
          place-items: center;
          background: #edf0ff;
        }

        .product-art > span:first-child { font-size: 68px; }
        .art-2 { background: #e9f5ff; }
        .art-3 { background: #e6f7ee; }
        .art-4 { background: #fff0e4; }
        .art-5 { background: #f1eaff; }
        .art-6 { background: #fff0f2; }

        .product-category {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 9px;
          background: #ffffffde;
          border-radius: 20px;
          color: #515b74;
          font-size: 11px;
        }

        .product-info { padding: 17px; }

        .product-info h3 {
          margin: 0 0 8px;
          font-size: 16px;
        }

        .product-info p {
          min-height: 40px;
          margin: 0;
          color: #7b8497;
          font-size: 13px;
          line-height: 1.5;
        }

        .product-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
        }

        .product-bottom strong { font-size: 17px; }

        .add-button {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 11px;
          background: #4256c7;
          color: white;
        }

        .empty, .empty-cart {
          padding: 45px 20px;
          text-align: center;
          color: #788197;
        }

        .empty > span { font-size: 38px; }
        .empty h3, .empty-cart h3 { color: #172033; }

        .primary-button {
          padding: 12px 17px;
          border: 0;
          border-radius: 10px;
          background: #4256c7;
          color: white;
          font-weight: 700;
        }

        .footer {
          padding: 30px 6%;
          text-align: center;
          border-top: 1px solid #e9ebf2;
          background: white;
        }

        .footer p, .footer s
