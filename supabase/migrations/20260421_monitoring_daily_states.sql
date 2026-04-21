-- Sprint 9: persistencia real para mision diaria e continuidade

CREATE TABLE IF NOT EXISTS public.monitoring_daily_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  state_date DATE NOT NULL,
  vulnerability TEXT NOT NULL,
  risk_percent INTEGER NOT NULL,
  pattern_label TEXT NOT NULL,
  mission_key TEXT NOT NULL,
  mission_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, state_date)
);

CREATE INDEX IF NOT EXISTS idx_monitoring_daily_states_user_id
  ON public.monitoring_daily_states(user_id);

CREATE INDEX IF NOT EXISTS idx_monitoring_daily_states_state_date
  ON public.monitoring_daily_states(state_date DESC);

CREATE INDEX IF NOT EXISTS idx_monitoring_daily_states_user
  ON public.monitoring_daily_states(user_id, state_date DESC);

ALTER TABLE public.monitoring_daily_states ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'monitoring_daily_states'
      AND policyname = 'own_data'
  ) THEN
    CREATE POLICY "own_data" ON public.monitoring_daily_states
      FOR ALL
      USING (auth.uid() = user_id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trigger_update_monitoring_daily_states_updated_at'
  ) THEN
    CREATE TRIGGER trigger_update_monitoring_daily_states_updated_at
      BEFORE UPDATE ON public.monitoring_daily_states
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at();
  END IF;
END
$$;
