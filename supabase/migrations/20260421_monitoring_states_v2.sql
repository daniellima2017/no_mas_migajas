ALTER TABLE public.monitoring_daily_states
  ADD COLUMN IF NOT EXISTS detected_state TEXT,
  ADD COLUMN IF NOT EXISTS confidence_level TEXT,
  ADD COLUMN IF NOT EXISTS crisis_mode BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ritual_checkin_state TEXT,
  ADD COLUMN IF NOT EXISTS ritual_completed_at TIMESTAMPTZ;

UPDATE public.monitoring_daily_states
SET
  detected_state = COALESCE(
    detected_state,
    CASE
      WHEN risk_percent >= 70 THEN 'vulnerable'
      WHEN risk_percent >= 45 THEN 'sensible'
      ELSE 'estable'
    END
  ),
  confidence_level = COALESCE(confidence_level, 'media'),
  crisis_mode = COALESCE(crisis_mode, FALSE)
WHERE detected_state IS NULL
   OR confidence_level IS NULL
   OR crisis_mode IS NULL;

ALTER TABLE public.monitoring_daily_states
  ALTER COLUMN detected_state SET NOT NULL,
  ALTER COLUMN confidence_level SET NOT NULL,
  ALTER COLUMN crisis_mode SET NOT NULL;

ALTER TABLE public.monitoring_daily_states
  DROP CONSTRAINT IF EXISTS monitoring_daily_states_detected_state_check,
  DROP CONSTRAINT IF EXISTS monitoring_daily_states_confidence_level_check,
  DROP CONSTRAINT IF EXISTS monitoring_daily_states_ritual_checkin_state_check;

ALTER TABLE public.monitoring_daily_states
  ADD CONSTRAINT monitoring_daily_states_detected_state_check
    CHECK (detected_state IN ('estable', 'sensible', 'vulnerable')),
  ADD CONSTRAINT monitoring_daily_states_confidence_level_check
    CHECK (confidence_level IN ('alta', 'media', 'baja')),
  ADD CONSTRAINT monitoring_daily_states_ritual_checkin_state_check
    CHECK (ritual_checkin_state IS NULL OR ritual_checkin_state IN ('estable', 'vulnerable'));
