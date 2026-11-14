import { supabase } from "./supabase";
import type { AutopilotState } from "./autopilot";

const STATE_KEY = "main";

async function syncOperationalTables(state: AutopilotState, userId: string): Promise<void> {
  if (state.products.length) {
    const { error } = await supabase.from("autopilot_products").upsert(
      state.products.map((product) => ({
        id: product.id,
        user_id: userId,
        name: product.name,
        market: product.market,
        sale_price: product.price,
        estimated_unit_cost: product.estimatedUnitCost ?? null,
        supplier_name: product.supplier ?? null,
        supplier_country: product.supplierCountry ?? null,
        score: product.score,
        status: product.status,
        source: "manual",
      })),
      { onConflict: "id,user_id" }
    );
    if (error) throw error;
  }

  if (state.campaigns.length) {
    const { error } = await supabase.from("ad_campaigns").upsert(
      state.campaigns.map((campaign) => ({
        id: campaign.id,
        user_id: userId,
        product_id: campaign.productId,
        market: campaign.market,
        objective: campaign.objective,
        daily_budget: campaign.dailyBudget,
        currency: "MZN",
        status: "simulation",
        is_simulation: true,
      })),
      { onConflict: "id,user_id" }
    );
    if (error) throw error;
  }

  if (state.creatives.length) {
    const { error } = await supabase.from("ad_creatives").upsert(
      state.creatives.map((creative) => ({
        user_id: userId,
        campaign_id: creative.campaignId,
        name: creative.name,
        format: creative.format,
        headline: creative.headline,
        primary_text: [creative.primaryText, creative.script].filter(Boolean).join("\n\n"),
        call_to_action: creative.callToAction,
        status: "draft",
        is_simulation: true,
        source_record_id: creative.id,
      })),
      { onConflict: "user_id,source_record_id" }
    );
    if (error) throw error;
  }

  const legacyOrderNames = Array.from(new Set(
    state.orders.filter(order => !order.customerId)
      .map(order => order.customerName.trim()).filter(Boolean)
  ));
  const customerRows = [
    ...state.customers.map(customer => ({
      user_id: userId,
      full_name: customer.name,
      source: "manual",
      source_record_id: `customer:${customer.id}`,
    })),
    ...legacyOrderNames.map(fullName => ({
      user_id: userId,
      full_name: fullName,
      source: "manual",
      source_record_id: `name:${fullName.toLocaleLowerCase()}`,
    })),
  ];
  const customerIdsById = new Map<string, string>();
  const legacyCustomerIdsByName = new Map<string, string>();

  if (customerRows.length) {
    const { data: customers, error } = await supabase
      .from("autopilot_customers")
      .upsert(customerRows, { onConflict: "user_id,source_record_id" })
      .select("id, full_name, source_record_id");
    if (error) throw error;
    for (const customer of customers ?? []) {
      if (customer.source_record_id.startsWith("customer:")) {
        customerIdsById.set(customer.source_record_id.slice("customer:".length), customer.id);
      } else if (customer.source_record_id.startsWith("name:")) {
        legacyCustomerIdsByName.set(customer.full_name.toLocaleLowerCase(), customer.id);
      }
    }
  }

  if (state.orders.length) {
    const { error } = await supabase.from("autopilot_orders").upsert(
      state.orders.map((order) => ({
        id: order.id,
        user_id: userId,
        product_id: order.productId,
        customer_id: order.customerId
          ? customerIdsById.get(order.customerId) ?? null
          : legacyCustomerIdsByName.get(order.customerName.trim().toLocaleLowerCase()) ?? null,
        customer_name: order.customerName,
        market: order.market,
        amount: order.amount,
        currency: "MZN",
        status: order.status,
        estimated_delivery_at: order.estimatedDeliveryAt ?? null,
        revised_delivery_at: order.revisedDeliveryAt ?? null,
        delay_notice: order.delayNotice ?? null,
        is_simulation: true,
      })),
      { onConflict: "id,user_id" }
    );
    if (error) throw error;

    const productById = new Map(state.products.map((product) => [product.id, product]));
    const { error: itemError } = await supabase.from("autopilot_order_items").upsert(
      state.orders.map((order) => ({
        user_id: userId,
        order_id: order.id,
        product_id: order.productId,
        product_name: productById.get(order.productId)?.name ?? "Produto",
        quantity: 1,
        unit_price: order.amount,
        line_total: order.amount,
        source_record_id: order.id,
      })),
      { onConflict: "user_id,source_record_id" }
    );
    if (itemError) throw itemError;
  }

  if (state.finance.length) {
    const { error } = await supabase.from("finance_transactions").upsert(
      state.finance.map((record) => ({
        user_id: userId,
        transaction_type: record.type,
        amount: record.amount,
        currency: record.currency || "MZN",
        description: record.description,
        is_simulation: true,
        source_record_id: record.id,
      })),
      { onConflict: "user_id,source_record_id" }
    );
    if (error) throw error;
  }
}

export async function loadAutopilotState(): Promise<AutopilotState | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("É necessário iniciar sessão para carregar os dados.");
    return null;
  }

  const { data, error } = await supabase
    .from("autopilot_state")
    .select("state_value")
    .eq("user_id", user.id)
    .eq("state_key", STATE_KEY)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar estado:", error.message);
    return null;
  }

  return (data?.state_value as AutopilotState | null) ?? null;
}

export async function saveAutopilotState(state: AutopilotState): Promise<boolean> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("É necessário iniciar sessão para guardar os dados.");
    return false;
  }

  const { error } = await supabase
    .from("autopilot_state")
    .upsert(
      {
        user_id: user.id,
        state_key: STATE_KEY,
        state_value: state,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,state_key" }
    );

  if (error) {
    console.error("Erro ao guardar estado:", error.message);
    return false;
  }

  try {
    await syncOperationalTables(state, user.id);
  } catch (syncError) {
    console.error("Estado geral guardado, mas houve erro ao sincronizar tabelas operacionais:", syncError);
    return false;
  }

  return true;
}
