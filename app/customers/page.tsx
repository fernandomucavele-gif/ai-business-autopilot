"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

type Message = {
  from: "cliente" | "ia";
  text: string;
};

export default function CustomersPage() {
  const { state, addOrder } = useAutopilot();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ia",
      text: "Olá! 👋 Sou o assistente da loja. Como posso ajudar?",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState(
    state.products[0]?.id || ""
  );

  function sendMessage() {
    if (!message.trim()) return;

    const customerMessage = message.trim();

    let aiResponse =
      "Obrigado pela mensagem! 🤖 Esta resposta está em modo de simulação.";

    const lowerMessage = customerMessage.toLowerCase();

    if (
      lowerMessage.includes("preço") ||
      lowerMessage.includes("preco")
    ) {
      aiResponse =
        "Claro! 🤖 Posso consultar os produtos disponíveis no Autopilot e informar o preço em modo de simulação.";
    } else if (
      lowerMessage.includes("entrega") ||
      lowerMessage.includes("envio")
    ) {
      aiResponse =
        "🚚 A informação de entrega está em modo de simulação. Na versão real, o Customer AI poderá consultar o estado da encomenda.";
    } else if (
      lowerMessage.includes("pedido") ||
      lowerMessage.includes("encomenda")
    ) {
      aiResponse =
        "📦 Posso consultar pedidos registados no Autopilot. Atualmente existem " +
        state.orders.length +
        " pedido(s) em modo de simulação.";
    } else if (
      lowerMessage.includes("produto") ||
      lowerMessage.includes("produtos")
    ) {
      aiResponse =
        "🛍️ Atualmente existem " +
        state.products.length +
        " produto(s) registado(s) no Autopilot.";
    }

    setMessages((current) => [
      ...current,
      { from: "cliente", text: customerMessage },
      {
        from: "ia",
        text: aiResponse,
      },
    ]);

    setMessage("");
  }

  function createSimulatedOrder() {
    if (!selectedProduct) return;

    const product = state.products.find(
      (item) => item.id === selectedProduct
    );

    if (!product) return;

    addOrder(
      product.id,
      "Cliente Simulado",
      product.market,
      product.price
    );

    setMessages((current) => [
      ...current,
      {
        from: "ia",
        text:
          `📦 Pedido simulado criado para "${product.name}". ` +
          `Valor: ${product.price} MT. ` +
          `Nenhum pagamento real foi realizado.`,
      },
    ]);
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
      <div style={{ maxWidth: 900, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#fef3c7",
              color: "#92400e",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            👥 CUSTOMER AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Assistente de clientes
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Atendimento, produtos, pedidos, entrega e suporte ao cliente.
          </p>
        </div>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            marginBottom: 20,
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🤖 Produtos disponíveis no Autopilot
          </h2>

          {state.products.length === 0 ? (
            <div
              style={{
                padding: 15,
                borderRadius: 12,
                background: "#f8fafc",
                color: "#64748b",
              }}
            >
              Ainda não existem produtos no Autopilot.
              <br />
              Adiciona primeiro um produto através do Research AI.
            </div>
          ) : (
            <>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 10,
                  border: "1px solid #dbe3ee",
                  fontSize: 16,
                  marginBottom: 12,
                  background: "white",
                }}
              >
                {state.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.price} MT — {product.market}
                  </option>
                ))}
              </select>

              <button
                onClick={createSimulatedOrder}
                style={{
                  width: "100%",
                  padding: 14,
                  border: 0,
                  borderRadius: 10,
                  background: "#16a34a",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                📦 Criar pedido simulado
              </button>
            </>
          )}
        </section>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>💬 Atendimento</h2>

          <div
            style={{
              height: 430,
              overflowY: "auto",
              padding: 10,
              background: "#f8fafc",
              borderRadius: 12,
            }}
          >
            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    item.from === "cliente"
                      ? "flex-end"
                      : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 15px",
                    borderRadius: 14,
                    background:
                      item.from === "cliente"
                        ? "#2563eb"
                        : "#e5e7eb",
                    color:
                      item.from === "cliente"
                        ? "white"
                        : "#111827",
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 15,
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Escreve a mensagem do cliente..."
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                border: "1px solid #dbe3ee",
                fontSize: 16,
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "12px 18px",
                border: 0,
                borderRadius: 10,
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Enviar
            </button>
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 10,
              background: "#fff7ed",
              color: "#9a3412",
            }}
          >
            ⚠️ <strong>Modo simulação:</strong> o Customer AI ainda não
            está ligado a clientes reais, pagamentos ou fornecedores.
            Nenhuma transação real será realizada.
          </div>
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
            <strong>🛍️ Produtos</strong>
            <div style={{ fontSize: 24, marginTop: 6 }}>
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
            <strong>📦 Pedidos</strong>
            <div style={{ fontSize: 24, marginTop: 6 }}>
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
            <strong>💰 Receita</strong>
            <div style={{ fontSize: 24, marginTop: 6 }}>
              {state.finance
                .filter((item) => item.type === "revenue")
                .reduce(
                  (total, item) => total + item.amount,
                  0
                )}{" "}
              MT
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}