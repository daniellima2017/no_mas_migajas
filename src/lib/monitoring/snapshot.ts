import type { QuizResult, Relapse, Streak, TriggerPatterns, MonitoringSnapshot, VulnerabilityLevel } from "@/types";

interface MonitoringInputs {
  streak: Pick<Streak, "started_at"> | null;
  relapses: Pick<Relapse, "id" | "created_at">[];
  triggerPatterns: Pick<TriggerPatterns, "avg_craving" | "most_common_reason" | "most_common_hour"> | null;
  quizResult: Pick<QuizResult, "score"> | null;
  userCreatedAt?: string | null;
  journeyDayOverride?: number;
  recentSimulatorUsageCount?: number;
  recentJournalUsageCount?: number;
  now?: Date;
}

type TimeContext = "morning" | "afternoon" | "evening" | "night";

function getTimeContext(now: Date): TimeContext {
  const hour = now.getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
}

function getStreakSeconds(startedAt: string | null | undefined, now: Date): number {
  if (!startedAt) return 0;
  return Math.max(0, Math.floor((now.getTime() - new Date(startedAt).getTime()) / 1000));
}

function getHoursSince(dateString: string | null | undefined, now: Date): number | null {
  if (!dateString) return null;
  return Math.max(0, (now.getTime() - new Date(dateString).getTime()) / (1000 * 60 * 60));
}

function isNearCriticalHour(mostCommonHour: number | null | undefined, now: Date): boolean {
  if (mostCommonHour === null || mostCommonHour === undefined) return false;
  const currentHour = now.getHours();
  const difference = Math.abs(currentHour - mostCommonHour);
  return difference <= 1 || difference >= 23;
}

function getJourneyDay(userCreatedAt: string | null | undefined, now: Date): number {
  if (!userCreatedAt) return 1;
  const created = new Date(userCreatedAt).getTime();
  const elapsedDays = Math.floor((now.getTime() - created) / (1000 * 60 * 60 * 24));
  return Math.min(7, Math.max(1, elapsedDays + 1));
}

function getJourneySnapshot(journeyDay: number, vulnerability: VulnerabilityLevel) {
  if (journeyDay === 1) {
    return {
      phase: "Choque y lectura",
      title: "Dia 1 de 7: esto tiene nombre y patron",
      message: "El primer trabajo del sistema no es hacerte sentir mejor. Es mostrarte que esto ya venia pasando y que hoy puedes verlo con mas claridad.",
      focusTitle: "Prueba de hoy",
      focusBody: "Reconocer el impulso antes de obedecerlo. Si hoy te ves a tiempo, el proceso ya empezo.",
    };
  }

  if (journeyDay === 2) {
    return {
      phase: "Presencia",
      title: "Dia 2 de 7: el sistema sigue contigo",
      message: "Hoy el objetivo no es un cambio heroico. Es que empieces a notar que tu estado cambia y que ya no llegas sola a ese momento.",
      focusTitle: "Prueba de hoy",
      focusBody: "Registrar como llegas y dejar que el sistema te devuelva una lectura antes de reaccionar.",
    };
  }

  if (journeyDay === 3) {
    return {
      phase: "Intervencion consciente",
      title: "Dia 3 de 7: la pausa empieza a importar",
      message: "A esta altura el proceso deja de ser solo lectura. Hoy necesitas una accion pequena que demuestre que ya no respondes exactamente igual.",
      focusTitle: "Prueba de hoy",
      focusBody: "Crear una pausa concreta entre lo que sientes y lo que haces con el telefono.",
    };
  }

  if (journeyDay === 4) {
    return {
      phase: "Primera victoria",
      title: "Dia 4 de 7: ya puedes dejar evidencia",
      message: "Hoy importa menos sentirte fuerte y mas poder mostrar una accion distinta. La primera victoria no cambia todo, pero si cambia el relato interno.",
      focusTitle: "Prueba de hoy",
      focusBody: "Dejar una evidencia pequena de control: una mision marcada, una reaccion frenada o una urgencia que no te llevo.",
    };
  }

  if (journeyDay === 5) {
    return {
      phase: "Conciencia de patron",
      title: "Dia 5 de 7: ya puedes ver el ciclo completo",
      message: "Hoy el sistema ya no solo detecta estado. Tambien empieza a mostrarte en que parte del ciclo sigues siendo mas vulnerable.",
      focusTitle: "Prueba de hoy",
      focusBody: "Distinguir el detonante real del dia y tratarlo como patron, no como excepcion.",
    };
  }

  if (journeyDay === 6) {
    return {
      phase: "Validacion",
      title: "Dia 6 de 7: el proceso se prueba bajo tension",
      message: vulnerability === "Alta"
        ? "Hoy puede sentirse como un dia delicado, y justamente por eso sirve. Si el sistema te acompana en un momento asi, deja de ser teoria."
        : "Hoy el trabajo es sostener lo construido sin confiarte. La validacion llega cuando mantienes control incluso sin sentirte en crisis.",
      focusTitle: "Prueba de hoy",
      focusBody: "Tratar el riesgo como una senal para prepararte, no como una excusa para soltarte.",
    };
  }

  return {
    phase: "Viraje de identidad",
    title: "Dia 7 de 7: ya no llegas como el primer dia",
    message: "Todavia no significa que todo este resuelto. Significa que ya puedes mirar esta semana y ver pruebas de una version tuya que no actua igual.",
    focusTitle: "Prueba de hoy",
    focusBody: "Reconocer que el cambio no esta en lo que prometes, sino en como ya empezaste a responder diferente.",
  };
}

