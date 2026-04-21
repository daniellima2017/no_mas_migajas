export enum MedalType {
  BRONZE_12H = 'bronze_12h',
  SILVER_24H = 'silver_24h',
  GOLD_3D = 'gold_3d',
  DIAMOND_7D = 'diamond_7d',
  DIGNITY_21D = 'dignity_21d',
}

export enum SimulatorMode {
  RECEIVED = 'received',
  SENDING = 'sending',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  hotmart_transaction_id: string | null;
  onboarding_completed: boolean;
  current_level: string;
  subscription_status: string;
  created_at: string;
  updated_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  score: number;
  raw_points: number;
  verdict: string;
  answers: Record<string, unknown>;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  started_at: string;
  longest_streak_seconds: number;
  is_active: boolean;
}

export interface Relapse {
  id: string;
  user_id: string;
  reason: string | null;
  craving_level: number | null;
  streak_duration_seconds: number | null;
  created_at: string;
}

export interface Medal {
  id: string;
  user_id: string;
  medal_type: string;
  unlocked_at: string;
}

export interface SimulatorLog {
  id: string;
  user_id: string;
  input_text: string;
  mode: SimulatorMode;
  translation: string | null;
  verdict: string | null;
  ai_provider: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  ai_feedback: string | null;
  created_at: string;
}

export interface EliteAdvice {
  id: string;
  medal_type: string;
  title: string;
  content: string;
}

export interface TriggerPatterns {
  user_id: string;
  avg_craving: number | null;
  most_common_reason: string | null;
  most_common_hour: number | null;
  total_relapses: number;
  craving_threshold: number | null;
}

export type VulnerabilityLevel = "Alta" | "Media" | "Baja";

export interface MonitoringSnapshot {
  vulnerability: VulnerabilityLevel;
  risk_percent: number;
  journey_day: number;
  journey_phase: string;
  journey_title: string;
  journey_message: string;
  journey_focus_title: string;
  journey_focus_body: string;
  pattern_label: string;
  pattern_description: string;
  projected_behavior: string;
  mission_key: string;
  mission_date: string;
  mission_title: string;
  mission_body: string;
  mission_completion_message: string;
  behavior_proof: string;
  victory_title: string;
  victory_body: string;
  identity_title: string;
  identity_message: string;
  support_message: string;
  signal_summary: string;
}

export interface MonitoringDailyState {
  id: string;
  user_id: string;
  state_date: string;
  vulnerability: VulnerabilityLevel;
  risk_percent: number;
  pattern_label: string;
  mission_key: string;
  mission_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorLog {
  id: string;
  provider: string;
  error_message: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  event_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  processed_at: string | null;
  created_at: string;
}
