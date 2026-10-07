import { supabase } from "./supabase";
import type { AutopilotState } from "./autopilot";

const STATE_ID = 1;

export async function loadAutopilotState(): Promise<AutopilotState | null> {
  const { data, error } = await supabase
    .from("autopilot_state")
    .select("data")
    .eq("id", STATE_ID)
    .maybeSingle();

  if (error) {
    console.error("Erro ao carregar estado:", error.message);
    return null;
  }

  if (!data?.data) {
    return null;
  }

  return data.data as AutopilotState;
}

export async function saveAutopilotState(
  state: AutopilotState
): Promise<boolean> {
  const { error } = await supabase
    .from("autopilot_state")
    .upsert(
      {
        id: STATE_ID,
        data: state,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    console.error("Erro ao guardar estado:", error.message);
    return false;
  }

  return true;
}
