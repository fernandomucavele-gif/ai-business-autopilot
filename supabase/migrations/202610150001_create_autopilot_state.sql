CREATE TABLE IF NOT EXISTS public.autopilot_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_key TEXT NOT NULL,
    state_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID
);

ALTER TABLE public.autopilot_state
    ENABLE ROW LEVEL SECURITY;
