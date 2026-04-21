import type { Medal } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";

interface MedalThreshold {
  type: string;
  seconds: number;
}

const MEDAL_THRESHOLDS: MedalThreshold[] = [
  { type: "bronze_12h", seconds: 12 * 60 * 60 },
  { type: "silver_24h", seconds: 24 * 60 * 60 },
  { type: "gold_3d", seconds: 3 * 24 * 60 * 60 },
  { type: "diamond_7d", seconds: 7 * 24 * 60 * 60 },
  { type: "dignity_21d", seconds: 21 * 24 * 60 * 60 },
];

export function getStreakSecondsFromStartedAt(startedAt: string | null | undefined, now = new Date()): number {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(startedAt).getTime()) / 1000));
}

export async function syncMedalsForUser(
  userId: string,
  streakSeconds: number,
  existingMedals: Medal[] = []
): Promise<Medal[]> {
  const supabase = createAdminClient();
  const unlockedTypes = new Set(existingMedals.map((medal) => medal.medal_type));

  const missingUnlocks = MEDAL_THRESHOLDS.filter(
    (threshold) => streakSeconds >= threshold.seconds && !unlockedTypes.has(threshold.type)
  );

  if (missingUnlocks.length === 0) {
    return existingMedals;
  }

  const { data: insertedMedals, error } = await supabase
    .from("medals")
    .upsert(
      missingUnlocks.map((threshold) => ({
        user_id: userId,
        medal_type: threshold.type,
      })),
      { onConflict: "user_id,medal_type" }
    )
    .select("*");

  if (error) {
    console.error("Error sincronizando medallas:", error);
    return existingMedals;
  }

  const merged = [...existingMedals];
  for (const medal of insertedMedals || []) {
    if (!merged.some((existing) => existing.medal_type === medal.medal_type)) {
      merged.push(medal as Medal);
    }
  }

  return merged.sort(
    (a, b) => new Date(a.unlocked_at).getTime() - new Date(b.unlocked_at).getTime()
  );
}
