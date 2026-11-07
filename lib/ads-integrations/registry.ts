import {
  AD_PLATFORM_SETUP,
  READ_ONLY_CAPABILITIES,
  type AdPlatform,
  type ReadOnlyAdPlatformAdapter,
} from "./contract";

export class AdPlatformNotConfiguredError extends Error {
  constructor(provider: AdPlatform) {
    super(
      `${AD_PLATFORM_SETUP[provider].label} ainda não tem OAuth configurado. Nenhuma chamada externa foi executada.`,
    );
    this.name = "AdPlatformNotConfiguredError";
  }
}

/**
 * Safe placeholder registry.
 * Real provider clients are intentionally not instantiated until OAuth credentials,
 * callback validation, encrypted token storage, and provider review are configured.
 */
export function getReadOnlyAdPlatformAdapter(
  provider: AdPlatform,
): ReadOnlyAdPlatformAdapter {
  return {
    provider,
    capabilities: READ_ONLY_CAPABILITIES,
    async listAccounts() {
      throw new AdPlatformNotConfiguredError(provider);
    },
    async listCampaigns() {
      throw new AdPlatformNotConfiguredError(provider);
    },
    async getDailyInsights() {
      throw new AdPlatformNotConfiguredError(provider);
    },
  };
}