function getPatternFromInputs(
  quizScore: number | null,
  mostCommonReason: string,
  streakSeconds: number,
  timeContext: TimeContext,
  recentSimulatorUsageCount: number,
  recentJournalUsageCount: number
) {
  if (recentSimulatorUsageCount >= 2) {
    return {
      label: "Impulso en observacion",
      description: "Ya intentaste frenar mas de una vez en poco tiempo. Eso suele pasar cuando el impulso sigue activo, aunque no hayas recaido.",
      projectedBehavior:
        "Tu sistema no esta en frio. Esta tratando de contener una urgencia repetida, y por eso hoy conviene pensar en proteccion, no en fuerza de voluntad.",
    };
  }

  if (recentJournalUsageCount >= 2 && streakSeconds < 3 * 24 * 60 * 60) {
    return {
      label: "Sobrecarga emocional consciente",
      description: "Estas descargando mas de lo habitual, señal de que el patron sigue moviendose aunque ya no lo sigas igual.",
      projectedBehavior:
        "Cuando el sistema se carga asi, puedes sentir claridad por momentos y volver a la ansiedad despues. Lo importante hoy es sostener la pausa.",
    };
  }

  if (mostCommonReason.includes("ignora") || mostCommonReason.includes("silencio")) {
    return {
      label: "Sensibilidad al silencio",
      description: "Tu punto mas debil no es el mensaje en si. Es el vacio que aparece cuando sientes distancia.",
      projectedBehavior:
        timeContext === "night"
          ? "Cuando llegas a la noche en este estado, sueles buscar una senal de el o abrir el chat sin pensarlo."
          : "En este estado, normalmente revisas su actividad o buscas una excusa para confirmar que sigue ahi.",
    };
  }

  if (mostCommonReason.includes("ansiedad") || mostCommonReason.includes("abandono")) {
    return {
      label: "Ansiedad por validacion",
      description: "Tu sistema no esta buscando amor. Esta buscando alivio rapido para no sentirte ignorada.",
      projectedBehavior:
        "Cuando entras aqui, sueles reaccionar antes de pensar y luego justificar el impulso como necesidad emocional.",
    };
  }

  if (quizScore !== null && quizScore >= 78) {
    return {
      label: "Impulso de reconexion",
      description: "Tu patron actual no es confusion. Es apego automatico a una dinamica que ya reconoces como desigual.",
      projectedBehavior:
        "En este estado, normalmente vuelves a mirar el telefono, releer mensajes o preparar una respuesta que no deberias enviar.",
    };
  }

  if (streakSeconds < 24 * 60 * 60) {
    return {
      label: "Abstinencia emocional",
      description: "Tu mente sigue intentando volver a una fuente conocida de alivio, aunque ya sepas que te hace dano.",
      projectedBehavior:
        "Tu impulso mas comun ahora no es hablarle. Es comprobar si sigue ahi, aunque eso reactive todo otra vez.",
    };
  }

  return {
    label: "Vigilancia intermitente",
    description: "No estas en crisis total, pero sigues sensible a pequenos detonantes que reactivan el patron.",
    projectedBehavior:
      "Cuando baja tu guardia, vuelves a monitorear, anticipar o pensar demasiado en lo que el podria hacer.",
  };
}

