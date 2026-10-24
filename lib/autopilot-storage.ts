
import { supabase } from "./supabase";
import type { AutopilotState } from "./autopilot";

const STATE_KEY = "main";

export async function loadAutopilotState(): Promise<AutopilotState | null> {
  const { data, error } = await supabase
    .from("autopilot_state")
    .select("state_value")
    .eq("state_key", STATE_KEY)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar estado:", error.message);
    return null;
  }

  if (!data?.state_value) {
    return null;
  }

  return data.state_value as AutopilotState;
}

export async function saveAutopilotState(
  state: AutopilotState
): Promise<boolean> {
  const { error } = await supabase
    .from("autopilot_state")
    .upsert(
      {
        state_key: STATE_KEY,
        state_value: state,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "state_key",
      }
    );

  if (error) {
    console.error("Erro ao guardar estado:", error.message);
    return false;
  }

  return true;
}
