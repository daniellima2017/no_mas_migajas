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

export const QUIZ_QUESTIONS: QuizQuestion[] = [
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
    id: "q3",
    title: "Interaccion con objetos relacionados",
    context: "Fotos, regalos, mensajes antiguos...",
    options: [
      { id: "a", text: "Todo eliminado. No guardo nada.", points: 0, icon: "Trash2" },
      { id: "b", text: "Guarde algo, pero no lo busco.", points: 3, icon: "Archive" },
      { id: "c", text: "A veces reviso fotos o mensajes viejos.", points: 5, icon: "Image" },
      { id: "d", text: "Tengo carpetas organizadas de recuerdos.", points: 8, icon: "FolderOpen" },
      { id: "e", text: "Los reviso constantemente, casi como un ritual.", points: 10, icon: "Heart" },
    ],
  },
  {
    id: "q4",
    title: "Reaccion ante un mensaje suyo",
    context: "Si el te escribiera ahora...",
    options: [
      { id: "a", text: "No responderia. Ya cierre ese capitulo.", points: 0, icon: "X" },
      { id: "b", text: "Dudaria, pero probablemente no responderia.", points: 3, icon: "HelpCircle" },
      { id: "c", text: "Sentiria curiosidad, quiza responderia.", points: 5, icon: "MessageCircle" },
      { id: "d", text: "Mi corazon se aceleraria. Casi seguro responderia.", points: 8, icon: "Zap" },
      { id: "e", text: "Siento que lo necesitaria. Respondere de inmediato.", points: 10, icon: "Sparkles" },
    ],
  },
  {
    id: "q5",
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
    id: "q6",
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
    id: "q7",
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
  {
    id: "q8",
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
    id: "q9",
    title: "Suenos o pesadillas sobre el",
    context: "Por las noches...",
    options: [
      { id: "a", text: "No sueno con el. Mi mente descansa.", points: 0, icon: "Moon" },
      { id: "b", text: "Muy rara vez aparece en mis suenos.", points: 3, icon: "CloudMoon" },
      { id: "c", text: "Aparece ocasionalmente en mis suenos.", points: 5, icon: "Dream" },
      { id: "d", text: "Sueno con el frecuentemente.", points: 8, icon: "Bed" },
      { id: "e", text: "Tengo pesadillas recurrentes sobre el o nosotros.", points: 10, icon: "Skull" },
    ],
  },
  {
    id: "q10",
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
    id: "q11",
    title: "Expectativas de reconciliacion",
    context: "En el fondo de tu mente...",
    options: [
      { id: "a", text: "No quiero volver. Se que es toxico.", points: 0, icon: "Ban" },
      { id: "b", text: "Se que no deberia, pero a veces lo imagino.", points: 3, icon: "Lightbulb" },
      { id: "c", text: "Mantengo una pequena esperanza.", points: 5, icon: "Candle" },
      { id: "d", text: "Creo que todavia hay posibilidades.", points: 8, icon: "Sparkle" },
      { id: "e", text: "Estoy convencida de que volveremos.", points: 10, icon: "Infinite" },
    ],
  },
  {
    id: "q12",
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
    id: "q13",
    title: "Justificaciones sobre la relacion",
    context: "Cuando piensas en lo que paso...",
    options: [
      { id: "a", text: "Veo claramente los problemas. No habia futuro.", points: 0, icon: "Eye" },
      { id: "b", text: "Entiendo la mayoria de las fallas.", points: 3, icon: "BookOpen" },
      { id: "c", text: "Todavia me confundo con algunas cosas.", points: 5, icon: "HelpCircle" },
      { id: "d", text: "Creo que podria haber funcionado de otra forma.", points: 8, icon: "RotateCcw" },
      { id: "e", text: "Piens que todo fue culpa mia o circunstancial.", points: 10, icon: "CircleAlert" },
    ],
  },
  {
    id: "q14",
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
    id: "q15",
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
];