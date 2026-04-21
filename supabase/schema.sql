-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  hotmart_transaction_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  current_level TEXT DEFAULT 'novato',
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Quiz results table
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  raw_points INTEGER NOT NULL,
  verdict TEXT NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Streaks table
CREATE TABLE public.streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  longest_streak_seconds INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. Relapses table
CREATE TABLE public.relapses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT,
  craving_level INTEGER CHECK (craving_level >= 1 AND craving_level <= 10),
  streak_duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Medals table
CREATE TABLE public.medals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  medal_type TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, medal_type)
);

-- 6. Simulator logs table
CREATE TABLE public.simulator_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('received', 'sending')),
  translation TEXT,
  verdict TEXT,
  ai_provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Journal entries table
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Monitoring daily states table
CREATE TABLE public.monitoring_daily_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  state_date DATE NOT NULL,
  vulnerability TEXT NOT NULL,
  risk_percent INTEGER NOT NULL,
  detected_state TEXT NOT NULL CHECK (detected_state IN ('estable', 'sensible', 'vulnerable')),
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('alta', 'media', 'baja')),
  crisis_mode BOOLEAN NOT NULL DEFAULT FALSE,
  pattern_label TEXT NOT NULL,
  mission_key TEXT NOT NULL,
  ritual_checkin_state TEXT CHECK (ritual_checkin_state IN ('estable', 'vulnerable')),
  ritual_completed_at TIMESTAMPTZ,
  mission_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, state_date)
);

-- 9. Elite advices table
CREATE TABLE public.elite_advices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medal_type TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

-- 10. API error logs table
CREATE TABLE public.api_error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider TEXT NOT NULL,
  error_message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Webhook events table
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_quiz_results_user_id ON public.quiz_results(user_id);
CREATE INDEX idx_quiz_results_created_at ON public.quiz_results(created_at DESC);
CREATE INDEX idx_relapses_user_id ON public.relapses(user_id);
CREATE INDEX idx_relapses_created_at ON public.relapses(created_at DESC);
CREATE INDEX idx_medals_user_id ON public.medals(user_id);
CREATE INDEX idx_simulator_logs_user_id ON public.simulator_logs(user_id);
CREATE INDEX idx_simulator_logs_created_at ON public.simulator_logs(created_at DESC);
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_monitoring_daily_states_user_id ON public.monitoring_daily_states(user_id);
CREATE INDEX idx_monitoring_daily_states_state_date ON public.monitoring_daily_states(state_date DESC);
CREATE INDEX idx_api_error_logs_provider ON public.api_error_logs(provider);
CREATE INDEX idx_api_error_logs_created_at ON public.api_error_logs(created_at DESC);
CREATE INDEX idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed_at ON public.webhook_events(processed_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relapses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulator_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_daily_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elite_advices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Users: own_data policy
CREATE POLICY "own_data" ON public.users
  FOR ALL
  USING (auth.uid() = id);

-- Quiz results: own_data policy
CREATE POLICY "own_data" ON public.quiz_results
  FOR ALL
  USING (auth.uid() = user_id);

-- Streaks: own_data policy
CREATE POLICY "own_data" ON public.streaks
  FOR ALL
  USING (auth.uid() = user_id);

-- Relapses: own_data policy
CREATE POLICY "own_data" ON public.relapses
  FOR ALL
  USING (auth.uid() = user_id);

-- Medals: own_data policy
CREATE POLICY "own_data" ON public.medals
  FOR ALL
  USING (auth.uid() = user_id);

-- Simulator logs: own_data policy
CREATE POLICY "own_data" ON public.simulator_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- Journal entries: own_data policy
CREATE POLICY "own_data" ON public.journal_entries
  FOR ALL
  USING (auth.uid() = user_id);

-- Monitoring daily states: own_data policy
CREATE POLICY "own_data" ON public.monitoring_daily_states
  FOR ALL
  USING (auth.uid() = user_id);

-- Elite advices: read_all policy (authenticated users can read)
CREATE POLICY "read_all" ON public.elite_advices
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- api_error_logs: NO policies (service_role only)
-- webhook_events: NO policies (service_role only)

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function: update_updated_at
-- Automatically updates the updated_at timestamp on users table
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: update_updated_at on users table
CREATE TRIGGER trigger_update_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger: update_updated_at on monitoring_daily_states table
CREATE TRIGGER trigger_update_monitoring_daily_states_updated_at
  BEFORE UPDATE ON public.monitoring_daily_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Function: create_initial_streak
-- Creates an initial streak record when a new user is created
CREATE OR REPLACE FUNCTION public.create_initial_streak()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.streaks (user_id, started_at, longest_streak_seconds, is_active)
  VALUES (NEW.id, NOW(), 0, TRUE);
  RETURN NEW;
END;
$$;

-- Trigger: create_initial_streak on users table
CREATE TRIGGER trigger_create_initial_streak
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_streak();

-- ============================================
-- ADDITIONAL INDEXES FOR DASHBOARD PERFORMANCE
-- ============================================

-- Composite indexes for user-scoped queries with date ordering
CREATE INDEX idx_quiz_results_user ON public.quiz_results(user_id, created_at DESC);
CREATE INDEX idx_relapses_user ON public.relapses(user_id, created_at DESC);
CREATE INDEX idx_medals_user ON public.medals(user_id);
CREATE INDEX idx_simulator_logs_user ON public.simulator_logs(user_id, created_at DESC);
CREATE INDEX idx_journal_entries_user ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX idx_monitoring_daily_states_user ON public.monitoring_daily_states(user_id, state_date DESC);

-- Indexes for error tracking and webhook processing
CREATE INDEX idx_api_errors_created ON public.api_error_logs(created_at DESC);
CREATE INDEX idx_webhook_event_id ON public.webhook_events(event_id);

-- ============================================
-- VIEW: TRIGGER PATTERNS
-- ============================================

CREATE OR REPLACE VIEW public.trigger_patterns AS
SELECT
  user_id,
  AVG(craving_level) AS avg_craving,
  MODE() WITHIN GROUP (ORDER BY reason) AS most_common_reason,
  MODE() WITHIN GROUP (ORDER BY EXTRACT(HOUR FROM created_at)) AS most_common_hour,
  COUNT(*) AS total_relapses,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY craving_level) AS craving_threshold
FROM public.relapses
GROUP BY user_id;

-- ============================================
-- SEED DATA: ELITE ADVICES
-- ============================================

INSERT INTO public.elite_advices (medal_type, title, content) VALUES
  ('bronze_12h', '12 Horas de Poder', 'Sobreviviste medio dia. Eso demuestra que la ansiedad pasa. Siempre pasa.'),
  ('silver_24h', 'Un Dia Entero', 'El ni se dio cuenta de que desapareciste. Pero TU si notaste que sobreviviste.'),
  ('gold_3d', 'Tres Dias de Hielo', 'En este momento, el esta confundido. Y la confusion es lo unico que un narcisista no puede controlar.'),
  ('diamond_7d', 'Una Semana Blindada', 'Hiciste en 7 dias lo que la mayoria no logra en meses. La adiccion perdio.'),
  ('dignity_21d', 'Dignidad Restaurada', 'Veintiun dias. Ya no eres rehen. Eres la mujer que el perdio.');
