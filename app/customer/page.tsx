"use client";

import { useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import { Search, Users, ShoppingBag, CircleHelp } from "lucide-react";

export default function CustomerPage() {
  const { state } = useAutopilot();
  const [search, setSearch] = useState("");

  const customers = useMemo(() => {
    const grouped = new Map<string, {
      name: string;
      orders: typeof state.orders;
      total: number;
      markets: Set<string>;
    }>();

    for (const order of state.orders) {
      const key = order.customerName.trim().toLocaleLowerCase();
      if (!key) continue;
      const existing = grouped.get(key);
      if (existing) {
        existing.orders.push(order);
        existing.total += order.amount;
        existing.markets.add(order.market);
      } else {
        grouped.set(key, {
          name: order.customerName.trim(),
          orders: [order],
          total: order.amount,
          markets: new Set([order.market]),
        });
      }
    }

    return Array.from(grouped.values())
      .filter((customer) =>
        customer.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name, "pt"));
  }, [state.orders, search]);

  const totalOrders = customers.reduce((sum, customer) => sum + customer.orders.length, 0);
  const totalValue = customers.reduce((sum, customer) => sum + customer.total, 0);

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e5eaf2",
    borderRadius: 16,
    padding: 18,
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, color: "#17233c" }}>
      <header>
        <p style={{ color: "#64748b", marginBottom: 6 }}>AI BUSINESS AUTOPILOT / CLIENTES</p>
        <h1 style={{ fontSize: 30, margin: 0 }}>Customer AI</h1>
        <p style={{ color: "#64748b" }}>Clientes identificados a partir das encomendas registadas no Autopilot.</p>
        <p style={{ background: "#fff7e6", color: "#8a5300", border: "1px solid #f5d79b", borderRadius: 10, padding: 12, lineHeight: 1.5 }}>
          Os dados apresentados vêm dos registos de encomendas. Esta página não cria clientes fictícios, não inventa contactos e não envia mensagens. O modo de simulação continua ativo para operações comerciais.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, margin: "22px 0" }}>
        <section style={card}>
          <Users color="#4768d8" />
          <p style={{ color: "#64748b", marginBottom: 6 }}>Clientes nas encomendas</p>
          <strong style={{ fontSize: 28 }}>{customers.length}</strong>
        </section>
        <section style={card}>
          <ShoppingBag color="#4768d8" />
          <p style={{ color: "#64748b", marginBottom: 6 }}>Encomendas encontradas</p>
          <strong style={{ fontSize: 28 }}>{totalOrders}</strong>
        </section>
        <section style={card}>
          <CircleHelp color="#4768d8" />
          <p style={{ color: "#64748b", marginBottom: 6 }}>Valor registado</p>
          <strong style={{ fontSize: 25 }}>{totalValue.toLocaleString("pt-MZ")} MT</strong>
        </section>
      </div>

      <section style={card}>
        <h2 style={{ margin: "0 0 14px", fontSize: 20 }}>Lista de clientes</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #dbe2ed", borderRadius: 10, padding: "10px 12px", marginBottom: 18 }}>
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar pelo nome do cliente..."
            aria-label="Pesquisar clientes"
            style={{ width: "100%", border: 0, outline: "none", fontSize: 15 }}
          />
        </div>

        {customers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 28, color: "#64748b" }}>
            <Users size={34} />
            <p>{state.orders.length === 0 ? "Ainda não existem encomendas registadas; por isso, não há clientes para listar." : "Nenhum cliente corresponde à pesquisa."}</p>
            <p style={{ fontSize: 13 }}>Quando registares encomendas com nomes de clientes, estes aparecerão aqui automaticamente.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {customers.map((customer) => (
              <article key={customer.name.toLocaleLowerCase()} style={{ border: "1px solid #e5eaf2", borderRadius: 12, padding: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <strong>{customer.name}</strong>
                  <span style={{ color: "#2447c6", background: "#edf2ff", borderRadius: 20, padding: "5px 10px", fontSize: 13 }}>
                    {customer.orders.length} encomenda(s)
                  </span>
                </div>
                <p style={{ color: "#64748b", margin: "9px 0 4px" }}>
                  Valor total registado: {customer.total.toLocaleString("pt-MZ")} MT
                </p>
                <p style={{ color: "#64748b", margin: 0, fontSize: 13 }}>
                  Mercado(s): {Array.from(customer.markets).join(", ")}
                </p>
                <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
                  {customer.orders.map((order) => (
                    <div key={order.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", background: "#f8fafc", borderRadius: 8, padding: 9, fontSize: 13 }}>
                      <span>{order.id} · {order.status}</span>
                      <strong>{order.amount.toLocaleString("pt-MZ")} MT</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <p style={{ color: "#64748b", fontSize: 13, marginTop: 16 }}>
        Nota: o Customer AI mostra apenas nomes e valores que já constam nas encomendas. Email, telefone e histórico externo ainda não estão integrados.
      </p>
    </main>
  );
}
