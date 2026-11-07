
import { supabase } from "./supabase";
import type { AutopilotState } from "./autopilot";

const STATE_KEY = "main";

/**
 * Mirrors core records into normalized tables while keeping the JSON state
 * for backwards compatibility during the module migration.
 */
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

  if (state.orders.length) {
    const { error } = await supabase.from("autopilot_orders").upsert(
      state.orders.map((order) => ({
        id: order.id,
        user_id: userId,
        product_id: order.productId,
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

export async function saveAutopilotState(
  state: AutopilotState
): Promise<boolean> {
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
      {
        onConflict: "user_id,state_key",
      }
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
