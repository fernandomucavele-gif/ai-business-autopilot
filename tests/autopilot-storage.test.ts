import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  initialAutopilotState,
  type AutopilotState,
} from "../lib/autopilot";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
  calls: [] as Array<{ table: string; rows: any; options: any }>,
  errors: {} as Record<string, { message: string } | null>,
  savedState: null as AutopilotState | null,
  customerRows: [] as Array<{ id: string; full_name: string; source_record_id: string }>,
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  },
}));

import { loadAutopilotState, saveAutopilotState } from "../lib/autopilot-storage";

function configureAuthenticatedUser() {
  mocks.getUser.mockResolvedValue({
    data: { user: { id: "user-test-123" } },
    error: null,
  });
}

function configureQueryBuilder(table: string) {
  let hasUpserted = false;
  const builder: any = {
    upsert: vi.fn((rows: any, options: any) => {
      hasUpserted = true;
      mocks.calls.push({ table, rows, options });
      if (table === "autopilot_customers") {
        mocks.customerRows = rows.map((row: any, index: number) => ({
          id: `db-customer-${index + 1}`,
          full_name: row.full_name,
          source_record_id: row.source_record_id,
        }));
      }
      return builder;
    }),
    select: vi.fn(() => {
      if (table === "autopilot_customers" && hasUpserted) {
        return Promise.resolve({ data: mocks.customerRows, error: mocks.errors[table] ?? null });
      }
      return builder;
    }),
    eq: vi.fn(() => builder),
    maybeSingle: vi.fn(() => Promise.resolve({
      data: mocks.savedState ? { state_value: mocks.savedState } : null,
      error: mocks.errors[table] ?? null,
    })),
    then: (resolve: (value: any) => any, reject: (reason: any) => any) =>
      Promise.resolve({ data: null, error: mocks.errors[table] ?? null }).then(resolve, reject),
  };
  return builder;
}

function sampleState(): AutopilotState {
  return {
    ...initialAutopilotState,
    customers: [{
      id: "CUST-1",
      name: "Cliente fictício",
      phone: "000000000",
      email: "cliente@example.test",
      market: "Moçambique",
      notes: "Conta de teste",
      createdAt: "2026-01-01T00:00:00.000Z",
    }],
    products: [{
      id: "PROD-1",
      name: "Produto fictício",
      market: "Moçambique",
      price: 500,
      estimatedUnitCost: 200,
      score: 0,
      status: "research",
    }],
    campaigns: [{
      id: "CAMP-1",
      productId: "PROD-1",
      market: "Moçambique",
      objective: "Vendas",
      dailyBudget: 100,
      status: "simulation",
    }],
    orders: [{
      id: "ORD-1",
      productId: "PROD-1",
      customerName: "Cliente fictício",
      customerId: "CUST-1",
      market: "Moçambique",
      amount: 500,
      status: "Novo",
    }],
    finance: [{
      id: "FIN-1",
      type: "revenue",
      amount: 500,
      currency: "MZN",
      description: "Receita fictícia",
    }],
  };
}

describe("persistência simulada do Autopilot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.calls = [];
    mocks.errors = {};
    mocks.savedState = null;
    mocks.customerRows = [];
    mocks.from.mockImplementation((table: string) => configureQueryBuilder(table));
  });

  it("não tenta guardar dados quando não existe sessão", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Sessão ausente" },
    });

    await expect(saveAutopilotState(sampleState())).resolves.toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("cancela leitura e gravação se a sessão pertence a outro utilizador", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-different" } },
      error: null,
    });

    await expect(loadAutopilotState("user-expected")).resolves.toBeNull();
    await expect(saveAutopilotState(sampleState(), "user-expected")).resolves.toBe(false);
    expect(mocks.from).not.toHaveBeenCalled();
  });

  it("carrega o estado apenas para o utilizador autenticado e para a chave main", async () => {
    configureAuthenticatedUser();
    const saved = sampleState();
    mocks.savedState = saved;

    await expect(loadAutopilotState()).resolves.toEqual(saved);
    expect(mocks.from).toHaveBeenCalledWith("autopilot_state");
  });

  it("guarda o estado e sincroniza tabelas operacionais em modo de simulação", async () => {
    configureAuthenticatedUser();
    const state = sampleState();

    await expect(saveAutopilotState(state)).resolves.toBe(true);

    const stateCall = mocks.calls.find((call) => call.table === "autopilot_state");
    expect(stateCall?.rows).toMatchObject({
      user_id: "user-test-123",
      state_key: "main",
      state_value: state,
    });

    const product = mocks.calls.find((call) => call.table === "autopilot_products")?.rows[0];
    expect(product).toMatchObject({
      user_id: "user-test-123",
      id: "PROD-1",
      name: "Produto fictício",
      sale_price: 500,
    });

    const campaign = mocks.calls.find((call) => call.table === "ad_campaigns")?.rows[0];
    expect(campaign).toMatchObject({
      user_id: "user-test-123",
      id: "CAMP-1",
      status: "simulation",
      is_simulation: true,
    });

    const order = mocks.calls.find((call) => call.table === "autopilot_orders")?.rows[0];
    expect(order).toMatchObject({
      user_id: "user-test-123",
      id: "ORD-1",
      customer_id: "db-customer-1",
      is_simulation: true,
    });

    const finance = mocks.calls.find((call) => call.table === "finance_transactions")?.rows[0];
    expect(finance).toMatchObject({
      user_id: "user-test-123",
      source_record_id: "FIN-1",
      is_simulation: true,
    });
  });

  it("liga encomendas ao ID correto do cliente mesmo quando os nomes são iguais", async () => {
    configureAuthenticatedUser();
    const state = sampleState();
    state.customers.push({
      id: "CUST-2",
      name: "Cliente fictício",
      phone: "111111111",
      email: "cliente2@example.test",
      market: "Moçambique",
      notes: "Segundo cliente com nome igual",
      createdAt: "2026-01-02T00:00:00.000Z",
    });
    state.orders.push({
      id: "ORD-2",
      productId: "PROD-1",
      customerName: "Cliente fictício",
      customerId: "CUST-2",
      market: "Moçambique",
      amount: 750,
      status: "Novo",
    });

    await expect(saveAutopilotState(state, "user-test-123")).resolves.toBe(true);

    const orders = mocks.calls.find((call) => call.table === "autopilot_orders")?.rows;
    expect(orders).toHaveLength(2);
    expect(orders[0].customer_id).toBe("db-customer-1");
    expect(orders[1].customer_id).toBe("db-customer-2");
    expect(orders.every((order: any) => order.user_id === "user-test-123")).toBe(true);

    const items = mocks.calls.find((call) => call.table === "autopilot_order_items")?.rows;
    expect(items).toHaveLength(2);
    expect(items.map((item: any) => item.source_record_id)).toEqual(["ORD-1", "ORD-2"]);
  });

  it("interrompe a sincronização e devolve false quando uma tabela operacional falha", async () => {
    configureAuthenticatedUser();
    mocks.errors.autopilot_products = { message: "Falha simulada" };

    await expect(saveAutopilotState(sampleState())).resolves.toBe(false);
    expect(mocks.calls.some((call) => call.table === "autopilot_state")).toBe(true);
    expect(mocks.calls.some((call) => call.table === "autopilot_products")).toBe(true);
    expect(mocks.calls.some((call) => call.table === "ad_campaigns")).toBe(false);
  });
});
