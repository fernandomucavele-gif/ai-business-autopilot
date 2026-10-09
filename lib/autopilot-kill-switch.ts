aexport type KillSwitchStatus = {
  stopped: boolean;
  reason: string;
  stoppedAt: string | null;
};

let status: KillSwitchStatus = {
  stopped: false,
  reason: "",
  stoppedAt: null,
};

export function activateKillSwitch(
  reason = "Paragem de emergência."
): KillSwitchStatus {
  status = {
    stopped: true,
    reason,
    stoppedAt: new Date().toISOString(),
  };

  return { ...status };
}

export function resetKillSwitch(): KillSwitchStatus {
  status = {
    stopped: false,
    reason: "",
    stoppedAt: null,
  };

  return { ...status };
}

export function getKillSwitchStatus(): KillSwitchStatus {
  return { ...status };
}

export function canRunAutomation(): boolean {
  return !status.stopped;
}utopilot-kill-switch.ts
