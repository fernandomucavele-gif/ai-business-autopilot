-- Schema-only reconstruction from the live PostgreSQL catalogs (2026-11-14).
-- No production rows, auth users, secrets, or tokens are included.
-- This migration is for the isolated local Supabase environment only.

-- Align the repository's original autopilot_state table with the current schema.
ALTER TABLE public.autopilot_state ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.autopilot_state DROP CONSTRAINT IF EXISTS autopilot_state_state_key_key;

CREATE TABLE public."store_orders" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "order_number" text NOT NULL DEFAULT ('ORD-'::text || upper(substr(replace((gen_random_uuid())::text, '-'::text, ''::text), 1, 12))),
  "customer_name" text NOT NULL,
  "customer_email" text,
  "customer_phone" text NOT NULL,
  "delivery_address" text NOT NULL,
  "delivery_city" text,
  "delivery_notes" text,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "subtotal" numeric NOT NULL,
  "delivery_fee" numeric NOT NULL DEFAULT 0,
  "total" numeric NOT NULL,
  "order_status" text NOT NULL DEFAULT 'pending_payment'::text,
  "payment_provider" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "estimated_delivery_at" timestamp with time zone,
  "revised_delivery_at" timestamp with time zone,
  "delay_notice" text,
  "tracking_code" text
);
ALTER TABLE public."store_orders" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."store_order_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL,
  "product_id" text,
  "product_name" text NOT NULL,
  "quantity" integer NOT NULL,
  "unit_price" numeric NOT NULL,
  "line_total" numeric NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."store_order_items" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."payment_transactions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL,
  "provider" text NOT NULL,
  "provider_reference" text,
  "amount" numeric NOT NULL,
  "currency" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "is_test" boolean NOT NULL DEFAULT true,
  "provider_response" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."payment_transactions" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_products" (
  "id" text NOT NULL,
  "user_id" uuid NOT NULL,
  "name" text NOT NULL,
  "market" text NOT NULL,
  "sale_price" numeric NOT NULL DEFAULT 0,
  "estimated_unit_cost" numeric,
  "supplier_name" text,
  "supplier_country" text,
  "score" numeric NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'research'::text,
  "source" text NOT NULL DEFAULT 'manual'::text,
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."autopilot_products" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_suppliers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "name" text NOT NULL,
  "country" text,
  "website" text,
  "email" text,
  "phone" text,
  "category" text,
  "rating" numeric,
  "verification_status" text NOT NULL DEFAULT 'unverified'::text,
  "notes" text,
  "is_demo" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."autopilot_suppliers" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_product_suppliers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "product_id" text NOT NULL,
  "supplier_id" uuid NOT NULL,
  "unit_cost" numeric,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "lead_time_days" integer,
  "minimum_order_quantity" integer,
  "is_preferred" boolean NOT NULL DEFAULT false,
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."autopilot_product_suppliers" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."product_research_runs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "query" text NOT NULL,
  "market" text,
  "source" text NOT NULL DEFAULT 'simulation'::text,
  "status" text NOT NULL DEFAULT 'completed'::text,
  "results" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."product_research_runs" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_campaigns" (
  "id" text NOT NULL,
  "user_id" uuid NOT NULL,
  "product_id" text NOT NULL,
  "market" text NOT NULL,
  "objective" text NOT NULL,
  "daily_budget" numeric NOT NULL DEFAULT 0,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "status" text NOT NULL DEFAULT 'simulation'::text,
  "platform" text,
  "external_campaign_id" text,
  "starts_at" timestamp with time zone,
  "ends_at" timestamp with time zone,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "notes" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_campaigns" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_sets" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "campaign_id" text NOT NULL,
  "name" text NOT NULL,
  "audience" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "placement" text,
  "daily_budget" numeric NOT NULL DEFAULT 0,
  "status" text NOT NULL DEFAULT 'simulation'::text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_sets" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_creatives" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "campaign_id" text NOT NULL,
  "ad_set_id" uuid,
  "name" text NOT NULL,
  "format" text NOT NULL DEFAULT 'image'::text,
  "headline" text,
  "primary_text" text,
  "call_to_action" text,
  "asset_url" text,
  "status" text NOT NULL DEFAULT 'draft'::text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "source_record_id" text
);
ALTER TABLE public."ad_creatives" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_metrics_daily" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "campaign_id" text NOT NULL,
  "ad_id" uuid,
  "metric_date" date NOT NULL,
  "impressions" bigint NOT NULL DEFAULT 0,
  "clicks" bigint NOT NULL DEFAULT 0,
  "spend" numeric NOT NULL DEFAULT 0,
  "conversions" integer NOT NULL DEFAULT 0,
  "attributed_revenue" numeric NOT NULL DEFAULT 0,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_metrics_daily" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_customers" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "full_name" text NOT NULL,
  "email" text,
  "phone" text,
  "country" text,
  "city" text,
  "notes" text,
  "source" text NOT NULL DEFAULT 'manual'::text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "source_record_id" text
);
ALTER TABLE public."autopilot_customers" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_orders" (
  "id" text NOT NULL,
  "user_id" uuid NOT NULL,
  "product_id" text NOT NULL,
  "customer_id" uuid,
  "customer_name" text NOT NULL,
  "market" text NOT NULL,
  "amount" numeric NOT NULL,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "status" text NOT NULL DEFAULT 'Novo'::text,
  "supplier_name" text,
  "estimated_delivery_at" timestamp with time zone,
  "revised_delivery_at" timestamp with time zone,
  "delay_notice" text,
  "tracking_code" text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."autopilot_orders" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_order_items" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "order_id" text NOT NULL,
  "product_id" text NOT NULL,
  "product_name" text NOT NULL,
  "quantity" integer NOT NULL DEFAULT 1,
  "unit_price" numeric NOT NULL,
  "line_total" numeric NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "source_record_id" text
);
ALTER TABLE public."autopilot_order_items" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."order_fulfillments" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "order_id" text NOT NULL,
  "supplier_id" uuid,
  "status" text NOT NULL DEFAULT 'not_started'::text,
  "tracking_code" text,
  "estimated_delivery_at" timestamp with time zone,
  "revised_delivery_at" timestamp with time zone,
  "delay_notice" text,
  "notes" text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."order_fulfillments" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."finance_transactions" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "transaction_type" text NOT NULL,
  "amount" numeric NOT NULL,
  "currency" text NOT NULL DEFAULT 'MZN'::text,
  "description" text NOT NULL,
  "order_id" text,
  "campaign_id" text,
  "transaction_date" date NOT NULL DEFAULT CURRENT_DATE,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "source_record_id" text
);
ALTER TABLE public."finance_transactions" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."autopilot_approval_queue" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "action_type" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" text,
  "summary" text NOT NULL,
  "status" text NOT NULL DEFAULT 'pending'::text,
  "decision_note" text,
  "is_simulation" boolean NOT NULL DEFAULT true,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "decided_at" timestamp with time zone
);
ALTER TABLE public."autopilot_approval_queue" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ai_activity_logs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "module" text NOT NULL,
  "event_type" text NOT NULL,
  "status" text NOT NULL DEFAULT 'info'::text,
  "message" text NOT NULL,
  "details" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ai_activity_logs" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."monitoring_events" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "service_name" text NOT NULL,
  "status" text NOT NULL,
  "message" text,
  "checked_at" timestamp with time zone NOT NULL DEFAULT now(),
  "details" jsonb NOT NULL DEFAULT '{}'::jsonb
);
ALTER TABLE public."monitoring_events" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_platform_connections" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "provider" text NOT NULL,
  "external_account_id" text,
  "account_name" text,
  "connection_status" text NOT NULL DEFAULT 'disconnected'::text,
  "access_mode" text NOT NULL DEFAULT 'read_only'::text,
  "granted_scopes" text[] NOT NULL DEFAULT '{}'::text[],
  "connected_at" timestamp with time zone,
  "last_synced_at" timestamp with time zone,
  "last_error" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_platform_connections" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_platform_metrics_daily" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "provider" text NOT NULL,
  "external_account_id" text NOT NULL,
  "external_campaign_id" text NOT NULL,
  "campaign_name" text NOT NULL,
  "metric_date" date NOT NULL,
  "impressions" bigint NOT NULL DEFAULT 0,
  "clicks" bigint NOT NULL DEFAULT 0,
  "spend" numeric NOT NULL DEFAULT 0,
  "conversions" numeric NOT NULL DEFAULT 0,
  "attributed_revenue" numeric NOT NULL DEFAULT 0,
  "currency" text NOT NULL DEFAULT 'USD'::text,
  "data_mode" text NOT NULL DEFAULT 'simulation'::text,
  "imported_at" timestamp with time zone NOT NULL DEFAULT now(),
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_platform_metrics_daily" ENABLE ROW LEVEL SECURITY;

