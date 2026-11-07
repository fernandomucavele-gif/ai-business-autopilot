export type AdPlatform = "google_ads" | "meta_ads";

export type AdPlatformConnectionStatus =
  | "disconnected"
  | "pending"
  | "connected"
  | "error"
  | "revoked";

export type AdPlatformConnection = {
  id: string;
  provider: AdPlatform;
  external_account_id: string | null;
  account_name: string | null;
  connection_status: AdPlatformConnectionStatus;
  access_mode: "read_only";
  granted_scopes: string[];
  connected_at: string | null;
  last_synced_at: string | null;
  last_error: string | null;
};

export type ExternalAdAccount = {
  id: string;
  name: string;
  currency?: string;
  timezone?: string;
};

export type ExternalCampaign = {
  id: string;
  name: string;
  status?: string;
  objective?: string;
};

export type ExternalDailyInsight = {
  accountId: string;
  campaignId: string;
  campaignName: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  attributedRevenue: number;
  currency: string;
  source: AdPlatform;
  dataMode: "read_only_import" | "simulation";
};

export type ReadOnlyAdPlatformAdapter = {
  provider: AdPlatform;
  capabilities: {
    readAccounts: true;
    readCampaigns: true;
    readInsights: true;
    createCampaigns: false;
    updateCampaigns: false;
    createAds: false;
    updateAds: false;
    publishAds: false;
    changeBudgets: false;
  };
  listAccounts(): Promise<ExternalAdAccount[]>;
  listCampaigns(accountId: string): Promise<ExternalCampaign[]>;
  getDailyInsights(
    accountId: string,
    from: string,
    to: string,
  ): Promise<ExternalDailyInsight[]>;
};

// Hard limits shared by both providers. A provider adapter cannot enable write actions.
export const READ_ONLY_CAPABILITIES: ReadOnlyAdPlatformAdapter["capabilities"] = {
  readAccounts: true,
  readCampaigns: true,
  readInsights: true,
  createCampaigns: false,
  updateCampaigns: false,
  createAds: false,
  updateAds: false,
  publishAds: false,
  changeBudgets: false,
};

export const AD_PLATFORM_SETUP = {
  google_ads: {
    label: "Google Ads",
    auth: "OAuth 2.0",
    requestedScopes: ["https://www.googleapis.com/auth/adwords"],
    phase: "architecture_ready" as const,
  },
  meta_ads: {
    label: "Meta Ads",
    auth: "Meta OAuth",
    requestedScopes: ["ads_read"],
    phase: "architecture_ready" as const,
  },
} as const;
