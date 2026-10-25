
import { supabase } from "./supabase";
import type { AutopilotState } from "./autopilot";

const STATE_KEY = "main";

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

  return true;
}