CREATE TABLE public."ad_platform_sync_runs" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  "provider" text NOT NULL,
  "run_status" text NOT NULL DEFAULT 'queued'::text,
  "data_mode" text NOT NULL DEFAULT 'simulation'::text,
  "records_read" integer NOT NULL DEFAULT 0,
  "started_at" timestamp with time zone,
  "finished_at" timestamp with time zone,
  "error_message" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now()
);
ALTER TABLE public."ad_platform_sync_runs" ENABLE ROW LEVEL SECURITY;

-- Recreate exact primary, unique, check, and foreign-key constraints.
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_daily_budget_check" CHECK ((daily_budget >= (0)::numeric));
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_objective_check" CHECK ((objective = ANY (ARRAY['Vendas'::text, 'Leads'::text, 'Tráfego'::text, 'Reconhecimento'::text])));
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_pkey" PRIMARY KEY (id, user_id);
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_product_id_user_id_fkey" FOREIGN KEY (product_id, user_id) REFERENCES autopilot_products(id, user_id) ON DELETE RESTRICT;
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_status_check" CHECK ((status = ANY (ARRAY['simulation'::text, 'draft'::text, 'ready'::text, 'paused'::text, 'completed'::text])));
ALTER TABLE public."ad_campaigns" ADD CONSTRAINT "ad_campaigns_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_ad_set_id_user_id_fkey" FOREIGN KEY (ad_set_id, user_id) REFERENCES ad_sets(id, user_id) ON DELETE SET NULL (ad_set_id);
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_campaign_id_user_id_fkey" FOREIGN KEY (campaign_id, user_id) REFERENCES ad_campaigns(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_format_check" CHECK ((format = ANY (ARRAY['image'::text, 'video'::text, 'carousel'::text, 'text'::text])));
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_id_user_id_key" UNIQUE (id, user_id);
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'approved'::text, 'rejected'::text, 'simulation'::text])));
ALTER TABLE public."ad_creatives" ADD CONSTRAINT "ad_creatives_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_ad_id_user_id_fkey" FOREIGN KEY (ad_id, user_id) REFERENCES ad_creatives(id, user_id) ON DELETE SET NULL (ad_id);
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_attributed_revenue_check" CHECK ((attributed_revenue >= (0)::numeric));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_campaign_id_ad_id_metric_date_user_id_key" UNIQUE (campaign_id, ad_id, metric_date, user_id);
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_campaign_id_user_id_fkey" FOREIGN KEY (campaign_id, user_id) REFERENCES ad_campaigns(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_clicks_check" CHECK ((clicks >= 0));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_conversions_check" CHECK ((conversions >= 0));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_impressions_check" CHECK ((impressions >= 0));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_spend_check" CHECK ((spend >= (0)::numeric));
ALTER TABLE public."ad_metrics_daily" ADD CONSTRAINT "ad_metrics_daily_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_platform_connections" ADD CONSTRAINT "ad_platform_connections_access_mode_check" CHECK ((access_mode = 'read_only'::text));
ALTER TABLE public."ad_platform_connections" ADD CONSTRAINT "ad_platform_connections_connection_status_check" CHECK ((connection_status = ANY (ARRAY['disconnected'::text, 'pending'::text, 'connected'::text, 'error'::text, 'revoked'::text])));
ALTER TABLE public."ad_platform_connections" ADD CONSTRAINT "ad_platform_connections_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_platform_connections" ADD CONSTRAINT "ad_platform_connections_provider_check" CHECK ((provider = ANY (ARRAY['google_ads'::text, 'meta_ads'::text])));
ALTER TABLE public."ad_platform_connections" ADD CONSTRAINT "ad_platform_connections_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_attributed_revenue_check" CHECK ((attributed_revenue >= (0)::numeric));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_clicks_check" CHECK ((clicks >= 0));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_conversions_check" CHECK ((conversions >= (0)::numeric));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_data_mode_check" CHECK ((data_mode = ANY (ARRAY['simulation'::text, 'read_only_import'::text])));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_impressions_check" CHECK ((impressions >= 0));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_provider_check" CHECK ((provider = ANY (ARRAY['google_ads'::text, 'meta_ads'::text])));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_spend_check" CHECK ((spend >= (0)::numeric));
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_platform_metrics_daily" ADD CONSTRAINT "ad_platform_metrics_daily_user_id_provider_external_account_key" UNIQUE (user_id, provider, external_account_id, external_campaign_id, metric_date);
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_data_mode_check" CHECK ((data_mode = ANY (ARRAY['simulation'::text, 'read_only_import'::text])));
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_provider_check" CHECK ((provider = ANY (ARRAY['google_ads'::text, 'meta_ads'::text])));
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_records_read_check" CHECK ((records_read >= 0));
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_run_status_check" CHECK ((run_status = ANY (ARRAY['queued'::text, 'running'::text, 'succeeded'::text, 'failed'::text, 'cancelled'::text])));
ALTER TABLE public."ad_platform_sync_runs" ADD CONSTRAINT "ad_platform_sync_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_campaign_id_user_id_fkey" FOREIGN KEY (campaign_id, user_id) REFERENCES ad_campaigns(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_daily_budget_check" CHECK ((daily_budget >= (0)::numeric));
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_id_user_id_key" UNIQUE (id, user_id);
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_pkey" PRIMARY KEY (id);
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_status_check" CHECK ((status = ANY (ARRAY['simulation'::text, 'draft'::text, 'ready'::text, 'paused'::text])));
ALTER TABLE public."ad_sets" ADD CONSTRAINT "ad_sets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."ai_activity_logs" ADD CONSTRAINT "ai_activity_logs_pkey" PRIMARY KEY (id);
ALTER TABLE public."ai_activity_logs" ADD CONSTRAINT "ai_activity_logs_status_check" CHECK ((status = ANY (ARRAY['info'::text, 'success'::text, 'warning'::text, 'error'::text])));
ALTER TABLE public."ai_activity_logs" ADD CONSTRAINT "ai_activity_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_approval_queue" ADD CONSTRAINT "autopilot_approval_queue_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."autopilot_approval_queue" ADD CONSTRAINT "autopilot_approval_queue_pkey" PRIMARY KEY (id);
ALTER TABLE public."autopilot_approval_queue" ADD CONSTRAINT "autopilot_approval_queue_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'cancelled'::text])));
ALTER TABLE public."autopilot_approval_queue" ADD CONSTRAINT "autopilot_approval_queue_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_customers" ADD CONSTRAINT "autopilot_customers_id_user_id_key" UNIQUE (id, user_id);
ALTER TABLE public."autopilot_customers" ADD CONSTRAINT "autopilot_customers_pkey" PRIMARY KEY (id);
ALTER TABLE public."autopilot_customers" ADD CONSTRAINT "autopilot_customers_source_check" CHECK ((source = ANY (ARRAY['manual'::text, 'store'::text, 'ads'::text, 'simulation'::text, 'import'::text])));
ALTER TABLE public."autopilot_customers" ADD CONSTRAINT "autopilot_customers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_customers" ADD CONSTRAINT "autopilot_customers_user_source_record_key" UNIQUE (user_id, source_record_id);
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_line_total_check" CHECK ((line_total >= (0)::numeric));
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_order_id_user_id_fkey" FOREIGN KEY (order_id, user_id) REFERENCES autopilot_orders(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_pkey" PRIMARY KEY (id);
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_product_id_user_id_fkey" FOREIGN KEY (product_id, user_id) REFERENCES autopilot_products(id, user_id) ON DELETE RESTRICT;
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_quantity_check" CHECK ((quantity > 0));
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_unit_price_check" CHECK ((unit_price >= (0)::numeric));
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_order_items" ADD CONSTRAINT "autopilot_order_items_user_source_record_key" UNIQUE (user_id, source_record_id);
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_amount_check" CHECK ((amount >= (0)::numeric));
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_customer_id_user_id_fkey" FOREIGN KEY (customer_id, user_id) REFERENCES autopilot_customers(id, user_id) ON DELETE SET NULL (customer_id);
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_pkey" PRIMARY KEY (id, user_id);
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_product_id_user_id_fkey" FOREIGN KEY (product_id, user_id) REFERENCES autopilot_products(id, user_id) ON DELETE RESTRICT;
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_status_check" CHECK ((status = ANY (ARRAY['Novo'::text, 'Pagamento pendente'::text, 'Pago'::text, 'Enviado ao fornecedor'::text, 'Em trânsito'::text, 'Entregue'::text, 'Cancelado'::text])));
ALTER TABLE public."autopilot_orders" ADD CONSTRAINT "autopilot_orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_lead_time_days_check" CHECK (((lead_time_days IS NULL) OR (lead_time_days >= 0)));
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_minimum_order_quantity_check" CHECK (((minimum_order_quantity IS NULL) OR (minimum_order_quantity > 0)));
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_pkey" PRIMARY KEY (id);
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_product_id_supplier_id_user_id_key" UNIQUE (product_id, supplier_id, user_id);
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_product_id_user_id_fkey" FOREIGN KEY (product_id, user_id) REFERENCES autopilot_products(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_supplier_id_user_id_fkey" FOREIGN KEY (supplier_id, user_id) REFERENCES autopilot_suppliers(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_unit_cost_check" CHECK (((unit_cost IS NULL) OR (unit_cost >= (0)::numeric)));
ALTER TABLE public."autopilot_product_suppliers" ADD CONSTRAINT "autopilot_product_suppliers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_estimated_unit_cost_check" CHECK (((estimated_unit_cost IS NULL) OR (estimated_unit_cost >= (0)::numeric)));
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_pkey" PRIMARY KEY (id, user_id);
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_sale_price_check" CHECK ((sale_price >= (0)::numeric));
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_source_check" CHECK ((source = ANY (ARRAY['manual'::text, 'research_ai'::text, 'import'::text, 'simulation'::text])));
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_status_check" CHECK ((status = ANY (ARRAY['research'::text, 'approved'::text, 'testing'::text, 'active'::text, 'archived'::text])));
ALTER TABLE public."autopilot_products" ADD CONSTRAINT "autopilot_products_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_state" ADD CONSTRAINT "autopilot_state_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_state" ADD CONSTRAINT "autopilot_state_user_id_state_key_key" UNIQUE (user_id, state_key);
ALTER TABLE public."autopilot_suppliers" ADD CONSTRAINT "autopilot_suppliers_id_user_id_key" UNIQUE (id, user_id);
ALTER TABLE public."autopilot_suppliers" ADD CONSTRAINT "autopilot_suppliers_pkey" PRIMARY KEY (id);
ALTER TABLE public."autopilot_suppliers" ADD CONSTRAINT "autopilot_suppliers_rating_check" CHECK (((rating IS NULL) OR ((rating >= (0)::numeric) AND (rating <= (5)::numeric))));
ALTER TABLE public."autopilot_suppliers" ADD CONSTRAINT "autopilot_suppliers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."autopilot_suppliers" ADD CONSTRAINT "autopilot_suppliers_verification_status_check" CHECK ((verification_status = ANY (ARRAY['unverified'::text, 'pending'::text, 'verified'::text, 'rejected'::text])));
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_amount_check" CHECK ((amount >= (0)::numeric));
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_campaign_id_user_id_fkey" FOREIGN KEY (campaign_id, user_id) REFERENCES ad_campaigns(id, user_id) ON DELETE SET NULL (campaign_id);
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_order_id_user_id_fkey" FOREIGN KEY (order_id, user_id) REFERENCES autopilot_orders(id, user_id) ON DELETE SET NULL (order_id);
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_pkey" PRIMARY KEY (id);
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_transaction_type_check" CHECK ((transaction_type = ANY (ARRAY['revenue'::text, 'product_cost'::text, 'ad_cost'::text, 'shipping'::text, 'fee'::text, 'refund'::text, 'other'::text])));
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."finance_transactions" ADD CONSTRAINT "finance_transactions_user_source_record_key" UNIQUE (user_id, source_record_id);
ALTER TABLE public."monitoring_events" ADD CONSTRAINT "monitoring_events_pkey" PRIMARY KEY (id);
ALTER TABLE public."monitoring_events" ADD CONSTRAINT "monitoring_events_status_check" CHECK ((status = ANY (ARRAY['healthy'::text, 'degraded'::text, 'down'::text, 'unknown'::text])));
ALTER TABLE public."monitoring_events" ADD CONSTRAINT "monitoring_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_is_simulation_check" CHECK ((is_simulation = true));
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_order_id_user_id_fkey" FOREIGN KEY (order_id, user_id) REFERENCES autopilot_orders(id, user_id) ON DELETE CASCADE;
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_order_id_user_id_key" UNIQUE (order_id, user_id);
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_pkey" PRIMARY KEY (id);
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_status_check" CHECK ((status = ANY (ARRAY['not_started'::text, 'requested_simulation'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'exception'::text, 'cancelled'::text])));
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_supplier_id_user_id_fkey" FOREIGN KEY (supplier_id, user_id) REFERENCES autopilot_suppliers(id, user_id) ON DELETE SET NULL (supplier_id);
ALTER TABLE public."order_fulfillments" ADD CONSTRAINT "order_fulfillments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_amount_check" CHECK ((amount > (0)::numeric));
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_currency_check" CHECK ((currency = ANY (ARRAY['MZN'::text, 'USD'::text])));
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_fkey" FOREIGN KEY (order_id) REFERENCES store_orders(id) ON DELETE RESTRICT;
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_pkey" PRIMARY KEY (id);
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_provider_check" CHECK ((provider = ANY (ARRAY['epay'::text, 'flutterwave'::text, 'manual'::text])));
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_provider_provider_reference_key" UNIQUE (provider, provider_reference);
ALTER TABLE public."payment_transactions" ADD CONSTRAINT "payment_transactions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'initiated'::text, 'successful'::text, 'failed'::text, 'cancelled'::text, 'refunded'::text, 'simulation'::text])));
ALTER TABLE public."product_research_runs" ADD CONSTRAINT "product_research_runs_pkey" PRIMARY KEY (id);
ALTER TABLE public."product_research_runs" ADD CONSTRAINT "product_research_runs_source_check" CHECK ((source = ANY (ARRAY['simulation'::text, 'manual'::text, 'provider'::text])));
ALTER TABLE public."product_research_runs" ADD CONSTRAINT "product_research_runs_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'completed'::text, 'failed'::text])));
ALTER TABLE public."product_research_runs" ADD CONSTRAINT "product_research_runs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public."store_order_items" ADD CONSTRAINT "store_order_items_line_total_check" CHECK ((line_total >= (0)::numeric));
ALTER TABLE public."store_order_items" ADD CONSTRAINT "store_order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES store_orders(id) ON DELETE CASCADE;
ALTER TABLE public."store_order_items" ADD CONSTRAINT "store_order_items_pkey" PRIMARY KEY (id);
ALTER TABLE public."store_order_items" ADD CONSTRAINT "store_order_items_quantity_check" CHECK ((quantity > 0));
ALTER TABLE public."store_order_items" ADD CONSTRAINT "store_order_items_unit_price_check" CHECK ((unit_price >= (0)::numeric));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_currency_check" CHECK ((currency = ANY (ARRAY['MZN'::text, 'USD'::text])));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_delivery_fee_check" CHECK ((delivery_fee >= (0)::numeric));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_order_number_key" UNIQUE (order_number);
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_order_status_check" CHECK ((order_status = ANY (ARRAY['pending_payment'::text, 'paid'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text, 'payment_failed'::text])));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_payment_provider_check" CHECK (((payment_provider IS NULL) OR (payment_provider = ANY (ARRAY['epay'::text, 'flutterwave'::text, 'manual'::text]))));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_pkey" PRIMARY KEY (id);
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_subtotal_check" CHECK ((subtotal >= (0)::numeric));
ALTER TABLE public."store_orders" ADD CONSTRAINT "store_orders_total_check" CHECK ((total >= (0)::numeric));

-- Restore non-constraint indexes.
CREATE INDEX idx_ad_campaigns_product_owner ON public.ad_campaigns USING btree (product_id, user_id);
CREATE INDEX idx_ad_campaigns_user_created ON public.ad_campaigns USING btree (user_id, created_at DESC);
CREATE UNIQUE INDEX ad_creatives_user_source_record_key ON public.ad_creatives USING btree (user_id, source_record_id);
CREATE INDEX idx_ad_creatives_adset_owner ON public.ad_creatives USING btree (ad_set_id, user_id);
CREATE INDEX idx_ad_creatives_campaign ON public.ad_creatives USING btree (user_id, campaign_id);
CREATE INDEX idx_ad_creatives_campaign_owner ON public.ad_creatives USING btree (campaign_id, user_id);
CREATE INDEX idx_ad_metrics_ad_owner ON public.ad_metrics_daily USING btree (ad_id, user_id);
CREATE INDEX idx_ad_metrics_campaign_date ON public.ad_metrics_daily USING btree (user_id, campaign_id, metric_date DESC);
CREATE INDEX idx_ad_metrics_campaign_owner ON public.ad_metrics_daily USING btree (campaign_id, user_id);
CREATE UNIQUE INDEX ad_platform_connections_user_provider_account_key ON public.ad_platform_connections USING btree (user_id, provider, external_account_id) WHERE (external_account_id IS NOT NULL);
CREATE INDEX idx_ad_platform_sync_runs_user_created ON public.ad_platform_sync_runs USING btree (user_id, created_at DESC);
CREATE INDEX idx_ad_sets_campaign ON public.ad_sets USING btree (user_id, campaign_id);
CREATE INDEX idx_ad_sets_campaign_owner ON public.ad_sets USING btree (campaign_id, user_id);
CREATE INDEX idx_ai_logs_user_created ON public.ai_activity_logs USING btree (user_id, created_at DESC);
CREATE INDEX idx_approval_queue_owner ON public.autopilot_approval_queue USING btree (user_id);
CREATE INDEX idx_customers_user_created ON public.autopilot_customers USING btree (user_id, created_at DESC);
CREATE INDEX idx_order_items_order_owner ON public.autopilot_order_items USING btree (order_id, user_id);
CREATE INDEX idx_order_items_product_owner ON public.autopilot_order_items USING btree (product_id, user_id);
CREATE INDEX idx_order_items_user_fk ON public.autopilot_order_items USING btree (user_id);
CREATE INDEX idx_orders_customer_owner ON public.autopilot_orders USING btree (customer_id, user_id);
CREATE INDEX idx_orders_product_owner ON public.autopilot_orders USING btree (product_id, user_id);
CREATE INDEX idx_orders_status ON public.autopilot_orders USING btree (user_id, status);
CREATE INDEX idx_orders_user_created ON public.autopilot_orders USING btree (user_id, created_at DESC);
CREATE INDEX idx_product_suppliers_product_owner ON public.autopilot_product_suppliers USING btree (product_id, user_id);
CREATE INDEX idx_product_suppliers_supplier_owner ON public.autopilot_product_suppliers USING btree (supplier_id, user_id);
CREATE INDEX idx_product_suppliers_user_fk ON public.autopilot_product_suppliers USING btree (user_id);
CREATE INDEX idx_autopilot_products_user_updated ON public.autopilot_products USING btree (user_id, updated_at DESC);
CREATE INDEX idx_autopilot_state_updated_at ON public.autopilot_state USING btree (updated_at DESC);
CREATE INDEX idx_autopilot_suppliers_user_name ON public.autopilot_suppliers USING btree (user_id, name);
CREATE INDEX idx_finance_campaign_owner ON public.finance_transactions USING btree (campaign_id, user_id);
CREATE INDEX idx_finance_order_owner ON public.finance_transactions USING btree (order_id, user_id);
CREATE INDEX idx_finance_user_date ON public.finance_transactions USING btree (user_id, transaction_date DESC);
CREATE INDEX idx_monitoring_user_checked ON public.monitoring_events USING btree (user_id, checked_at DESC);
CREATE INDEX idx_fulfillments_supplier_owner ON public.order_fulfillments USING btree (supplier_id, user_id);
CREATE INDEX idx_fulfillments_user_fk ON public.order_fulfillments USING btree (user_id);
CREATE INDEX idx_payment_transactions_order_id ON public.payment_transactions USING btree (order_id);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions USING btree (status);
CREATE INDEX idx_product_research_runs_user_created ON public.product_research_runs USING btree (user_id, created_at DESC);
CREATE INDEX idx_store_order_items_order_id ON public.store_order_items USING btree (order_id);
CREATE INDEX idx_store_orders_created_at ON public.store_orders USING btree (created_at DESC);
CREATE INDEX idx_store_orders_status ON public.store_orders USING btree (order_status);

-- Enable RLS and recreate the policies exactly as recorded by pg_policies.
ALTER TABLE public.autopilot_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ad_campaigns_owner_access" ON public."ad_campaigns" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_campaigns" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "ad_creatives_owner_access" ON public."ad_creatives" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_creatives" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "ad_metrics_daily_owner_access" ON public."ad_metrics_daily" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_metrics_daily" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "Users can read their ad platform connections" ON public."ad_platform_connections" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_platform_connections" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "Users can read their ad platform metrics" ON public."ad_platform_metrics_daily" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_platform_metrics_daily" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "Users can read their ad platform sync runs" ON public."ad_platform_sync_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_platform_sync_runs" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "ad_sets_owner_access" ON public."ad_sets" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."ad_sets" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "ai_activity_logs_owner_access" ON public."ai_activity_logs" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."ai_activity_logs" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_approval_queue" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_approval_queue_owner_access" ON public."autopilot_approval_queue" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_customers" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_customers_owner_access" ON public."autopilot_customers" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_order_items" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_order_items_owner_access" ON public."autopilot_order_items" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_orders" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_orders_owner_access" ON public."autopilot_orders" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_product_suppliers" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_product_suppliers_owner_access" ON public."autopilot_product_suppliers" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_products" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_products_owner_access" ON public."autopilot_products" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_state" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_state_insert_own" ON public."autopilot_state" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_state_select_own" ON public."autopilot_state" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_state_update_own" ON public."autopilot_state" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
CREATE POLICY "autopilot_admin_only_gate" ON public."autopilot_suppliers" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "autopilot_suppliers_owner_access" ON public."autopilot_suppliers" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."finance_transactions" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "finance_transactions_owner_access" ON public."finance_transactions" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."monitoring_events" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "monitoring_events_owner_access" ON public."monitoring_events" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."order_fulfillments" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "order_fulfillments_owner_access" ON public."order_fulfillments" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."payment_transactions" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "deny_client_access" ON public."payment_transactions" AS RESTRICTIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "autopilot_admin_only_gate" ON public."product_research_runs" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "product_research_runs_owner_access" ON public."product_research_runs" AS PERMISSIVE FOR ALL TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));
CREATE POLICY "autopilot_admin_only_gate" ON public."store_order_items" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "deny_client_access" ON public."store_order_items" AS RESTRICTIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);
CREATE POLICY "autopilot_admin_only_gate" ON public."store_orders" AS RESTRICTIVE FOR ALL TO "authenticated" USING ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text)) WITH CHECK ((( SELECT ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text)) = 'admin'::text));
CREATE POLICY "deny_client_access" ON public."store_orders" AS RESTRICTIVE FOR ALL TO "anon", "authenticated" USING (false) WITH CHECK (false);

