"use client";

import { useState } from "react";

type OrderStatus =
  | "Novo"
  | "Pagamento pendente"
  | "Pago"
  | "Enviado ao fornecedor"
  | "Em trânsito"
  | "Entregue";

type Order = {
  id: string;
  product: string;
  customer: string;
  country: string;
  amount: number;
  supplier: string;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  {
    id: "ORD-1001",
    product: "Mini aspirador portátil",
    customer: "Cliente exemplo",
    country: "Moçambique 🇲🇿",
    amount: 2500,
    supplier: "Fornecedor internacional",
    status: "Pago",
  },
  {
    id: "ORD-1002",
    product: "Luz LED com sensor",
    customer: "Cliente exemplo",
    country: "Brasil 🇧🇷",
    amount: 1800,
    supplier: "Fornecedor internacional",
    status: "Em trânsito",
  },
];

const statuses: OrderStatus[] = [
  "Novo",
  "Pagamento pendente",
  "Pago",
  "Enviado ao fornecedor",
  "Em trânsito",
  "Entregue",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const [product, setProduct] = useState("");
  const [customer, setCustomer] = useState("");
  const [country, setCountry] = useState("Moçambique 🇲🇿");
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");

  function createOrder() {
    if (!product.trim() || !customer.trim() || !amount.trim()) return;

    const newOrder: Order = {
      id: `ORD-${1000 + orders.length + 1}`,
      product,
      customer,
      country,
      amount: Number(amount),
      supplier: supplier || "A definir",
      status: "Novo",
    };

    setOrders((current) => [newOrder, ...current]);

    setProduct("");
    setCustomer("");
    setAmount("");
    setSupplier("");
  }

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#dbeafe",
              color: "#1d4ed8",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📦 ORDERS AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Gestão de encomendas
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Organiza pedidos desde o cliente até ao fornecedor e entrega.
          </p>
        </div>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>➕ Nova encomenda</h2>

          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Produto"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Nome do cliente"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            <option>Moçambique 🇲🇿</option>
            <option>Brasil 🇧🇷</option>
            <option>Portugal 🇵🇹</option>
            <option>África do Sul 🇿🇦</option>
            <option>Europa 🇪🇺</option>
            <option>EUA 🇺🇸</option>
            <option>Outro 🌎</option>
          </select>

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor da encomenda (MT)"
            type="number"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginBottom: 12,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <input
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Fornecedor (opcional)"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginBottom: 15,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <button
            onClick={createOrder}
            style={{
              width: "100%",
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#2563eb",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            📦 Criar encomenda
          </button>
        </section>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>📋 Encomendas</h2>

          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 14,
                padding: 17,
                marginBottom: 14,
              }}
            >
              <h3 style={{ marginTop: 0 }}>
                {order.id} — {order.product}
              </h3>

              <p>
                👤 <strong>Cliente:</strong> {order.customer}
              </p>

              <p>
                🌍 <strong>Destino:</strong> {order.country}
              </p>

              <p>
                💰 <strong>Valor:</strong>{" "}
                {order.amount.toLocaleString()} MT
              </p>

              <p>
                🏭 <strong>Fornecedor:</strong> {order.supplier}
              </p>

              <label>
                <strong>Estado:</strong>
              </label>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(
                    order.id,
                    e.target.value as OrderStatus
                  )
                }
                style={{
                  display: "block",
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                  borderRadius: 9,
                  border: "1px solid #dbe3ee",
                  background: "white",
                }}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          ))}
        </section>

        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 10,
            background: "#fff7ed",
            color: "#9a3412",
          }}
        >
          ⚠️ <strong>Modo simulação:</strong> esta versão não envia pedidos,
          não movimenta dinheiro e não contacta fornecedores reais.
        </div>
      </div>
    </main>
  );
      }