function getMissionByVulnerability(vulnerability: VulnerabilityLevel, timeContext: TimeContext) {
  const missions: Record<VulnerabilityLevel, { title: string; body: string; support: string }> = {
    Alta: {
      title: "No abras el chat si aparece el impulso",
      body:
        timeContext === "night"
          ? "Durante las proximas 3 horas, no revises su ultima conexion ni entres a su conversacion. Si sientes urgencia, ve directo al simulador."
          : "Durante las proximas 2 horas, no revises su actividad ni busques una excusa para escribirle. Si el impulso sube, frena antes en Hielo Seco.",
      support: "Hoy no necesitas valentia heroica. Necesitas frenar el automatismo antes de que tome el control.",
    },
    Media: {
      title: "Retrasa la reaccion antes de tocar el telefono",
      body: "Si aparece ansiedad, espera 30 minutos antes de cualquier accion. Usa el diario o el simulador antes de decidir.",
      support: "No estas fuera de riesgo. Pero hoy si puedes actuar distinto a tu patron de siempre.",
    },
    Baja: {
      title: "Protege el progreso que ya construiste",
      body: "Mantente fuera de su chat y usa esta ventana de claridad para reforzar tu rutina. No pruebes tu fuerza acercandote al detonante.",
      support: "Tu estabilidad de hoy no significa descuido. Significa que tu patron ya esta perdiendo fuerza.",
    },
  };

  return missions[vulnerability];
}

function getMissionCompletionMessage(vulnerability: VulnerabilityLevel): string {
  if (vulnerability === "Alta") {
    return "Frenaste el impulso en un dia critico. Eso ya rompe una parte real del patron.";
  }

  if (vulnerability === "Media") {
    return "No reaccionaste en automatico. Esa pausa que construiste hoy vale mas de lo que parece.";
  }

  return "Protegiste tu claridad en vez de probarla. Eso tambien es progreso real.";
}

function getBehaviorProof(vulnerability: VulnerabilityLevel, streakSeconds: number): string {
  if (vulnerability === "Alta") {
    return "Hoy la prueba no es sentirte tranquila. Es no correr hacia el impulso cuando mas fuerte aparece.";
  }

  if (streakSeconds < 3 * 24 * 60 * 60) {
    return "Tu cambio ya no depende solo de entender lo que pasa. Empieza a verse en el tiempo que dejas entre sentir y reaccionar.";
  }

  return "Tu patron sigue ahi, pero ya no manda igual. Estas sosteniendo mas control del que tenias hace pocos dias.";
}

function getVictorySnapshot(vulnerability: VulnerabilityLevel, streakSeconds: number) {
  if (vulnerability === "Alta") {
    return {
      title: "Tu victoria de hoy es interrumpir",
      body: "Cada vez que frenas antes de actuar, le quitas fuerza al automatismo que antes decidia por ti.",
    };
  }

  if (streakSeconds < 24 * 60 * 60) {
    return {
      title: "Tu victoria de hoy es no volver al reflejo",
      body: "La primera senal de cambio no es sentirte distinta. Es no responder igual de rapido a la misma tension.",
    };
  }

  if (streakSeconds < 3 * 24 * 60 * 60) {
    return {
      title: "Tu victoria de hoy es sostener la pausa",
      body: "Lo que antes terminaba en chequeo o mensaje, ahora empieza a pasar por una pausa consciente.",
    };
  }

  return {
    title: "Tu victoria de hoy es consolidar control",
    body: "Ya no estas reaccionando solo en modo crisis. Empiezas a repetir conductas que protegen tu dignidad.",
  };
}

function getIdentitySnapshot(vulnerability: VulnerabilityLevel, streakSeconds: number) {
  if (vulnerability === "Alta") {
    return {
      title: "Identidad en construccion",
      message: "Todavia estas en una zona delicada, pero hoy puedes demostrarte que ya no obedeces cada impulso apenas aparece.",
    };
  }

  if (streakSeconds < 24 * 60 * 60) {
    return {
      title: "Ya no reaccionas igual",
      message: "Puede que el patron siga intentando tirar de ti, pero ya empezaste a crear distancia entre sentir y actuar.",
    };
  }

  if (streakSeconds < 3 * 24 * 60 * 60) {
    return {
      title: "Estas construyendo control",
      message: "Tu sistema empieza a aprender que no toda ansiedad necesita una respuesta inmediata. Eso ya cambia tu forma de actuar.",
    };
  }

  return {
    title: "Tu patron ya no te define igual",
    message: "No significa que todo este resuelto. Significa que ya hay evidencia de una version tuya que responde con mas dignidad que urgencia.",
  };
}

