import type { LucideIconName } from "@/types/icons";

export interface QuizOption {
  id: string;
  text: string;
  points: number;
  icon: LucideIconName;
}

export interface QuizQuestion {
  id: string;
  title: string;
  context: string;
  options: QuizOption[];
}

export const QUIZ_POOL: QuizQuestion[] = [
  // ===== BLOQUE 1: STALKING DIGITAL (q1-q8) =====
  {
    id: "q1",
    title: "Revisas su perfil de redes sociales",
    context: "Cuando no tienes noticias de el...",
    options: [
      { id: "a", text: "Nunca. Borre todo rastro de el.", points: 0, icon: "Shield" },
      { id: "b", text: "Rara vez, solo si me aparece por accidente.", points: 3, icon: "Eye" },
      { id: "c", text: "Un par de veces por semana.", points: 5, icon: "Search" },
      { id: "d", text: "Casi todos los dias.", points: 8, icon: "Smartphone" },
      { id: "e", text: "Varias veces al dia. Se su actividad al detalle.", points: 10, icon: "Stalker" },
    ],
  },
  {
    id: "q2",
    title: "Revisas quienes le dan 'like' o comentan",
    context: "En sus publicaciones o stories...",
    options: [
      { id: "a", text: "No sigo sus redes. No me interesa.", points: 0, icon: "Shield" },
      { id: "b", text: "Si lo veo por casualidad, paso de largo.", points: 3, icon: "EyeOff" },
      { id: "c", text: "A veces miro quien interactua con el.", points: 5, icon: "Search" },
      { id: "d", text: "Reviso cada comentario y cada 'like' nuevo.", points: 8, icon: "Scan" },
      { id: "e", text: "Investigo los perfiles de quienes interactuan con el.", points: 10, icon: "Stalker" },
    ],
  },
  {
    id: "q3",
    title: "Uso de apps de mensajeria",
    context: "WhatsApp, Instagram DM, Telegram...",
    options: [
      { id: "a", text: "Bloqueado en todas partes.", points: 0, icon: "Shield" },
      { id: "b", text: "No bloqueado, pero no lo busco.", points: 3, icon: "EyeOff" },
      { id: "c", text: "Reviso su ultimo conectado ocasionalmente.", points: 5, icon: "Clock" },
      { id: "d", text: "Vigilo su estado y actividad frecuentemente.", points: 8, icon: "Scan" },
      { id: "e", text: "Le escribo o reviso todo el tiempo.", points: 10, icon: "Send" },
    ],
  },
  {
    id: "q4",
    title: "Buscas pistas de su vida actual",
    context: "Sobre lo que el hace ahora...",
    options: [
      { id: "a", text: "No me importa. Mi vida es mi prioridad.", points: 0, icon: "Crown" },
      { id: "b", text: "Si me entero por otros, escucho pero no busco.", points: 3, icon: "Feather" },
      { id: "c", text: "A veces pregunto a conocidos en comun.", points: 5, icon: "Users" },
      { id: "d", text: "Pido informacion a sus amigos o familia.", points: 8, icon: "Search" },
      { id: "e", text: "Lo vigilo por multiples canales constantemente.", points: 10, icon: "Scan" },
    ],
  },
  {
    id: "q5",
    title: "Reaccion al ver que sube una foto",
    context: "Cuando publica algo nuevo...",
    options: [
      { id: "a", text: "No me entero porque no lo sigo.", points: 0, icon: "Shield" },
      { id: "b", text: "Lo noto pero sigo con mi dia.", points: 3, icon: "Meh" },
      { id: "c", text: "Analizo la foto buscando detalles.", points: 5, icon: "Search" },
      { id: "d", text: "Me obsesiono tratando de descifrar que significa.", points: 8, icon: "Brain" },
      { id: "e", text: "Me arruina el dia completo.", points: 10, icon: "CloudRain" },
    ],
  },
  {
    id: "q6",
    title: "Cuentas falsas o perfiles secundarios",
    context: "Para ver sus redes sin que sepa...",
    options: [
      { id: "a", text: "Jamas haria algo asi.", points: 0, icon: "Shield" },
      { id: "b", text: "Lo he pensado pero nunca lo hice.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "Lo hice una vez por curiosidad.", points: 5, icon: "Eye" },
      { id: "d", text: "Tengo un perfil para seguirlo sin que sepa.", points: 8, icon: "EyeOff" },
      { id: "e", text: "Tengo multiples formas de vigilarlo en secreto.", points: 10, icon: "Scan" },
    ],
  },
  {
    id: "q7",
    title: "Revisas la ubicacion de tu telefono",
    context: "Si compartian ubicacion antes...",
    options: [
      { id: "a", text: "Desactive todo. No me interesa donde esta.", points: 0, icon: "Shield" },
      { id: "b", text: "Ya no comparto ubicacion con el.", points: 3, icon: "Lock" },
      { id: "c", text: "A veces reviso si aun puedo verla.", points: 5, icon: "Search" },
      { id: "d", text: "Reviso su ubicacion cuando puedo.", points: 8, icon: "Scan" },
      { id: "e", text: "Monitoreo su ubicacion constantemente.", points: 10, icon: "Stalker" },
    ],
  },
  {
    id: "q8",
    title: "Guardas capturas de sus conversaciones",
    context: "Mensajes, stories, fotos juntos...",
    options: [
      { id: "a", text: "Todo eliminado. No guardo nada.", points: 0, icon: "Trash2" },
      { id: "b", text: "Guarde algo, pero no lo busco.", points: 3, icon: "Archive" },
      { id: "c", text: "A veces reviso fotos o mensajes viejos.", points: 5, icon: "Image" },
      { id: "d", text: "Tengo carpetas organizadas de recuerdos.", points: 8, icon: "FolderOpen" },
      { id: "e", text: "Los reviso constantemente, casi como un ritual.", points: 10, icon: "Heart" },
    ],
  },

  // ===== BLOQUE 2: PENSAMIENTOS OBSESIVOS (q9-q16) =====
  {
    id: "q9",
    title: "Frecuencia de pensamientos sobre el",
    context: "Durante tu dia normal...",
    options: [
      { id: "a", text: "Casi no pienso en el. Tengo otras prioridades.", points: 0, icon: "Sun" },
      { id: "b", text: "A veces me acuerdo, pero sigo con mi vida.", points: 3, icon: "Cloud" },
      { id: "c", text: "Pienso en el varias veces, me cuesta concentrarme.", points: 5, icon: "Brain" },
      { id: "d", text: "Esta presente en mi mente la mayor parte del dia.", points: 8, icon: "Clock" },
      { id: "e", text: "No puedo pensar en otra cosa. Es obsesivo.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q10",
    title: "Fantaseas con reconciliarte",
    context: "En momentos de soledad...",
    options: [
      { id: "a", text: "No quiero volver. Se que es toxico.", points: 0, icon: "Ban" },
      { id: "b", text: "Se que no deberia, pero a veces lo imagino.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "Mantengo una pequena esperanza.", points: 5, icon: "Heart" },
      { id: "d", text: "Creo que todavia hay posibilidades.", points: 8, icon: "Sparkles" },
      { id: "e", text: "Estoy convencida de que volveremos.", points: 10, icon: "RefreshCw" },
    ],
  },
  {
    id: "q11",
    title: "Idealizas los buenos momentos",
    context: "Cuando recuerdas la relacion...",
    options: [
      { id: "a", text: "Veo la relacion como fue: toxica.", points: 0, icon: "Eye" },
      { id: "b", text: "Reconozco lo bueno y lo malo por igual.", points: 3, icon: "Scale" },
      { id: "c", text: "Tiendo a recordar mas lo bueno.", points: 5, icon: "Heart" },
      { id: "d", text: "Solo recuerdo los momentos bonitos.", points: 8, icon: "Sparkles" },
      { id: "e", text: "Creo que fue la mejor relacion de mi vida.", points: 10, icon: "Crown" },
    ],
  },
  {
    id: "q12",
    title: "Te culpas por el fracaso de la relacion",
    context: "Cuando piensas en lo que paso...",
    options: [
      { id: "a", text: "Veo claramente los problemas. No habia futuro.", points: 0, icon: "Eye" },
      { id: "b", text: "Entiendo la mayoria de las fallas.", points: 3, icon: "BookOpen" },
      { id: "c", text: "Todavia me confundo con algunas cosas.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "Creo que podria haber funcionado de otra forma.", points: 8, icon: "RotateCcw" },
      { id: "e", text: "Pienso que todo fue culpa mia.", points: 10, icon: "CircleAlert" },
    ],
  },
  {
    id: "q13",
    title: "Repites conversaciones en tu mente",
    context: "Discusiones o momentos con el...",
    options: [
      { id: "a", text: "No. Ya procese lo que paso.", points: 0, icon: "CheckCircle" },
      { id: "b", text: "Rara vez me viene algun recuerdo.", points: 3, icon: "Cloud" },
      { id: "c", text: "A veces repito discusiones en mi cabeza.", points: 5, icon: "RefreshCw" },
      { id: "d", text: "Frecuentemente imagino que le habria dicho.", points: 8, icon: "MessageCircle" },
      { id: "e", text: "Ensayo conversaciones imaginarias con el todo el tiempo.", points: 10, icon: "Brain" },
    ],
  },
  {
    id: "q14",
    title: "Suenos o pesadillas sobre el",
    context: "Por las noches...",
    options: [
      { id: "a", text: "No sueno con el. Mi mente descansa.", points: 0, icon: "Moon" },
      { id: "b", text: "Muy rara vez aparece en mis suenos.", points: 3, icon: "CloudMoon" },
      { id: "c", text: "Aparece ocasionalmente en mis suenos.", points: 5, icon: "Dream" },
      { id: "d", text: "Sueno con el frecuentemente.", points: 8, icon: "Bed" },
      { id: "e", text: "Tengo pesadillas recurrentes sobre el.", points: 10, icon: "Skull" },
    ],
  },
  {
    id: "q15",
    title: "Buscas senales de que el piensa en ti",
    context: "Interpretas coincidencias como senales...",
    options: [
      { id: "a", text: "No busco senales. La realidad es clara.", points: 0, icon: "Eye" },
      { id: "b", text: "A veces noto coincidencias pero no les doy importancia.", points: 3, icon: "Meh" },
      { id: "c", text: "Creo que algunas coincidencias significan algo.", points: 5, icon: "Sparkles" },
      { id: "d", text: "Busco activamente senales de que piensa en mi.", points: 8, icon: "Search" },
      { id: "e", text: "Todo lo interpreto como una senal de que volvera.", points: 10, icon: "Zap" },
    ],
  },
  {
    id: "q16",
    title: "Hablas de el con tus amigas",
    context: "En tus conversaciones diarias...",
    options: [
      { id: "a", text: "Ya no es tema. Hablo de mi vida actual.", points: 0, icon: "Sun" },
      { id: "b", text: "Rara vez lo menciono.", points: 3, icon: "Feather" },
      { id: "c", text: "Sale en conversacion de vez en cuando.", points: 5, icon: "MessageCircle" },
      { id: "d", text: "Mis amigas ya estan cansadas del tema.", points: 8, icon: "Users" },
      { id: "e", text: "Es lo unico de lo que hablo. No puedo evitarlo.", points: 10, icon: "AlertCircle" },
    ],
  },

  // ===== BLOQUE 3: REACCION EMOCIONAL (q17-q24) =====
  {
    id: "q17",
    title: "Reaccion ante un mensaje suyo",
    context: "Si el te escribiera ahora...",
    options: [
      { id: "a", text: "No responderia. Ya cierre ese capitulo.", points: 0, icon: "X" },
      { id: "b", text: "Dudaria, pero probablemente no responderia.", points: 3, icon: "HelpCircle" },
      { id: "c", text: "Sentiria curiosidad, quiza responderia.", points: 5, icon: "MessageCircle" },
      { id: "d", text: "Mi corazon se aceleraria. Casi seguro responderia.", points: 8, icon: "Zap" },
      { id: "e", text: "Responderia de inmediato sin pensarlo.", points: 10, icon: "Sparkles" },
    ],
  },
  {
    id: "q18",
    title: "Nivel de ansiedad actual",
    context: "Cuando escuchas su nombre o ves algo relacionado...",
    options: [
      { id: "a", text: "No me afecta en absoluto.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Siento una molestia minima.", points: 3, icon: "Feather" },
      { id: "c", text: "Me provoca inquietud visible.", points: 5, icon: "Wind" },
      { id: "d", text: "Mi ansiedad se dispara.", points: 8, icon: "Flame" },
      { id: "e", text: "Tengo ataques de panico o lloro incontrolable.", points: 10, icon: "Siren" },
    ],
  },
  {
    id: "q19",
    title: "Descripcion de tu estado emocional",
    context: "Como te sientes ultimamente...",
    options: [
      { id: "a", text: "En paz. He avanzado mucho.", points: 0, icon: "Smile" },
      { id: "b", text: "Bastante bien, con dias buenos y malos.", points: 3, icon: "Meh" },
      { id: "c", text: "Irregular. A veces estoy bien, a veces no.", points: 5, icon: "Shuffle" },
      { id: "d", text: "Triste la mayor parte del tiempo.", points: 8, icon: "Frown" },
      { id: "e", text: "Desesperada. Siento que no puedo seguir asi.", points: 10, icon: "CloudRain" },
    ],
  },
  {
    id: "q20",
    title: "Lloras cuando piensas en el",
    context: "En momentos de soledad...",
    options: [
      { id: "a", text: "No. Ya no me provoca tristeza.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Muy rara vez, y pasa rapido.", points: 3, icon: "Feather" },
      { id: "c", text: "A veces se me escapan lagrimas.", points: 5, icon: "Droplet" },
      { id: "d", text: "Lloro frecuentemente cuando estoy sola.", points: 8, icon: "CloudRain" },
      { id: "e", text: "Lloro todos los dias. No puedo controlarlo.", points: 10, icon: "Frown" },
    ],
  },
  {
    id: "q21",
    title: "Reaccion al verlo con otra persona",
    context: "Si descubrieras que esta con alguien...",
    options: [
      { id: "a", text: "Me da igual. No es mi problema.", points: 0, icon: "Shield" },
      { id: "b", text: "Sentiria una punzada pero seguiria adelante.", points: 3, icon: "Feather" },
      { id: "c", text: "Me doleria bastante durante unos dias.", points: 5, icon: "Heart" },
      { id: "d", text: "Me devastaria por semanas.", points: 8, icon: "Frown" },
      { id: "e", text: "Sentiria que mi mundo se derrumba.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q22",
    title: "Escuchas 'su cancion' o musica que compartian",
    context: "Cuando suena esa cancion...",
    options: [
      { id: "a", text: "Es solo una cancion. No me afecta.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Noto el recuerdo pero no me duele.", points: 3, icon: "Meh" },
      { id: "c", text: "Me pone nostalgica por un rato.", points: 5, icon: "Heart" },
      { id: "d", text: "Me provoca tristeza profunda.", points: 8, icon: "CloudRain" },
      { id: "e", text: "La pongo en repeticion para sentirlo cerca.", points: 10, icon: "RefreshCw" },
    ],
  },
  {
    id: "q23",
    title: "Pasas por lugares donde iban juntos",
    context: "Un restaurante, un parque, su calle...",
    options: [
      { id: "a", text: "Voy sin problema. Son solo lugares.", points: 0, icon: "CheckCircle" },
      { id: "b", text: "Lo noto pero no me desvio.", points: 3, icon: "Feather" },
      { id: "c", text: "Evito algunos lugares para no recordar.", points: 5, icon: "Ban" },
      { id: "d", text: "Paso por ahi a proposito para sentirlo cerca.", points: 8, icon: "Heart" },
      { id: "e", text: "Voy a esos lugares esperando encontrarlo.", points: 10, icon: "Search" },
    ],
  },
  {
    id: "q24",
    title: "Sientes celos retroactivos",
    context: "Sobre su pasado o su presente...",
    options: [
      { id: "a", text: "Su vida es su problema. No me importa.", points: 0, icon: "Shield" },
      { id: "b", text: "A veces me pregunto pero no me afecta.", points: 3, icon: "Meh" },
      { id: "c", text: "Me molesta pensar en el con otras.", points: 5, icon: "Flame" },
      { id: "d", text: "Los celos me consumen frecuentemente.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "No puedo dejar de imaginar escenarios.", points: 10, icon: "Brain" },
    ],
  },

  // ===== BLOQUE 4: AUTOESTIMA E IDENTIDAD (q25-q32) =====
  {
    id: "q25",
    title: "Impacto en tu autoestima",
    context: "Como te ves a ti misma ahora...",
    options: [
      { id: "a", text: "Me valoro y se lo que merezco.", points: 0, icon: "Crown" },
      { id: "b", text: "Estoy recuperando mi confianza.", points: 3, icon: "TrendingUp" },
      { id: "c", text: "Tengo dudas sobre mi valor.", points: 5, icon: "Scale" },
      { id: "d", text: "Me siento poco valiosa sin el.", points: 8, icon: "ArrowDown" },
      { id: "e", text: "Creo que no valgo nada. Me siento vacia.", points: 10, icon: "Droplet" },
    ],
  },
  {
    id: "q26",
    title: "Dependes de su aprobacion",
    context: "Tu valor como persona...",
    options: [
      { id: "a", text: "Mi valor no depende de nadie.", points: 0, icon: "Crown" },
      { id: "b", text: "Se que no deberia, pero a veces busco validacion.", points: 3, icon: "HelpCircle" },
      { id: "c", text: "Su opinion sigue importandome mucho.", points: 5, icon: "Heart" },
      { id: "d", text: "Necesito que me diga que valgo para creerlo.", points: 8, icon: "MessageCircle" },
      { id: "e", text: "Sin su aprobacion siento que no existo.", points: 10, icon: "Droplet" },
    ],
  },
  {
    id: "q27",
    title: "Comparacion con otras mujeres",
    context: "Cuando ves a otras mujeres atractivas...",
    options: [
      { id: "a", text: "Cada persona es unica. No me comparo.", points: 0, icon: "Crown" },
      { id: "b", text: "Ocasionalmente me comparo pero no me afecta.", points: 3, icon: "Scale" },
      { id: "c", text: "Me pregunto si soy suficiente comparada con ellas.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "Siento que las demas son mejores que yo.", points: 8, icon: "ArrowDown" },
      { id: "e", text: "Estoy segura de que me dejo por alguien mejor.", points: 10, icon: "Frown" },
    ],
  },
  {
    id: "q28",
    title: "Has cambiado tu apariencia por el",
    context: "Tu forma de vestir, maquillaje, cuerpo...",
    options: [
      { id: "a", text: "Me arreglo para mi, no para nadie.", points: 0, icon: "Crown" },
      { id: "b", text: "He hecho pequenos cambios naturales.", points: 3, icon: "Feather" },
      { id: "c", text: "He intentado lucir como a el le gustaba.", points: 5, icon: "Eye" },
      { id: "d", text: "Cambio mi apariencia esperando que me note.", points: 8, icon: "Sparkles" },
      { id: "e", text: "Me obsesiono con verme como el queria.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q29",
    title: "Tu identidad fuera de la relacion",
    context: "Quien eres sin el...",
    options: [
      { id: "a", text: "Tengo claro quien soy y que quiero.", points: 0, icon: "Sun" },
      { id: "b", text: "Estoy redescubriendo quien soy.", points: 3, icon: "Search" },
      { id: "c", text: "Me cuesta definirme sin referencia a el.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "Siento que perdi mi identidad en la relacion.", points: 8, icon: "Frown" },
      { id: "e", text: "No se quien soy sin el. Me siento vacia.", points: 10, icon: "Droplet" },
    ],
  },
  {
    id: "q30",
    title: "Sientes que mereces algo mejor",
    context: "Sobre el trato que recibes...",
    options: [
      { id: "a", text: "Sin duda. Merezco respeto y amor real.", points: 0, icon: "Crown" },
      { id: "b", text: "Lo se racionalmente, pero a veces dudo.", points: 3, icon: "Scale" },
      { id: "c", text: "No estoy segura de merecer algo mejor.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "Creo que ese trato es lo maximo que conseguire.", points: 8, icon: "ArrowDown" },
      { id: "e", text: "Siento que es mas de lo que merezco.", points: 10, icon: "Droplet" },
    ],
  },
  {
    id: "q31",
    title: "Has descuidado tu vida profesional",
    context: "Tu trabajo o estudios...",
    options: [
      { id: "a", text: "Mi carrera va bien. No ha afectado.", points: 0, icon: "TrendingUp" },
      { id: "b", text: "Algo distraida pero sigo rindiendo.", points: 3, icon: "Cloud" },
      { id: "c", text: "Mi rendimiento ha bajado notablemente.", points: 5, icon: "ArrowDown" },
      { id: "d", text: "He faltado o cometido errores serios.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "He perdido oportunidades por estar enfocada en el.", points: 10, icon: "XCircle" },
    ],
  },
  {
    id: "q32",
    title: "Cuidas tu salud fisica",
    context: "Alimentacion, ejercicio, sueno...",
    options: [
      { id: "a", text: "Me cuido bien. Hago ejercicio y duermo.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Intento mantener habitos saludables.", points: 3, icon: "CheckCircle" },
      { id: "c", text: "He descuidado mi alimentacion o sueno.", points: 5, icon: "AlertTriangle" },
      { id: "d", text: "Casi no como o como en exceso por ansiedad.", points: 8, icon: "Frown" },
      { id: "e", text: "Mi salud se ha deteriorado gravemente.", points: 10, icon: "XCircle" },
    ],
  },

  // ===== BLOQUE 5: PATRON DE CONTACTO (q33-q40) =====
  {
    id: "q33",
    title: "Has intentado contactarlo",
    context: "En los ultimos 30 dias...",
    options: [
      { id: "a", text: "No. Mantengo contacto cero.", points: 0, icon: "Shield" },
      { id: "b", text: "Tuve la tentacion pero me contuve.", points: 3, icon: "Lock" },
      { id: "c", text: "Le escribi una o dos veces.", points: 5, icon: "Send" },
      { id: "d", text: "Le he escrito multiples veces.", points: 8, icon: "MessageCircle" },
      { id: "e", text: "Lo llamo, le escribo y busco verlo constantemente.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q34",
    title: "Esperas que el te busque",
    context: "Cada vez que suena el telefono...",
    options: [
      { id: "a", text: "No espero nada de el.", points: 0, icon: "Shield" },
      { id: "b", text: "Si me busca, bien. Si no, tambien.", points: 3, icon: "Meh" },
      { id: "c", text: "A veces reviso el telefono esperando.", points: 5, icon: "Smartphone" },
      { id: "d", text: "Cada notificacion me hace pensar que es el.", points: 8, icon: "Zap" },
      { id: "e", text: "Vivo pendiente del telefono dia y noche.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q35",
    title: "Has usado excusas para contactarlo",
    context: "Inventar razones para escribirle...",
    options: [
      { id: "a", text: "No necesito excusas. No le escribo.", points: 0, icon: "Shield" },
      { id: "b", text: "Lo he pensado pero no lo hice.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "Use alguna excusa una vez.", points: 5, icon: "MessageCircle" },
      { id: "d", text: "Invento razones para hablarle frecuentemente.", points: 8, icon: "Send" },
      { id: "e", text: "Cualquier cosa me sirve de excusa para contactarlo.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q36",
    title: "Aceptas migajas de atencion",
    context: "Cuando el te da lo minimo...",
    options: [
      { id: "a", text: "No acepto menos de lo que merezco.", points: 0, icon: "Crown" },
      { id: "b", text: "Reconozco cuando me da migajas.", points: 3, icon: "Eye" },
      { id: "c", text: "A veces acepto poco porque es mejor que nada.", points: 5, icon: "Heart" },
      { id: "d", text: "Cualquier atencion suya me hace feliz.", points: 8, icon: "Sparkles" },
      { id: "e", text: "Agradezco lo minimo que me da como si fuera oro.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q37",
    title: "Publicas indirectas para que el vea",
    context: "En tus redes sociales...",
    options: [
      { id: "a", text: "Publico lo que quiero sin pensar en el.", points: 0, icon: "Sun" },
      { id: "b", text: "A veces pienso si lo vera, pero no cambio nada.", points: 3, icon: "Meh" },
      { id: "c", text: "Elijo fotos o frases pensando en su reaccion.", points: 5, icon: "Image" },
      { id: "d", text: "Publico especificamente para provocar celos.", points: 8, icon: "Flame" },
      { id: "e", text: "Todo lo que publico esta dirigido a el.", points: 10, icon: "Scan" },
    ],
  },
  {
    id: "q38",
    title: "Perdonas repetidamente sus faltas",
    context: "Cuando el te falla...",
    options: [
      { id: "a", text: "No hay nada que perdonar. Ya corte.", points: 0, icon: "Shield" },
      { id: "b", text: "Perdonar es un proceso, pero mantengo limites.", points: 3, icon: "Lock" },
      { id: "c", text: "Le doy otra oportunidad si se disculpa.", points: 5, icon: "Heart" },
      { id: "d", text: "Siempre termino perdonandolo sin que cambie.", points: 8, icon: "RefreshCw" },
      { id: "e", text: "Lo perdono antes de que me pida disculpas.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q39",
    title: "Has rogado que vuelva",
    context: "En momentos de desesperacion...",
    options: [
      { id: "a", text: "Jamas. Mi dignidad no se negocia.", points: 0, icon: "Crown" },
      { id: "b", text: "Tuve la tentacion pero no lo hice.", points: 3, icon: "ShieldCheck" },
      { id: "c", text: "Lo hice una vez y me arrepenti.", points: 5, icon: "RotateCcw" },
      { id: "d", text: "Lo he hecho varias veces.", points: 8, icon: "MessageCircle" },
      { id: "e", text: "Le ruego constantemente. No tengo control.", points: 10, icon: "Frown" },
    ],
  },
  {
    id: "q40",
    title: "Comparacion con otras relaciones",
    context: "Cuando conoces a alguien nuevo...",
    options: [
      { id: "a", text: "No comparo. Cada persona es un mundo.", points: 0, icon: "Users" },
      { id: "b", text: "Rara vez hago comparaciones.", points: 3, icon: "GitCompare" },
      { id: "c", text: "A veces me acuerdo de el con otras personas.", points: 5, icon: "Link" },
      { id: "d", text: "Frecuentemente comparo con el.", points: 8, icon: "BarChart" },
      { id: "e", text: "Nadie se le compara. Sigo atrapada.", points: 10, icon: "Lock" },
    ],
  },

  // ===== BLOQUE 6: IMPACTO SOCIAL Y RUTINA (q41-q48) =====
  {
    id: "q41",
    title: "Relacion con tus amistades",
    context: "Desde que termino la relacion...",
    options: [
      { id: "a", text: "Mis amistades estan mas presentes que nunca.", points: 0, icon: "HeartHandshake" },
      { id: "b", text: "Mantengo contacto regular con amigas.", points: 3, icon: "UserCheck" },
      { id: "c", text: "Me he distanciado un poco.", points: 5, icon: "UserX" },
      { id: "d", text: "Casi no salgo ni hablo con nadie.", points: 8, icon: "UserMinus" },
      { id: "e", text: "Me aisle completamente. No quiero ver a nadie.", points: 10, icon: "DoorClosed" },
    ],
  },
  {
    id: "q42",
    title: "Influencia en tu rutina diaria",
    context: "La relacion pasada afecta tu vida...",
    options: [
      { id: "a", text: "Para nada. Tengo mi rutina bajo control.", points: 0, icon: "CheckCircle" },
      { id: "b", text: "Minimamente. Algunos habitos cambiaron.", points: 3, icon: "RefreshCw" },
      { id: "c", text: "Moderadamente. Me cuesta mantener el orden.", points: 5, icon: "Calendar" },
      { id: "d", text: "Bastante. Mi rutina esta desordenada.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "Totalmente. No tengo rutina ni proposito.", points: 10, icon: "XCircle" },
    ],
  },
  {
    id: "q43",
    title: "Has cancelado planes por el",
    context: "Actividades sociales o personales...",
    options: [
      { id: "a", text: "No. Mi vida social es activa.", points: 0, icon: "Users" },
      { id: "b", text: "Rara vez, y no por culpa de el.", points: 3, icon: "Calendar" },
      { id: "c", text: "He cancelado planes por no tener animo.", points: 5, icon: "Frown" },
      { id: "d", text: "Frecuentemente cancelo por estar llorando o pensando.", points: 8, icon: "CloudRain" },
      { id: "e", text: "He cancelado todo. No tengo vida social.", points: 10, icon: "DoorClosed" },
    ],
  },
  {
    id: "q44",
    title: "Buscas informacion sobre narcisismo",
    context: "Google, YouTube, libros...",
    options: [
      { id: "a", text: "Ya entiendo el patron. No necesito mas.", points: 0, icon: "CheckCircle" },
      { id: "b", text: "Lei lo basico y me ayudo a entender.", points: 3, icon: "BookOpen" },
      { id: "c", text: "Consumo contenido regularmente sobre el tema.", points: 5, icon: "Search" },
      { id: "d", text: "Paso horas viendo videos y leyendo articulos.", points: 8, icon: "Clock" },
      { id: "e", text: "Es una obsesion. Busco pero no aplico nada.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q45",
    title: "Has contado tu situacion a desconocidos",
    context: "Taxi, fila del supermercado, extraños...",
    options: [
      { id: "a", text: "No. Es algo privado.", points: 0, icon: "Lock" },
      { id: "b", text: "Solo con personas de confianza.", points: 3, icon: "UserCheck" },
      { id: "c", text: "A veces se me escapa con conocidos.", points: 5, icon: "MessageCircle" },
      { id: "d", text: "Le cuento a quien quiera escuchar.", points: 8, icon: "Users" },
      { id: "e", text: "Necesito hablar de el constantemente con cualquiera.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q46",
    title: "Has cambiado de numero o perfil por el",
    context: "Para que te contacte o para escapar...",
    options: [
      { id: "a", text: "No. Mi vida no gira alrededor de el.", points: 0, icon: "Shield" },
      { id: "b", text: "Lo considere pero no fue necesario.", points: 3, icon: "Meh" },
      { id: "c", text: "Cambie algo menor para evitarlo.", points: 5, icon: "RefreshCw" },
      { id: "d", text: "He modificado mis redes por miedo o esperanza.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "Todo lo que hago online esta condicionado por el.", points: 10, icon: "Lock" },
    ],
  },
  {
    id: "q47",
    title: "Usas alcohol o sustancias para olvidar",
    context: "En momentos de dolor...",
    options: [
      { id: "a", text: "No. Enfrento mis emociones sin eso.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Rara vez tomo algo para relajarme.", points: 3, icon: "Feather" },
      { id: "c", text: "A veces bebo para aliviar el dolor.", points: 5, icon: "AlertTriangle" },
      { id: "d", text: "Frecuentemente uso algo para no sentir.", points: 8, icon: "Flame" },
      { id: "e", text: "Dependo de sustancias para sobrevivir el dia.", points: 10, icon: "XCircle" },
    ],
  },
  {
    id: "q48",
    title: "Has descuidado tu apariencia personal",
    context: "Higiene, ropa, cuidado personal...",
    options: [
      { id: "a", text: "Me cuido igual o mejor que antes.", points: 0, icon: "Crown" },
      { id: "b", text: "Algun dia me cuesta arreglarme pero es raro.", points: 3, icon: "Meh" },
      { id: "c", text: "He descuidado mi apariencia un poco.", points: 5, icon: "Frown" },
      { id: "d", text: "Ya no me importa como me veo.", points: 8, icon: "ArrowDown" },
      { id: "e", text: "No me bano, no como, no me arreglo.", points: 10, icon: "XCircle" },
    ],
  },

  // ===== BLOQUE 7: NECESIDAD DE CIERRE (q49-q56) =====
  {
    id: "q49",
    title: "Necesidad de cierre emocional",
    context: "Sobre el final de la relacion...",
    options: [
      { id: "a", text: "Tengo cierre completo. He aceptado la realidad.", points: 0, icon: "CheckCircle2" },
      { id: "b", text: "Estoy en proceso de cerrar este capitulo.", points: 3, icon: "Loader" },
      { id: "c", text: "Me cuesta aceptar que termino asi.", points: 5, icon: "CircleDashed" },
      { id: "d", text: "No entiendo por que termino de esa forma.", points: 8, icon: "QuestionMark" },
      { id: "e", text: "Necesito hablar con el para entender.", points: 10, icon: "MessageSquareWarning" },
    ],
  },
  {
    id: "q50",
    title: "Sientes que desperdiciaste tu tiempo",
    context: "Mirando hacia atras...",
    options: [
      { id: "a", text: "Aprendi lecciones valiosas de esa experiencia.", points: 0, icon: "BookOpen" },
      { id: "b", text: "Hubo cosas buenas aunque termino mal.", points: 3, icon: "Scale" },
      { id: "c", text: "Siento que perdi meses o anos.", points: 5, icon: "Clock" },
      { id: "d", text: "Me arrepiento profundamente del tiempo invertido.", points: 8, icon: "RotateCcw" },
      { id: "e", text: "Siento que arruino mi vida y no hay vuelta atras.", points: 10, icon: "XCircle" },
    ],
  },
  {
    id: "q51",
    title: "Has pensado en vengarte",
    context: "Hacerle sentir lo que tu sientes...",
    options: [
      { id: "a", text: "No. La mejor venganza es vivir bien.", points: 0, icon: "Crown" },
      { id: "b", text: "Lo pense pero no vale la pena.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "A veces fantaseo con que sufra.", points: 5, icon: "Flame" },
      { id: "d", text: "He hecho cosas para provocarle celos.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "Planeo activamente como hacerlo sufrir.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q52",
    title: "Mantienes esperanza de que cambie",
    context: "Sobre su personalidad...",
    options: [
      { id: "a", text: "Las personas no cambian si no quieren.", points: 0, icon: "Eye" },
      { id: "b", text: "Se que es improbable pero no imposible.", points: 3, icon: "Scale" },
      { id: "c", text: "Creo que con la persona correcta cambiaria.", points: 5, icon: "Heart" },
      { id: "d", text: "Creo que yo puedo ser quien lo cambie.", points: 8, icon: "Sparkles" },
      { id: "e", text: "Estoy segura de que cambiara por mi.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q53",
    title: "Te sientes adicta a la relacion",
    context: "Como una dependencia...",
    options: [
      { id: "a", text: "No. Fue una etapa que ya supere.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "A veces siento un 'tiron' pero lo controlo.", points: 3, icon: "Lock" },
      { id: "c", text: "Reconozco que hay cierta adiccion.", points: 5, icon: "AlertTriangle" },
      { id: "d", text: "Es como una droga. Se que me hace mal pero lo busco.", points: 8, icon: "Flame" },
      { id: "e", text: "Estoy completamente adicta. No puedo dejarlo.", points: 10, icon: "XCircle" },
    ],
  },
  {
    id: "q54",
    title: "Has pensado en hacerte dano",
    context: "En los momentos mas oscuros...",
    options: [
      { id: "a", text: "Nunca. Mi bienestar es prioridad.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "He tenido momentos tristes pero no llego a eso.", points: 3, icon: "Heart" },
      { id: "c", text: "He tenido pensamientos oscuros pasajeros.", points: 5, icon: "CloudRain" },
      { id: "d", text: "He pensado seriamente en ello.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "He intentado o planeo hacerlo.", points: 10, icon: "CircleAlert" },
    ],
  },
  {
    id: "q55",
    title: "Puedes imaginar tu futuro sin el",
    context: "Tu vida a largo plazo...",
    options: [
      { id: "a", text: "Tengo planes claros. Mi futuro no lo incluye.", points: 0, icon: "Sun" },
      { id: "b", text: "Estoy construyendo una vision propia.", points: 3, icon: "TrendingUp" },
      { id: "c", text: "Me cuesta imaginar el futuro sin el.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "No veo un futuro sin el en mi vida.", points: 8, icon: "Frown" },
      { id: "e", text: "Sin el no tiene sentido seguir adelante.", points: 10, icon: "Droplet" },
    ],
  },
  {
    id: "q56",
    title: "Nivel de control sobre tus emociones",
    context: "Cuando sientes el impulso de buscarlo...",
    options: [
      { id: "a", text: "Tengo autocontrol total. No me tiembla el pulso.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Siento el impulso pero logro frenarlo.", points: 3, icon: "Lock" },
      { id: "c", text: "A veces gana el impulso y cedo.", points: 5, icon: "Shuffle" },
      { id: "d", text: "Casi siempre pierdo contra el impulso.", points: 8, icon: "Flame" },
      { id: "e", text: "No tengo control. Actuo por pura emocion.", points: 10, icon: "AlertCircle" },
    ],
  },

  // ===== BLOQUE 8: PATRON DE MANIPULACION (q57-q60) =====
  {
    id: "q57",
    title: "Reconoces cuando te manipula",
    context: "Tecnicas como gaslighting, love bombing...",
    options: [
      { id: "a", text: "Detecto cada tactica al instante.", points: 0, icon: "Eye" },
      { id: "b", text: "Reconozco la mayoria despues de analizar.", points: 3, icon: "Search" },
      { id: "c", text: "A veces me doy cuenta tarde.", points: 5, icon: "Clock" },
      { id: "d", text: "Casi nunca me doy cuenta hasta que alguien me lo dice.", points: 8, icon: "HelpCircle" },
      { id: "e", text: "No creo que me manipule. El me quiere a su manera.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q58",
    title: "Justificas su comportamiento toxico",
    context: "Cuando te trata mal...",
    options: [
      { id: "a", text: "No hay excusa para el maltrato.", points: 0, icon: "Ban" },
      { id: "b", text: "Entiendo sus razones pero no las acepto.", points: 3, icon: "Eye" },
      { id: "c", text: "A veces lo justifico por su pasado o estres.", points: 5, icon: "Heart" },
      { id: "d", text: "Siempre encuentro una razon para perdonarlo.", points: 8, icon: "RefreshCw" },
      { id: "e", text: "Creo que lo merezco o que es normal.", points: 10, icon: "AlertCircle" },
    ],
  },
  {
    id: "q59",
    title: "Sientes miedo de estar sola",
    context: "La soledad despues de el...",
    options: [
      { id: "a", text: "Disfruto mi propia compania.", points: 0, icon: "Sun" },
      { id: "b", text: "Me siento bien sola la mayor parte del tiempo.", points: 3, icon: "Feather" },
      { id: "c", text: "La soledad me incomoda a veces.", points: 5, icon: "Cloud" },
      { id: "d", text: "Tengo mucho miedo de quedarme sola.", points: 8, icon: "AlertTriangle" },
      { id: "e", text: "Prefiero estar mal acompanada que sola.", points: 10, icon: "Frown" },
    ],
  },
  {
    id: "q60",
    title: "Has buscado ayuda profesional",
    context: "Terapia, psicologo, grupos de apoyo...",
    options: [
      { id: "a", text: "Si, y me ha ayudado enormemente.", points: 0, icon: "ShieldCheck" },
      { id: "b", text: "Estoy considerandolo seriamente.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "Se que deberia pero no lo he hecho.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "No creo que necesite ayuda profesional.", points: 8, icon: "X" },
      { id: "e", text: "No creo que nada pueda ayudarme.", points: 10, icon: "Droplet" },
    ],
  },
];

// Select 15 random questions from the pool
export function selectQuizQuestions(count: number = 15): QuizQuestion[] {
  const shuffled = [...QUIZ_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

// Keep backward compatibility
export const QUIZ_QUESTIONS = QUIZ_POOL;