-- Restore table privileges; anon remains without access.
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."ad_campaigns" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."ad_creatives" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."ad_metrics_daily" TO authenticated;
GRANT SELECT ON TABLE public."ad_platform_connections" TO authenticated;
GRANT SELECT ON TABLE public."ad_platform_metrics_daily" TO authenticated;
GRANT SELECT ON TABLE public."ad_platform_sync_runs" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."ad_sets" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."ai_activity_logs" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_approval_queue" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_customers" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_order_items" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_orders" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_product_suppliers" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_products" TO authenticated;
GRANT INSERT, SELECT, UPDATE ON TABLE public."autopilot_state" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."autopilot_suppliers" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."finance_transactions" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."monitoring_events" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."order_fulfillments" TO authenticated;
GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE public."product_research_runs" TO authenticated;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;

-- Recreate the project's custom DDL event guard.
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
  tbl name;
  qualified_object text;
BEGIN
  FOR cmd IN
    SELECT * FROM pg_catalog.pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table', 'partitioned table')
  LOOP
    IF cmd.schema_name = 'public' THEN
      SELECT c.relname INTO tbl FROM pg_catalog.pg_class c
      WHERE c.oid = cmd.objid AND c.relkind IN ('r', 'p');
      IF tbl IS NULL THEN CONTINUE; END IF;
      qualified_object := format('%I.%I', cmd.schema_name, tbl);
      EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', qualified_object);
      EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE %s FROM anon', qualified_object);
      EXECUTE format('REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLE %s FROM authenticated', qualified_object);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE %s TO authenticated', qualified_object);
      IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polrelid=cmd.objid AND p.polname='autopilot_admin_only_access') THEN
        EXECUTE format('CREATE POLICY %I ON %s AS PERMISSIVE FOR ALL TO authenticated USING ((SELECT auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'') WITH CHECK ((SELECT auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')','autopilot_admin_only_access',qualified_object);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_policy p WHERE p.polrelid=cmd.objid AND p.polname='autopilot_admin_only_gate') THEN
        EXECUTE format('CREATE POLICY %I ON %s AS RESTRICTIVE FOR ALL TO authenticated USING ((SELECT auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'') WITH CHECK ((SELECT auth.jwt() -> ''app_metadata'' ->> ''role'') = ''admin'')','autopilot_admin_only_gate',qualified_object);
      END IF;
      RAISE LOG 'rls_auto_enable: enabled RLS and admin-only policies on %', qualified_object;
    END IF;
  END LOOP;

  FOR cmd IN
    SELECT * FROM pg_catalog.pg_event_trigger_ddl_commands()
    WHERE command_tag='CREATE SEQUENCE' AND object_type='sequence' AND schema_name='public'
  LOOP
    SELECT c.relname INTO tbl FROM pg_catalog.pg_class c WHERE c.oid=cmd.objid AND c.relkind='S';
    IF tbl IS NOT NULL THEN
      qualified_object := format('%I.%I',cmd.schema_name,tbl);
      EXECUTE format('REVOKE ALL PRIVILEGES ON SEQUENCE %s FROM anon, authenticated',qualified_object);
      RAISE LOG 'rls_auto_enable: revoked client sequence access on %',qualified_object;
    END IF;
  END LOOP;

  FOR cmd IN
    SELECT * FROM pg_catalog.pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE FUNCTION','CREATE PROCEDURE')
      AND object_type IN ('function','procedure') AND schema_name='public'
  LOOP
    SELECT format('%I.%I(%s)',n.nspname,p.proname,pg_catalog.pg_get_function_identity_arguments(p.oid))
      INTO qualified_object
    FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
    WHERE p.oid=cmd.objid;
    IF qualified_object IS NOT NULL THEN
      EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated',qualified_object);
      RAISE LOG 'rls_auto_enable: revoked default client function execution on %',qualified_object;
    END IF;
  END LOOP;
END;
$function$
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
WHEN TAG IN ('CREATE TABLE','CREATE TABLE AS','SELECT INTO','CREATE SEQUENCE','CREATE FUNCTION','CREATE PROCEDURE')
EXECUTE FUNCTION public.rls_auto_enable();