export function buildMonitoringSnapshot({
  streak,
  relapses,
  triggerPatterns,
  quizResult,
  userCreatedAt = null,
  journeyDayOverride,
  recentSimulatorUsageCount = 0,
  recentJournalUsageCount = 0,
  now = new Date(),
}: MonitoringInputs): MonitoringSnapshot {
  const streakSeconds = getStreakSeconds(streak?.started_at, now);
  const relapseCount = relapses.length;
  const avgCraving = triggerPatterns?.avg_craving ?? 0;
  const quizScore = quizResult?.score ?? 0;
  const mostCommonReason = triggerPatterns?.most_common_reason?.toLowerCase() ?? "";
  const mostCommonHour = triggerPatterns?.most_common_hour ?? null;
  const timeContext = getTimeContext(now);
  const journeyDay = journeyDayOverride ?? getJourneyDay(userCreatedAt, now);
  const lastRelapseAt = relapses[0]?.created_at ?? null;
  const hoursSinceLastRelapse = getHoursSince(lastRelapseAt, now);
  const nearCriticalHour = isNearCriticalHour(mostCommonHour, now);

  let riskScore = 28;

  if (streakSeconds < 12 * 60 * 60) riskScore += 28;
  else if (streakSeconds < 24 * 60 * 60) riskScore += 18;
  else if (streakSeconds < 72 * 60 * 60) riskScore += 10;

  riskScore += Math.min(20, relapseCount * 4);
  riskScore += Math.min(14, Math.round(avgCraving * 1.5));
  riskScore += Math.round(quizScore * 0.15);
  riskScore += Math.min(12, recentSimulatorUsageCount * 4);
  riskScore += Math.min(8, recentJournalUsageCount * 2);

  if (hoursSinceLastRelapse !== null && hoursSinceLastRelapse < 24) riskScore += 14;
  else if (hoursSinceLastRelapse !== null && hoursSinceLastRelapse < 72) riskScore += 7;

  if (timeContext === "night") riskScore += 10;
  else if (timeContext === "evening") riskScore += 6;

  if (nearCriticalHour) riskScore += 8;

  const riskPercent = Math.max(22, Math.min(92, riskScore));

  let vulnerability: VulnerabilityLevel = "Baja";
  if (riskPercent >= 75) vulnerability = "Alta";
  else if (riskPercent >= 50) vulnerability = "Media";

  const pattern = getPatternFromInputs(
    quizScore || null,
    mostCommonReason,
    streakSeconds,
    timeContext,
    recentSimulatorUsageCount,
    recentJournalUsageCount
  );
  const mission = getMissionByVulnerability(vulnerability, timeContext);
  const victory = getVictorySnapshot(vulnerability, streakSeconds);
  const identity = getIdentitySnapshot(vulnerability, streakSeconds);
  const journey = getJourneySnapshot(journeyDay, vulnerability);
  const missionDate = now.toISOString().slice(0, 10);
  const missionKey = [
    missionDate,
    vulnerability.toLowerCase(),
    pattern.label.toLowerCase().replace(/\s+/g, "-"),
    timeContext,
  ].join(":");

  const cravingSignal = avgCraving
    ? `Ansiedad media reciente: ${avgCraving.toFixed(1)}/10`
    : "Sin ansiedad media suficiente para un patron fino";
  const relapseSignal = relapseCount > 0
    ? `${relapseCount} recaida${relapseCount === 1 ? "" : "s"} registrada${relapseCount === 1 ? "" : "s"}`
    : "Sin recaidas registradas recientemente";
  const simulatorSignal = recentSimulatorUsageCount > 0
    ? `Hielo Seco usado ${recentSimulatorUsageCount} vez${recentSimulatorUsageCount === 1 ? "" : "es"} en las ultimas 24h`
    : "Sin uso reciente de Hielo Seco";
  const journalSignal = recentJournalUsageCount > 0
    ? `Diario usado ${recentJournalUsageCount} vez${recentJournalUsageCount === 1 ? "" : "es"} en las ultimas 24h`
    : "Sin descarga reciente en el diario";
  const criticalHourSignal = nearCriticalHour && mostCommonHour !== null
    ? `Estas cerca de tu hora critica habitual: ${String(mostCommonHour).padStart(2, "0")}:00`
    : null;

  return {
    vulnerability,
    risk_percent: riskPercent,
    journey_day: journeyDay,
    journey_phase: journey.phase,
    journey_title: journey.title,
    journey_message: journey.message,
    journey_focus_title: journey.focusTitle,
    journey_focus_body: journey.focusBody,
    pattern_label: pattern.label,
    pattern_description: pattern.description,
    projected_behavior: pattern.projectedBehavior,
    mission_key: missionKey,
    mission_date: missionDate,
    mission_title: mission.title,
    mission_body: mission.body,
    mission_completion_message: getMissionCompletionMessage(vulnerability),
    behavior_proof: getBehaviorProof(vulnerability, streakSeconds),
    victory_title: victory.title,
    victory_body: victory.body,
    identity_title: identity.title,
    identity_message: identity.message,
    support_message: mission.support,
    signal_summary: [cravingSignal, relapseSignal, simulatorSignal, journalSignal, criticalHourSignal]
      .filter(Boolean)
      .join(" · "),
  };
}
