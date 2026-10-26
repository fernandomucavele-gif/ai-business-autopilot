"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Market, Order } from "../../lib/autopilot";

type OrderStatus =
  | "Novo"
  | "Pagamento pendente"
  | "Pago"
  | "Enviado ao fornecedor"
  | "Em trânsito"
  | "Entregue";

const statuses: OrderStatus[] = [
  "Novo",
  "Pagamento pendente",
  "Pago",
  "Enviado ao fornecedor",
  "Em trânsito",
  "Entregue",
];

export default function OrdersPage() {
  const { state, addOrder, updateOrder } = useAutopilot();

  const [productId, setProductId] = useState(
    state.products[0]?.id || ""
  );
  const [customer, setCustomer] = useState("");
  const [country, setCountry] = useState("Moçambique");
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");
  const [message, setMessage] = useState("");

  function createOrder() {
    const numericAmount = Number(amount);
    if (!productId || !customer.trim() || !amount.trim()) {
      setMessage("⚠️ Preenche o produto, cliente e valor.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("⚠️ Introduz um valor válido maior que zero.");
      return;
    }

    const product = state.products.find(
      (item) => item.id === productId
    );

    if (!product) {
      setMessage("⚠️ Produto não encontrado no Autopilot.");
      return;
    }

    addOrder(
      product.id,
      customer.trim(),
      country as
        | "Moçambique"
        | "Brasil"
        | "Portugal"
        | "África do Sul"
        | "Europa"
        | "EUA"
        | "Global",
      numericAmount
    );

    setMessage(
      `✅ Pedido simulado criado para ${customer.trim()}. Nenhum pagamento real foi realizado.`
    );

    setCustomer("");
    setAmount("");
    setSupplier("");
  }

  function getStatusColor(status: OrderStatus) {
    if (status === "Pago") return "#dcfce7";
    if (status === "Entregue") return "#dbeafe";
    if (status === "Em trânsito") return "#fef3c7";
    if (status === "Enviado ao fornecedor") return "#ede9fe";
    if (status === "Pagamento pendente") return "#fee2e2";
    return "#f1f5f9";
  }

  function updateStatus(id: string, status: OrderStatus) {
    updateOrder(id, { status });
    setMessage(`✅ ${id}: estado atualizado para "${status}" (simulação).`);
  }

  function formatDate(value?: string) {
    if (!value) return "Não definida";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function getDeliveryText(order: Order) {
    if (order.status === "Entregue") return "Encomenda marcada como entregue (simulação).";
    if (!order.estimatedDeliveryAt) return "Data estimada não definida.";
    const remaining = new Date(order.estimatedDeliveryAt).getTime() - Date.now();
    if (remaining < 0) return "Prazo estimado ultrapassado. Confirma o estado manualmente.";
    const days = Math.ceil(remaining / (1000 * 60 * 60 * 24));
    return `Entrega estimada: ${formatDate(order.estimatedDeliveryAt)} (aprox. ${days} dia(s)).`;
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

          <h1
            style={{
              fontSize: 34,
              margin: "14px 0 8px",
            }}
          >
            Gestão de encomendas
          </h1>

          <p
            style={{
              color: "#64748b",
              fontSize: 17,
            }}
          >
            Organiza pedidos desde o cliente até ao
            fornecedor e entrega.
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
          <h2 style={{ marginTop: 0 }}>
            ➕ Nova encomenda
          </h2>

          {state.products.length === 0 ? (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#fff7ed",
                color: "#9a3412",
              }}
            >
              ⚠️ Ainda não existem produtos no
              Autopilot.
              <br />
              Primeiro adiciona um produto no
              <strong> Research AI</strong>.
            </div>
          ) : (
            <>
              <label>
                <strong>Produto</strong>
              </label>

              <select
                value={productId}
                onChange={(e) =>
                  setProductId(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: 14,
                  marginTop: 8,
                  marginBottom: 12,
                  borderRadius: 10,
                  border: "1px solid #dbe3ee",
                  background: "white",
                  fontSize: 16,
                }}
              >
                {state.products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name} — {product.price} MT
                  </option>
                ))}
              </select>

              <input
                value={customer}
                onChange={(e) =>
                  setCustomer(e.target.value)
                }
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
                onChange={(e) =>
                  setCountry(e.target.value)
                }
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
                <option value="Moçambique">
                  Moçambique 🇲🇿
                </option>
                <option value="Brasil">
                  Brasil 🇧🇷
                </option>
                <option value="Portugal">
                  Portugal 🇵🇹
                </option>
                <option value="África do Sul">
                  África do Sul 🇿🇦
                </option>
                <option value="Europa">
                  Europa 🇪🇺
                </option>
                <option value="EUA">
                  EUA 🇺🇸
                </option>
                <option value="Global">
                  Outro 🌎
                </option>
              </select>

              <input
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
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
                onChange={(e) =>
                  setSupplier(e.target.value)
                }
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
                  cursor: "pointer",
                }}
              >
                📦 Criar encomenda simulada
              </button>

              {message && (
                <div
                  style={{
                    marginTop: 15,
                    padding: 13,
                    borderRadius: 10,
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: 600,
                  }}
                >
                  {message}
                </div>
              )}
            </>
          )}
        </section>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📋 Encomendas no Autopilot
          </h2>

          {state.orders.length === 0 ? (
            <div
              style={{
                padding: 18,
                background: "#f8fafc",
                borderRadius: 12,
                color: "#64748b",
              }}
            >
              Ainda não existem encomendas registadas.
            </div>
          ) : (
            state.orders.map((order) => {
              const product = state.products.find(
                (item) => item.id === order.productId
              );

              return (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 17,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <h3 style={{ marginTop: 0 }}>
                      {order.id}
                    </h3>

                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: 20,
                        background: getStatusColor(
                          order.status
                        ),
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p>
                    🛍️ <strong>Produto:</strong>{" "}
                    {product?.name || order.productId}
                  </p>

                  <p>
                    👤 <strong>Cliente:</strong>{" "}
                    {order.customerName}
                  </p>

                  <p>
                    🌍 <strong>Destino:</strong>{" "}
                    {order.market}
                  </p>

                  <p>
                    💰 <strong>Valor:</strong>{" "}
                    {order.amount.toLocaleString("pt-PT")} MT
                  </p>

                  <p>
                    🗓️ <strong>Prazo:</strong>{" "}
                    {getDeliveryText(order)}
                  </p>

                  {order.delayNotice && (
                    <p style={{ padding: 12, borderRadius: 9, background: "#fff7ed", color: "#9a3412" }}>
                      ⚠️ <strong>Aviso de atraso:</strong> {order.delayNotice}
                    </p>
                  )}

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
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })
          )}
        </section>

        <section
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>📦 Pedidos</strong>
            <div
              style={{
                fontSize: 24,
                marginTop: 6,
              }}
            >
              {state.orders.length}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>🛍️ Produtos</strong>
            <div
              style={{
                fontSize: 24,
                marginTop: 6,
              }}
            >
              {state.products.length}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>🔒 Simulação</strong>
            <div
              style={{
                fontSize: 16,
                marginTop: 8,
                color: "#16a34a",
                fontWeight: 700,
              }}
            >
              Ativa
            </div>
          </div>
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
          ⚠️ <strong>Modo simulação:</strong> esta
          versão não envia pedidos, não movimenta
          dinheiro e não contacta fornecedores reais.
        </div>
      </div>
    </main>
  );
}