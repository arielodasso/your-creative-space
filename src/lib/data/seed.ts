import type {
  Activity,
  AgencyEvent,
  Club,
  Communication,
  Contact,
  DocumentItem,
  Negotiation,
  Notification,
  Opportunity,
  Player,
  PlayerVideo,
  ScoutingReport,
  Task,
} from "./types";

const DEMO_VIDEO = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
];

const v = (
  id: string,
  title: string,
  category: PlayerVideo["category"],
  duration: string,
  date: string,
  extra: Partial<PlayerVideo> = {},
): PlayerVideo => {
  const index = (id.charCodeAt(0) + id.length) % DEMO_VIDEO.length;
  return { id, title, category, duration, url: DEMO_VIDEO[index] ?? DEMO_VIDEO[0]!, date, ...extra };
};

// ============ CLUBES (12, todos ficticios) ============
export const clubs: Club[] = [
  { id: "atletico-del-plata", name: "Atlético del Plata", country: "Argentina", city: "Puerto Mayor", league: "Liga Meridional", relation: "Cliente", interestLevel: 5, initials: "AP", colors: ["#3b1170", "#6d28d9"], notes: "Club formador de varios representados. Relación institucional consolidada." },
  { id: "cd-central", name: "Club Deportivo Central", country: "Argentina", city: "Villa Aurora", league: "Liga Meridional", relation: "Relación activa", interestLevel: 4, initials: "CC", colors: ["#0f2a5c", "#3b82f6"], notes: "Interés histórico en juveniles ofensivos." },
  { id: "sporting-del-sur", name: "Sporting del Sur", country: "Argentina", city: "Bahía Serena", league: "Liga Meridional", relation: "Relación activa", interestLevel: 4, initials: "SS", colors: ["#7f1d1d", "#ef4444"], notes: "Buena disposición para préstamos con opción." },
  { id: "atletico-horizonte", name: "Atlético Horizonte", country: "Argentina", city: "Horizonte", league: "Liga Meridional", relation: "Contactado", interestLevel: 4, initials: "AH", colors: ["#134e4a", "#14b8a6"], notes: "Buscan un mediocampista ofensivo para el próximo mercado." },
  { id: "real-monteverde", name: "Real Monteverde", country: "Uruguay", city: "Monteverde", league: "Primera División Oriental", relation: "Cliente", interestLevel: 5, initials: "RM", colors: ["#14532d", "#22c55e"], notes: "Dos representados en plantel. Comunicación fluida con secretaría técnica." },
  { id: "defensor-litoral", name: "Defensor del Litoral", country: "Uruguay", city: "Costa del Este", league: "Primera División Oriental", relation: "Contactado", interestLevel: 3, initials: "DL", colors: ["#1e293b", "#94a3b8"], notes: "Pidieron informes de defensores sub-23." },
  { id: "deportivo-costa-brava", name: "Deportivo Costa Brava", country: "Chile", city: "Puerto Brava", league: "Liga del Pacífico", relation: "Cliente", interestLevel: 4, initials: "CB", colors: ["#7c2d12", "#f97316"], notes: "Club de Valentín Roldán. Abiertos a vender con recompra." },
  { id: "union-andina", name: "Unión Andina", country: "Chile", city: "Valle Alto", league: "Liga del Pacífico", relation: "Prospecto", interestLevel: 2, initials: "UA", colors: ["#78350f", "#fbbf24"], notes: "Primer acercamiento pendiente." },
  { id: "cd-mar-de-luz", name: "CD Mar de Luz", country: "España", city: "Mar de Luz", league: "Segunda Federación", relation: "Relación activa", interestLevel: 4, initials: "ML", colors: ["#0c4a6e", "#38bdf8"], notes: "Puerta de entrada a Europa para juveniles. Convenio de colaboración en discusión." },
  { id: "atletico-vega-real", name: "Atlético Vega Real", country: "España", city: "Vega Real", league: "Primera Federación", relation: "Contactado", interestLevel: 3, initials: "VR", colors: ["#4c1d95", "#a78bfa"], notes: "Interesados en perfiles de extremo desequilibrante." },
  { id: "estrela-atlantico", name: "Estrela do Atlântico", country: "Portugal", city: "Ponta Serena", league: "Liga Atlântica 2", relation: "Relación activa", interestLevel: 4, initials: "EA", colors: ["#164e63", "#22d3ee"], notes: "Histórico comprador de talento sudamericano." },
  { id: "ac-pontenuovo", name: "AC Pontenuovo", country: "Italia", city: "Pontenuovo", league: "Serie C Federale", relation: "Prospecto", interestLevel: 2, initials: "PN", colors: ["#111827", "#d4af37"], notes: "Contacto vía abogado deportivo. Evaluar en ventana invernal." },
];

// ============ JUGADORES (8) ============
export const players: Player[] = [
  {
    id: "mateo-ferrer", name: "Mateo Ferrer", position: "Mediocampista ofensivo", positionShort: "MCO",
    age: 21, birthDate: "12/03/2004", height: "1,76 m", nationality: "Argentina", foot: "Derecho",
    clubId: "atletico-del-plata", number: 10, status: "Transferible", contractEnd: "30/06/2027",
    marketValue: "USD 2.8M", photo: "mateo-ferrer", agent: "Martín Solari",
    bio: "Formado en las inferiores de Atlético del Plata, debutó en primera a los 18 años. Se consolidó como el generador de juego del equipo y capitán del seleccionado juvenil ficticio del Litoral.",
    profile: "Mediocampista creativo de último pase, excelente visión y conducción en espacios cortos. Fuerte en pelota parada.",
    traits: ["Último pase", "Visión de juego", "Pelota parada", "Conducción", "Liderazgo"],
    achievements: ["Mejor jugador juvenil Liga Meridional 2023", "Campeón Copa Ciudad de Puerto Mayor 2024"],
    stats: [
      { season: "2023", matches: 24, minutes: 1730, goals: 3, assists: 5, yellowCards: 2, redCards: 0, starts: 18 },
      { season: "2024", matches: 31, minutes: 2610, goals: 7, assists: 11, yellowCards: 3, redCards: 0, starts: 29 },
      { season: "2025", matches: 28, minutes: 2390, goals: 9, assists: 12, yellowCards: 4, redCards: 1, starts: 27 },
    ],
    history: [
      { clubId: "atletico-del-plata", period: "2022 — Actualidad", category: "Primera División" },
      { clubId: "atletico-del-plata", period: "2015 — 2022", category: "Formativas" },
    ],
    videos: [
      v("mf-v1", "Highlights completos — Temporada 2025", "Highlights", "8:24", "2026-08-01", { featured: true, description: "Goles, asistencias y construcciones de juego de la temporada 2025." }),
      v("mf-v2", "Asistencias y último pase 2025", "Highlights", "4:12", "2026-07-10", { description: "Compilado de pases de gol y habilitaciones." }),
      v("mf-v3", "Pelota parada: tiros libres y corners", "Skills", "3:05", "2026-06-18", { description: "Ejecuciones de tiros libres, corners y jugadas elaboradas." }),
      v("mf-v4", "Entrevista: «El 10 del Litoral»", "Entrevista", "6:40", "2026-05-20", { description: "Conversación sobre su presente, liderazgo y proyección." }),
      v("mf-v5", "Detrás de escena: pretemporada", "Detrás de escena", "5:18", "2026-02-12", { description: "Trabajo de pretemporada con el plantel de Atlético del Plata." }),
    ],
    nextAction: "Enviar portfolio a Atlético Horizonte",
    internalNotes: "Cláusula de salida del 15% sobre plusvalía. Familia prioriza salto a Europa en 2026.",
    planning: { short: "Cerrar transferencia a club de mayor exposición", mid: "Consolidarse en liga europea secundaria", long: "Salto a liga top-5 de Europa", actions: ["Enviar portfolio a 5 clubes", "Preparar showcase en Buenos Aires", "Actualizar video de highlights"] },
  },
  {
    id: "luca-bianchi", name: "Luca Bianchi", position: "Extremo derecho", positionShort: "ED",
    age: 19, birthDate: "04/08/2006", height: "1,72 m", nationality: "Argentina", foot: "Izquierdo",
    clubId: "cd-central", number: 7, status: "En desarrollo", contractEnd: "31/12/2026",
    marketValue: "USD 1.4M", photo: "luca-bianchi", agent: "Lucía Menéndez",
    bio: "Extremo eléctrico surgido del semillero de Deportivo Central. Debut profesional a los 17. Perfil de desequilibrio puro por banda derecha a pierna cambiada.",
    profile: "Velocidad y regate en uno contra uno. Busca el remate de media distancia entrando desde la derecha.",
    traits: ["Regate", "Velocidad", "Uno contra uno", "Remate de media distancia"],
    achievements: ["Goleador Torneo Juvenil Costa 2024"],
    stats: [
      { season: "2024", matches: 18, minutes: 940, goals: 4, assists: 3, yellowCards: 1, redCards: 0, starts: 9 },
      { season: "2025", matches: 29, minutes: 1980, goals: 8, assists: 7, yellowCards: 2, redCards: 0, starts: 21 },
    ],
    history: [
      { clubId: "cd-central", period: "2023 — Actualidad", category: "Primera División" },
      { clubId: "cd-central", period: "2017 — 2023", category: "Formativas" },
    ],
    videos: [
      v("lb-v1", "Highlights 2025 — Regates y desbordes", "Highlights", "7:10", "2026-08-05", { featured: true, description: "Desbordes, regates y centros de la temporada 2025." }),
      v("lb-v2", "Goles de la temporada 2025", "Goles", "3:48", "2026-07-25", { description: "Todos los goles convertidos en la temporada pasada." }),
      v("lb-v3", "Skills: velocidad y uno contra uno", "Skills", "4:30", "2026-06-30", { description: "Ritmo y perfil zurdo entrando desde la derecha." }),
      v("lb-v4", "Entrevista: proyección europea", "Entrevista", "5:52", "2026-04-14", { description: "El extremo habla de su objetivo de dar el salto." }),
      v("lb-v5", "Detrás de escena: entrenamiento", "Detrás de escena", "4:06", "2026-03-02", { description: "Rutinas de entrenamiento y fortaleza física." }),
    ],
    nextAction: "Seguimiento físico y plan de fuerza",
    internalNotes: "Renovación prioritaria: contrato vence fin de 2026. Interés de Vega Real.",
    planning: { short: "Renovar contrato con mejora de cláusula", mid: "Consolidarse como titular y llegar a 10 goles", long: "Transferencia a Portugal o España", actions: ["Reunión con dirigencia de Central", "Contactar Estrela do Atlântico", "Plan físico personalizado"] },
  },
  {
    id: "thiago-duarte", name: "Thiago Duarte", position: "Defensor central", positionShort: "DFC",
    age: 22, birthDate: "27/01/2003", height: "1,88 m", nationality: "Uruguay", foot: "Derecho",
    clubId: "real-monteverde", number: 2, status: "Activo", contractEnd: "30/06/2028",
    marketValue: "USD 2.1M", photo: "thiago-duarte", agent: "Martín Solari",
    bio: "Central dominante por arriba y con buena salida. Referente defensivo de Real Monteverde pese a su juventud. Capitán en varios partidos de la última temporada.",
    profile: "Marcador central fuerte en el duelo aéreo, ordena la línea y sale jugando con criterio.",
    traits: ["Juego aéreo", "Marcaje", "Salida limpia", "Liderazgo defensivo"],
    achievements: ["Equipo ideal Liga Oriental 2024", "Campeón Torneo Clausura Oriental 2024"],
    stats: [
      { season: "2023", matches: 26, minutes: 2210, goals: 2, assists: 0, yellowCards: 5, redCards: 0, starts: 25 },
      { season: "2024", matches: 33, minutes: 2950, goals: 3, assists: 1, yellowCards: 6, redCards: 1, starts: 33 },
      { season: "2025", matches: 30, minutes: 2680, goals: 2, assists: 2, yellowCards: 4, redCards: 0, starts: 30 },
    ],
    history: [
      { clubId: "real-monteverde", period: "2021 — Actualidad", category: "Primera División" },
      { clubId: "defensor-litoral", period: "2018 — 2021", category: "Formativas" },
    ],
    videos: [
      v("td-v1", "Compilado defensivo 2025", "Highlights", "6:55", "2026-08-10", { featured: true, description: "Cortes, duelos aéreos y salidas de la temporada." }),
      v("td-v2", "Duelos aéreos y anticipaciones", "Highlights", "4:20", "2026-07-15", { description: "Fortaleza en el juego aéreo y lectura de juego." }),
      v("td-v3", "Salida con pelota: inicio de juego", "Rendimiento", "3:32", "2026-06-22", { description: "Construcción desde el fondo y habilitaciones largas." }),
      v("td-v4", "Gol de cabeza vs. Defensor del Litoral", "Goles", "1:15", "2026-05-08", { description: "Cabezazo clave en el área rival." }),
      v("td-v5", "Entrevista: el liderazgo atrás", "Entrevista", "7:02", "2026-03-18", { description: "Referente defensivo pese a su juventud." }),
    ],
    nextAction: "Preparar presentación para clubes de España",
    internalNotes: "Objetivo: España 2026. Mar de Luz ya pidió informes completos.",
    planning: { short: "Showcase ante clubes españoles", mid: "Transferencia a Segunda Federación o similar", long: "Consolidación en liga profesional europea", actions: ["Compilar informes defensivos", "Coordinar visita de Mar de Luz", "Video de duelos aéreos"] },
  },
  {
    id: "nicolas-rivas", name: "Nicolás Rivas", position: "Delantero centro", positionShort: "DC",
    age: 20, birthDate: "15/06/2005", height: "1,83 m", nationality: "Argentina", foot: "Derecho",
    clubId: "sporting-del-sur", number: 9, status: "Activo", contractEnd: "31/12/2027",
    marketValue: "USD 1.9M", photo: "nicolas-rivas", agent: "Rodrigo Paiva",
    bio: "Nueve de área con instinto goleador. Llegó a Sporting del Sur desde las formativas de Horizonte y explotó en la última temporada con doble dígito de goles.",
    profile: "Finalizador dentro del área, ataca bien el primer palo y define con ambas piernas.",
    traits: ["Definición", "Juego de espaldas", "Ataque al espacio", "Cabeceo"],
    achievements: ["Goleador Sporting del Sur 2025"],
    stats: [
      { season: "2024", matches: 21, minutes: 1120, goals: 6, assists: 1, yellowCards: 2, redCards: 0, starts: 11 },
      { season: "2025", matches: 32, minutes: 2540, goals: 14, assists: 3, yellowCards: 3, redCards: 0, starts: 28 },
    ],
    history: [
      { clubId: "sporting-del-sur", period: "2024 — Actualidad", category: "Primera División" },
      { clubId: "atletico-horizonte", period: "2016 — 2024", category: "Formativas" },
    ],
    videos: [
      v("nr-v1", "Highlights 2025 — Goles y definiciones", "Highlights", "7:40", "2026-08-12", { featured: true, description: "Los 14 goles de la temporada y jugadas de riesgo." }),
      v("nr-v2", "Todos los goles de la temporada", "Goles", "5:10", "2026-07-30", { description: "Compilado completo de conquistas del 2025." }),
      v("nr-v3", "Skills: definición y cabezazo", "Skills", "3:58", "2026-06-25", { description: "Asocia, ataca el primer palo y define con ambas piernas." }),
      v("nr-v4", "Rendimiento vs. CD Central", "Rendimiento", "4:44", "2026-04-22", { description: "Actuación delantero centro en el clásico." }),
      v("nr-v5", "Entrevista: goleador de Sporting", "Entrevista", "6:15", "2026-03-06", { description: "El nueve habla de su explosión goleadora." }),
    ],
    nextAction: "Registrar comunicación con scout de Pontenuovo",
    internalNotes: "Pontenuovo lo observó dos veces. Mantener perfil bajo hasta fin de temporada.",
    planning: { short: "Sostener promedio goleador", mid: "Préstamo con opción a liga de mayor nivel", long: "Venta con porcentaje de plusvalía", actions: ["Seguimiento estadístico mensual", "Contacto periódico con Pontenuovo"] },
  },
  {
    id: "juan-sosa", name: "Juan Ignacio Sosa", position: "Volante central", positionShort: "MC",
    age: 23, birthDate: "09/11/2002", height: "1,79 m", nationality: "Argentina", foot: "Derecho",
    clubId: "atletico-del-plata", number: 5, status: "Activo", contractEnd: "30/06/2026",
    marketValue: "USD 1.6M", photo: "juan-sosa", agent: "Lucía Menéndez",
    bio: "Mediocampista de equilibrio, recuperador y primer pase. Pieza táctica indiscutible en Atlético del Plata.",
    profile: "Volante mixto con gran lectura táctica, recupera y distribuye con criterio.",
    traits: ["Recuperación", "Pase corto", "Lectura táctica", "Cobertura"],
    achievements: ["Campeón Copa Ciudad de Puerto Mayor 2024"],
    stats: [
      { season: "2024", matches: 30, minutes: 2480, goals: 1, assists: 4, yellowCards: 7, redCards: 0, starts: 28 },
      { season: "2025", matches: 27, minutes: 2300, goals: 2, assists: 5, yellowCards: 5, redCards: 0, starts: 26 },
    ],
    history: [
      { clubId: "atletico-del-plata", period: "2020 — Actualidad", category: "Primera División" },
      { clubId: "atletico-del-plata", period: "2014 — 2020", category: "Formativas" },
    ],
    videos: [
      v("js-v1", "Highlights 2025 — Recuperación y pase", "Highlights", "6:20", "2026-08-08", { featured: true, description: "Recuperaciones, coberturas y distribución de juego." }),
      v("js-v2", "Rendimiento táctico: coberturas", "Rendimiento", "4:35", "2026-07-20", { description: "Lectura táctica y trabajo sin pelota." }),
      v("js-v3", "Primer pase y distribución", "Highlights", "3:15", "2026-06-28", { description: "Pase corto y salida limpia desde el mediocampo." }),
      v("js-v4", "Detrás de escena: análisis de partido", "Detrás de escena", "5:25", "2026-04-02", { description: "Revisión en video con el cuerpo técnico." }),
    ],
    nextAction: "Iniciar conversación de renovación",
    internalNotes: "Contrato vence junio 2026: alerta de renovación activa.",
    planning: { short: "Renovar o definir salida antes de junio", mid: "Consolidarse como referente del mediocampo", long: "Llegar a seleccionado ficticio mayor", actions: ["Reunión con presidente del Plata", "Evaluar ofertas de Chile"] },
  },
  {
    id: "bruno-cabrera", name: "Bruno Cabrera", position: "Arquero", positionShort: "ARQ",
    age: 24, birthDate: "22/04/2001", height: "1,91 m", nationality: "Uruguay", foot: "Derecho",
    clubId: "real-monteverde", number: 1, status: "Activo", contractEnd: "30/06/2028",
    marketValue: "USD 1.2M", photo: "bruno-cabrera", agent: "Rodrigo Paiva",
    bio: "Arquero titular de Real Monteverde. Grandes reflejos y seguridad en el juego de pies. Valla menos vencida de la Liga Oriental 2024.",
    profile: "Arquero de reflejos rápidos, dominante en salidas y cómodo con los pies.",
    traits: ["Reflejos", "Juego de pies", "Uno contra uno", "Salidas"],
    achievements: ["Valla menos vencida Liga Oriental 2024"],
    stats: [
      { season: "2024", matches: 34, minutes: 3060, goals: 0, assists: 0, yellowCards: 1, redCards: 0, starts: 34 },
      { season: "2025", matches: 31, minutes: 2790, goals: 0, assists: 1, yellowCards: 2, redCards: 0, starts: 31 },
    ],
    history: [
      { clubId: "real-monteverde", period: "2019 — Actualidad", category: "Primera División" },
    ],
    videos: [
      v("bc-v1", "Highlights de atajadas 2025", "Highlights", "6:48", "2026-08-15", { featured: true, description: "Atajadas claves de la valla menos vencida de la liga." }),
      v("bc-v2", "Atajadas de penales", "Atajadas", "2:55", "2026-07-18", { description: "Penales atajados y réplicas en los mano a mano." }),
      v("bc-v3", "Juego de pies: salidas y distribución", "Rendimiento", "3:42", "2026-06-10", { description: "Salidas aéreos, juego corto y con los pies." }),
      v("bc-v4", "Entrevista: seguridad bajo los tres palos", "Entrevista", "6:05", "2026-03-25", { description: "El arquero repasa su evolución y objetivos." }),
    ],
    nextAction: "Actualizar video de atajadas",
    internalNotes: "Interés de Costa Brava como reemplazo a futuro.",
    planning: { short: "Mantener nivel y vallas invictas", mid: "Salto a liga de mayor competitividad", long: "Arquero titular en Europa", actions: ["Video actualizado de atajadas", "Informe de penales atajados"] },
  },
  {
    id: "diego-antunez", name: "Diego Antúnez", position: "Lateral izquierdo", positionShort: "LI",
    age: 18, birthDate: "30/09/2007", height: "1,74 m", nationality: "Argentina", foot: "Izquierdo",
    clubId: "cd-central", number: 3, status: "En evaluación", contractEnd: "31/12/2028",
    marketValue: "USD 800K", photo: "diego-antunez", agent: "Martín Solari",
    bio: "Lateral juvenil de gran proyección, recién incorporado al plantel profesional de Central. Recorrido constante por la banda izquierda.",
    profile: "Lateral ofensivo de ida y vuelta, buen centro y mucha repetición de esfuerzo.",
    traits: ["Proyección", "Centro", "Resistencia", "Marca individual"],
    achievements: ["Campeón Torneo Juvenil Costa 2024"],
    stats: [
      { season: "2025", matches: 12, minutes: 640, goals: 0, assists: 2, yellowCards: 1, redCards: 0, starts: 6 },
    ],
    history: [
      { clubId: "cd-central", period: "2025 — Actualidad", category: "Primera División" },
      { clubId: "cd-central", period: "2019 — 2025", category: "Formativas" },
    ],
    videos: [
      v("da-v1", "Highlights 2025 — Proyección y centros", "Highlights", "5:30", "2026-08-18", { featured: true, description: "Recorrido, centros y proyección ofensiva del lateral." }),
      v("da-v2", "Centros y asistencias", "Highlights", "3:20", "2026-07-22", { description: "Centros precisos y asistencias en el último tramo." }),
      v("da-v3", "Skills: recorrido y marca 1vs1", "Skills", "3:05", "2026-06-14", { description: "Amplitud, repetición de esfuerzo y marca individual." }),
      v("da-v4", "Detrás de escena: debut en primera", "Detrás de escena", "4:50", "2026-02-28", { description: "El juvenil recuerda su incorporación al plantel profesional." }),
    ],
    nextAction: "Evaluar préstamo para sumar minutos",
    internalNotes: "Prioridad: minutos de competencia. Un préstamo a Sporting del Sur es una opción.",
    planning: { short: "Sumar 800+ minutos en primera", mid: "Titular indiscutido en Central", long: "Salto al exterior antes de los 22", actions: ["Evaluar opciones de préstamo", "Plan de desarrollo físico"] },
  },
  {
    id: "valentin-roldan", name: "Valentín Roldán", position: "Volante central", positionShort: "MC",
    age: 25, birthDate: "17/02/2000", height: "1,80 m", nationality: "Chile", foot: "Ambidiestro",
    clubId: "deportivo-costa-brava", number: 8, status: "Transferible", contractEnd: "31/12/2026",
    marketValue: "USD 1.1M", photo: "valentin-roldan", agent: "Lucía Menéndez",
    bio: "Volante chileno con pasado en formativas de Puerto Brava. Jugador de equipo, tácticamente disciplinado y con llegada desde segunda línea.",
    profile: "Mediocampista completo, ambidiestro, con buena llegada y sacrificio defensivo.",
    traits: ["Ambidiestro", "Llegada al área", "Presión alta", "Disciplina táctica"],
    achievements: ["Campeón Copa del Pacífico 2023"],
    stats: [
      { season: "2024", matches: 29, minutes: 2310, goals: 4, assists: 3, yellowCards: 6, redCards: 0, starts: 26 },
      { season: "2025", matches: 26, minutes: 2050, goals: 3, assists: 4, yellowCards: 4, redCards: 1, starts: 23 },
    ],
    history: [
      { clubId: "deportivo-costa-brava", period: "2019 — Actualidad", category: "Primera División" },
      { clubId: "union-andina", period: "2015 — 2019", category: "Formativas" },
    ],
    videos: [
      v("vr-v1", "Highlights 2025 — Llegada al área", "Highlights", "6:10", "2026-08-06", { featured: true, description: "Llegada desde segunda línea y juego de equipo." }),
      v("vr-v2", "Goles desde segunda línea", "Goles", "3:00", "2026-07-12", { description: "Anotaciones entrando desde el mediocampo." }),
      v("vr-v3", "Rendimiento: presión alta", "Rendimiento", "3:55", "2026-06-08", { description: "Presión, sacrificio defensivo y recuperaciones." }),
      v("vr-v4", "Entrevista: ambidiestro en el medio", "Entrevista", "6:30", "2026-04-30", { description: "El chileno repasa su presente y el mercado." }),
    ],
    nextAction: "Gestionar oferta de Unión Andina",
    internalNotes: "Costa Brava abierto a vender con recompra. Contrato hasta fin de 2026.",
    planning: { short: "Resolver transferencia en próxima ventana", mid: "Consolidarse en nuevo club", long: "Retorno a Costa Brava o salto regional", actions: ["Negociar con Unión Andina", "Definir comisión y plusvalía"] },
  },
];

// ============ CONTACTOS (20) ============
export const contacts: Contact[] = [
  { id: "c01", name: "Federico Alsina", role: "Director Deportivo", type: "Director deportivo", clubId: "atletico-horizonte", email: "f.alsina@athorizonte.demo", phone: "+54 9 11 5555 0101", country: "Argentina", lastContact: "2026-09-10", nextAction: "Enviar portfolio de Mateo Ferrer", notes: "Muy interesado en mediocampistas creativos. Prefiere comunicación por email." },
  { id: "c02", name: "Mariana Paredes", role: "Jefa de Scouting", type: "Scouting", clubId: "cd-mar-de-luz", email: "mparedes@mardeluz.demo", phone: "+34 655 555 102", country: "España", lastContact: "2026-09-08", nextAction: "Compartir informes de Thiago Duarte", notes: "Pidió informes defensivos completos con video." },
  { id: "c03", name: "Gonzalo Pereyra", role: "Presidente", type: "Presidente", clubId: "atletico-del-plata", email: "presidencia@atleticodelplata.demo", phone: "+54 9 11 5555 0103", country: "Argentina", lastContact: "2026-09-02", nextAction: "Reunión por renovación de Sosa", notes: "Relación directa y fluida. Negociador duro pero transparente." },
  { id: "c04", name: "Sofía Larraín", role: "Directora Deportiva", type: "Director deportivo", clubId: "union-andina", email: "slarrain@unionandina.demo", phone: "+56 9 5555 0104", country: "Chile", lastContact: "2026-09-12", nextAction: "Llamada por Valentín Roldán", notes: "Quiere avanzar rápido en la próxima ventana." },
  { id: "c05", name: "Ernesto Vidal", role: "Secretario Técnico", type: "Director deportivo", clubId: "real-monteverde", email: "evidal@realmonteverde.demo", phone: "+598 99 555 105", country: "Uruguay", lastContact: "2026-09-05", nextAction: "Seguimiento trimestral de jugadores", notes: "Solicita reportes de estado cada 3 meses." },
  { id: "c06", name: "Paulo Esteves", role: "Director Deportivo", type: "Director deportivo", clubId: "estrela-atlantico", email: "pesteves@estrela.demo", phone: "+351 955 555 106", country: "Portugal", lastContact: "2026-08-28", nextAction: "Presentar a Luca Bianchi", notes: "Histórico comprador en Sudamérica. Buscan extremos." },
  { id: "c07", name: "Giulia Ferretti", role: "Abogada deportiva", type: "Abogado", clubId: "ac-pontenuovo", email: "g.ferretti@pontenuovo.demo", phone: "+39 355 555 107", country: "Italia", lastContact: "2026-09-01", nextAction: "Revisar marco contractual para operación Rivas", notes: "Canal formal de contacto con el club italiano." },
  { id: "c08", name: "Andrés Quito", role: "Entrenador", type: "Entrenador", clubId: "sporting-del-sur", email: "aquito@sportingsur.demo", phone: "+54 9 11 5555 0108", country: "Argentina", lastContact: "2026-09-11", nextAction: "Conversar minutos de Antúnez (préstamo)", notes: "Conoce bien a Antúnez de juveniles." },
  { id: "c09", name: "Verónica Campos", role: "Scout", type: "Scouting", clubId: "atletico-vega-real", email: "vcampos@vegareal.demo", phone: "+34 655 555 109", country: "España", lastContact: "2026-08-25", nextAction: "Enviar video de Bianchi", notes: "Especializada en extremos sub-21." },
  { id: "c10", name: "Héctor Luna", role: "Preparador Físico", type: "Preparador físico", email: "hluna@nexus.demo", phone: "+54 9 11 5555 0110", country: "Argentina", lastContact: "2026-09-09", nextAction: "Plan de fuerza de Bianchi", notes: "Colaborador externo de la agencia." },
  { id: "c11", name: "Daniel Ríos", role: "Periodista", type: "Periodista", email: "drios@portaldeportivo.demo", phone: "+54 9 11 5555 0111", country: "Argentina", lastContact: "2026-08-20", nextAction: "Nota sobre Ferrer post-mercado", notes: "Útil para exposición mediática controlada." },
  { id: "c12", name: "Laura Benítez", role: "Representante", type: "Representante", email: "lbenitez@representaciones.demo", phone: "+598 99 555 112", country: "Uruguay", lastContact: "2026-09-06", nextAction: "Coordinar co-representación en Uruguay", notes: "Contacto para jugadores del medio local." },
  { id: "c13", name: "Martín Solari", role: "Agente Senior", type: "Representante", email: "msolari@nexus.demo", phone: "+54 9 11 5555 0113", country: "Argentina", lastContact: "2026-09-15", nextAction: "Weekly de jugadores", notes: "Agente interno. Lleva a Ferrer, Duarte y Antúnez." },
  { id: "c14", name: "Lucía Menéndez", role: "Agente", type: "Representante", email: "lmenendez@nexus.demo", phone: "+54 9 11 5555 0114", country: "Argentina", lastContact: "2026-09-14", nextAction: "Renovación de Bianchi", notes: "Agente interna. Lleva a Bianchi, Sosa y Roldán." },
  { id: "c15", name: "Rodrigo Paiva", role: "Agente", type: "Representante", email: "rpaiva@nexus.demo", phone: "+55 21 95555 115", country: "Brasil", lastContact: "2026-09-13", nextAction: "Informe de arqueros para Costa Brava", notes: "Agente interno. Lleva a Rivas y Cabrera." },
  { id: "c16", name: "Camila Duarte", role: "Scout", type: "Scouting", email: "cduarte@nexus.demo", phone: "+54 9 11 5555 0116", country: "Argentina", lastContact: "2026-09-12", nextAction: "Informe de juveniles zona sur", notes: "Scout interna de la agencia." },
  { id: "c17", name: "Javier Osorio", role: "Director Deportivo", type: "Director deportivo", clubId: "deportivo-costa-brava", email: "josorio@costabrava.demo", phone: "+56 9 5555 0117", country: "Chile", lastContact: "2026-09-07", nextAction: "Definir condiciones de salida de Roldán", notes: "Abierto a venta con cláusula de recompra." },
  { id: "c18", name: "Tomás Iglesias", role: "Manager General", type: "Director deportivo", clubId: "defensor-litoral", email: "tiglesias@defensorlitoral.demo", phone: "+598 99 555 118", country: "Uruguay", lastContact: "2026-08-30", nextAction: "Enviar perfiles defensivos", notes: "Pidieron informes de defensores sub-23." },
  { id: "c19", name: "Nadia Fernández", role: "Nutricionista", type: "Otro", email: "nfernandez@nexus.demo", phone: "+54 9 11 5555 0119", country: "Argentina", lastContact: "2026-09-03", nextAction: "Plan nutricional de pretemporada", notes: "Consultora externa." },
  { id: "c20", name: "Ricardo Melo", role: "Presidente", type: "Presidente", clubId: "cd-central", email: "rmelo@cdcentral.demo", phone: "+54 9 11 5555 0120", country: "Argentina", lastContact: "2026-09-04", nextAction: "Reunión de renovación de Bianchi", notes: "Relación correcta. Cuidar tiempos de negociación." },
];

// ============ OPORTUNIDADES (15) ============
export const opportunities: Opportunity[] = [
  { id: "op01", playerId: "mateo-ferrer", clubId: "atletico-horizonte", contactId: "c01", type: "Transferencia", date: "2026-09-01", owner: "Martín Solari", estimatedValue: "USD 3.2M", probability: 65, stage: "Negociación", nextAction: "Enviar portfolio actualizado", notes: "Alsina pidió video de la última temporada." },
  { id: "op02", playerId: "thiago-duarte", clubId: "cd-mar-de-luz", contactId: "c02", type: "Transferencia", date: "2026-08-20", owner: "Martín Solari", estimatedValue: "USD 2.5M", probability: 55, stage: "Interés", nextAction: "Compartir informes defensivos", notes: "Mar de Luz lo ve como central titular." },
  { id: "op03", playerId: "luca-bianchi", clubId: "estrela-atlantico", contactId: "c06", type: "Transferencia", date: "2026-09-05", owner: "Lucía Menéndez", estimatedValue: "USD 1.8M", probability: 40, stage: "Contactado", nextAction: "Presentar perfil y video", notes: "Primera presentación formal." },
  { id: "op04", playerId: "valentin-roldan", clubId: "union-andina", contactId: "c04", type: "Transferencia", date: "2026-09-10", owner: "Lucía Menéndez", estimatedValue: "USD 1.3M", probability: 70, stage: "Negociación", nextAction: "Llamada para cerrar condiciones", notes: "Andina quiere cerrar antes de la ventana." },
  { id: "op05", playerId: "nicolas-rivas", clubId: "ac-pontenuovo", contactId: "c07", type: "Transferencia", date: "2026-08-28", owner: "Rodrigo Paiva", estimatedValue: "USD 1.5M", probability: 30, stage: "Nueva", nextAction: "Enviar ficha y estadísticas", notes: "Interés inicial desde Italia." },
  { id: "op06", playerId: "luca-bianchi", clubId: "atletico-vega-real", contactId: "c09", type: "Transferencia", date: "2026-09-02", owner: "Lucía Menéndez", estimatedValue: "USD 1.6M", probability: 35, stage: "Contactado", nextAction: "Enviar video de goles", notes: "Campos lo siguió en dos partidos." },
  { id: "op07", playerId: "diego-antunez", clubId: "sporting-del-sur", contactId: "c08", type: "Préstamo", date: "2026-09-08", owner: "Martín Solari", estimatedValue: "—", probability: 60, stage: "Interés", nextAction: "Definir minutos garantizados", notes: "Préstamo por 12 meses sin cargo." },
  { id: "op08", playerId: "bruno-cabrera", clubId: "deportivo-costa-brava", contactId: "c17", type: "Transferencia", date: "2026-08-15", owner: "Rodrigo Paiva", estimatedValue: "USD 1.4M", probability: 25, stage: "Nueva", nextAction: "Actualizar video de atajadas", notes: "Costa Brava busca arquero a mediano plazo." },
  { id: "op09", playerId: "juan-sosa", clubId: "deportivo-costa-brava", contactId: "c17", type: "Transferencia", date: "2026-07-30", owner: "Lucía Menéndez", estimatedValue: "USD 1.7M", probability: 20, stage: "Perdida", nextAction: "—", notes: "Costa Brava priorizó otras posiciones." },
  { id: "op10", playerId: "mateo-ferrer", clubId: "cd-mar-de-luz", contactId: "c02", type: "Transferencia", date: "2026-06-12", owner: "Martín Solari", estimatedValue: "USD 3.0M", probability: 15, stage: "Perdida", nextAction: "—", notes: "Mar de Luz optó por un perfil defensivo." },
  { id: "op11", playerId: "thiago-duarte", clubId: "defensor-litoral", contactId: "c18", type: "Transferencia", date: "2026-09-03", owner: "Martín Solari", estimatedValue: "USD 2.0M", probability: 30, stage: "Nueva", nextAction: "Enviar perfiles defensivos", notes: "Interés regional de respaldo." },
  { id: "op12", playerId: "juan-sosa", clubId: "atletico-del-plata", contactId: "c03", type: "Renovación", date: "2026-09-09", owner: "Lucía Menéndez", estimatedValue: "USD 1.9M", probability: 75, stage: "Propuesta", nextAction: "Reunión con presidente", notes: "Propuesta de renovación por 2 años sobre la mesa." },
  { id: "op13", playerId: "nicolas-rivas", clubId: "atletico-horizonte", contactId: "c01", type: "Préstamo", date: "2026-09-11", owner: "Rodrigo Paiva", estimatedValue: "USD 400K", probability: 45, stage: "Contactado", nextAction: "Definir opción de compra", notes: "Horizonte quiere préstamo con opción." },
  { id: "op14", playerId: "bruno-cabrera", clubId: "real-monteverde", contactId: "c05", type: "Renovación", date: "2026-05-20", owner: "Rodrigo Paiva", estimatedValue: "USD 1.3M", probability: 100, stage: "Cerrada", nextAction: "—", notes: "Renovado hasta 2028 con mejora salarial." },
  { id: "op15", playerId: "diego-antunez", clubId: "cd-central", contactId: "c20", type: "Prueba", date: "2026-04-10", owner: "Martín Solari", estimatedValue: "—", probability: 100, stage: "Cerrada", nextAction: "—", notes: "Incorporación al plantel profesional confirmada." },
];

// ============ NEGOCIACIONES (8) ============
export const negotiations: Negotiation[] = [
  { id: "n01", playerId: "mateo-ferrer", clubId: "atletico-horizonte", type: "Transferencia", step: "Propuesta", status: "Activa", value: "USD 3.2M", commission: "10%", startDate: "2026-09-01", owner: "Martín Solari", lastUpdate: "2026-09-14", nextAction: "Esperar contraoferta del club" },
  { id: "n02", playerId: "valentin-roldan", clubId: "union-andina", type: "Transferencia", step: "Contraoferta", status: "Activa", value: "USD 1.3M", commission: "8%", startDate: "2026-09-10", owner: "Lucía Menéndez", lastUpdate: "2026-09-15", nextAction: "Responder sobre recompra" },
  { id: "n03", playerId: "juan-sosa", clubId: "atletico-del-plata", type: "Renovación", step: "Propuesta", status: "Activa", value: "USD 1.9M", commission: "5%", startDate: "2026-09-09", owner: "Lucía Menéndez", lastUpdate: "2026-09-12", nextAction: "Reunión con presidente Pereyra" },
  { id: "n04", playerId: "thiago-duarte", clubId: "cd-mar-de-luz", type: "Transferencia", step: "Reunión", status: "Activa", value: "USD 2.5M", commission: "10%", startDate: "2026-08-20", owner: "Martín Solari", lastUpdate: "2026-09-10", nextAction: "Coordinar visita del club" },
  { id: "n05", playerId: "luca-bianchi", clubId: "cd-central", type: "Renovación", step: "Contacto inicial", status: "Activa", value: "USD 1.8M", commission: "5%", startDate: "2026-09-13", owner: "Lucía Menéndez", lastUpdate: "2026-09-13", nextAction: "Reunión con presidente Melo" },
  { id: "n06", playerId: "diego-antunez", clubId: "sporting-del-sur", type: "Préstamo", step: "Documentación", status: "Activa", value: "—", commission: "—", startDate: "2026-09-08", owner: "Martín Solari", lastUpdate: "2026-09-15", nextAction: "Revisar minuta de préstamo" },
  { id: "n07", playerId: "bruno-cabrera", clubId: "real-monteverde", type: "Renovación", step: "Cerrada", status: "Cerrada", value: "USD 1.3M", commission: "5%", startDate: "2026-05-20", owner: "Rodrigo Paiva", lastUpdate: "2026-06-02", nextAction: "—" },
  { id: "n08", playerId: "nicolas-rivas", clubId: "atletico-horizonte", type: "Préstamo", step: "Revisión", status: "Pausada", value: "USD 400K", commission: "8%", startDate: "2026-09-11", owner: "Rodrigo Paiva", lastUpdate: "2026-09-14", nextAction: "Esperar definición de Horizonte" },
];

// ============ TAREAS (25) ============
const t = (id: string, title: string, owner: string, priority: Task["priority"], dueDate: string, status: Task["status"], extra: Partial<Task> = {}): Task =>
  ({ id, title, description: "", owner, priority, dueDate, status, ...extra });

export const tasks: Task[] = [
  t("t01", "Enviar portfolio de Mateo Ferrer a Atlético Horizonte", "Martín Solari", "Urgente", "2026-09-18", "En progreso", { playerId: "mateo-ferrer", clubId: "atletico-horizonte", contactId: "c01", description: "Incluir video 2025 y estadísticas actualizadas." }),
  t("t02", "Compartir informes defensivos de Thiago Duarte con Mar de Luz", "Martín Solari", "Alta", "2026-09-19", "Pendiente", { playerId: "thiago-duarte", clubId: "cd-mar-de-luz", contactId: "c02" }),
  t("t03", "Reunión de renovación de Juan Sosa", "Lucía Menéndez", "Alta", "2026-09-22", "Pendiente", { playerId: "juan-sosa", clubId: "atletico-del-plata", contactId: "c03" }),
  t("t04", "Responder contraoferta de Unión Andina por Roldán", "Lucía Menéndez", "Urgente", "2026-09-17", "En progreso", { playerId: "valentin-roldan", clubId: "union-andina", contactId: "c04" }),
  t("t05", "Enviar video de Luca Bianchi a Estrela do Atlântico", "Lucía Menéndez", "Media", "2026-09-23", "Pendiente", { playerId: "luca-bianchi", clubId: "estrela-atlantico", contactId: "c06" }),
  t("t06", "Revisar minuta de préstamo de Diego Antúnez", "Martín Solari", "Alta", "2026-09-18", "Pendiente", { playerId: "diego-antunez", clubId: "sporting-del-sur" }),
  t("t07", "Llamada con Giulia Ferretti por marco contractual", "Rodrigo Paiva", "Media", "2026-09-24", "Pendiente", { contactId: "c07", playerId: "nicolas-rivas" }),
  t("t08", "Actualizar video de atajadas de Bruno Cabrera", "Rodrigo Paiva", "Baja", "2026-09-30", "Pendiente", { playerId: "bruno-cabrera" }),
  t("t09", "Coordinar visita de Mar de Luz para ver a Duarte", "Martín Solari", "Alta", "2026-09-26", "Pendiente", { playerId: "thiago-duarte", clubId: "cd-mar-de-luz" }),
  t("t10", "Seguimiento de negociación con Atlético Horizonte", "Martín Solari", "Alta", "2026-09-20", "En progreso", { playerId: "mateo-ferrer", clubId: "atletico-horizonte" }),
  t("t11", "Reunión con presidente Melo por renovación de Bianchi", "Lucía Menéndez", "Alta", "2026-09-25", "Pendiente", { playerId: "luca-bianchi", clubId: "cd-central", contactId: "c20" }),
  t("t12", "Informe de juveniles zona sur", "Camila Duarte", "Media", "2026-09-28", "En progreso", { contactId: "c16" }),
  t("t13", "Enviar perfiles defensivos a Defensor del Litoral", "Martín Solari", "Baja", "2026-10-02", "Pendiente", { clubId: "defensor-litoral", contactId: "c18" }),
  t("t14", "Preparar showcase de juveniles en Buenos Aires", "Martín Solari", "Media", "2026-10-10", "Pendiente", { description: "Coordinar sede, fecha y clubes invitados." }),
  t("t15", "Plan de fuerza de Luca Bianchi con PF externo", "Lucía Menéndez", "Baja", "2026-10-01", "Completada", { playerId: "luca-bianchi", contactId: "c10" }),
  t("t16", "Nota periodística post-mercado de Ferrer", "Martín Solari", "Baja", "2026-10-05", "Pendiente", { contactId: "c11", playerId: "mateo-ferrer" }),
  t("t17", "Renovar pasaporte de Thiago Duarte", "Rodrigo Paiva", "Urgente", "2026-09-19", "Pendiente", { playerId: "thiago-duarte", description: "Vence el 10/10. Iniciar trámite esta semana." }),
  t("t18", "Seguimiento de scouting: Facundo Vera", "Camila Duarte", "Media", "2026-09-21", "En progreso"),
  t("t19", "Cargar comunicaciones de la semana", "Lucía Menéndez", "Baja", "2026-09-18", "Pendiente"),
  t("t20", "Revisar documentación contractual de Roldán", "Lucía Menéndez", "Alta", "2026-09-17", "Completada", { playerId: "valentin-roldan" }),
  t("t21", "Coordinar videollamada con scout de Vega Real", "Lucía Menéndez", "Media", "2026-09-24", "Pendiente", { contactId: "c09" }),
  t("t22", "Preparar presentación de Cabrera para Costa Brava", "Rodrigo Paiva", "Media", "2026-10-03", "Pendiente", { playerId: "bruno-cabrera", clubId: "deportivo-costa-brava" }),
  t("t23", "Actualizar base de contactos de Chile", "Rodrigo Paiva", "Baja", "2026-10-06", "Pendiente"),
  t("t24", "Seguimiento post-partido de Rivas vs. Central", "Rodrigo Paiva", "Media", "2026-09-21", "Pendiente", { playerId: "nicolas-rivas" }),
  t("t25", "Definir estrategia de ventana invernal 2027", "Martín Solari", "Alta", "2026-10-15", "Pendiente", { description: "Mapa de jugadores transferibles y clubes objetivo." }),
];

// ============ EVENTOS (15) ============
export const events: AgencyEvent[] = [
  { id: "e01", title: "Reunión con Atlético Horizonte (Ferrer)", type: "Reunión", date: "2026-09-18", time: "10:00", playerId: "mateo-ferrer", clubId: "atletico-horizonte", contactId: "c01" },
  { id: "e02", title: "Llamada con Unión Andina", type: "Llamada", date: "2026-09-17", time: "15:30", playerId: "valentin-roldan", clubId: "union-andina", contactId: "c04" },
  { id: "e03", title: "Partido: Sporting del Sur vs. Central", type: "Partido", date: "2026-09-20", time: "19:00", playerId: "nicolas-rivas", clubId: "sporting-del-sur" },
  { id: "e04", title: "Videollamada con Mar de Luz", type: "Videollamada", date: "2026-09-19", time: "12:00", playerId: "thiago-duarte", clubId: "cd-mar-de-luz", contactId: "c02" },
  { id: "e05", title: "Scouting: Torneo Juvenil Costa", type: "Scouting", date: "2026-09-21", time: "09:00", contactId: "c16" },
  { id: "e06", title: "Seguimiento físico de Bianchi", type: "Seguimiento", date: "2026-09-22", time: "11:00", playerId: "luca-bianchi", contactId: "c10" },
  { id: "e07", title: "Reunión renovación Sosa — Presidente Pereyra", type: "Renovación", date: "2026-09-22", time: "17:00", playerId: "juan-sosa", clubId: "atletico-del-plata", contactId: "c03" },
  { id: "e08", title: "Reunión con presidente Melo (Bianchi)", type: "Reunión", date: "2026-09-25", time: "10:30", playerId: "luca-bianchi", clubId: "cd-central", contactId: "c20" },
  { id: "e09", title: "Deadline: respuesta a contraoferta de Andina", type: "Deadline", date: "2026-09-17", time: "18:00", playerId: "valentin-roldan", clubId: "union-andina" },
  { id: "e10", title: "Visita de Mar de Luz a Monteverde", type: "Reunión", date: "2026-09-26", time: "10:00", playerId: "thiago-duarte", clubId: "real-monteverde" },
  { id: "e11", title: "Partido: Atlético del Plata vs. Horizonte", type: "Partido", date: "2026-09-27", time: "20:00", playerId: "mateo-ferrer", clubId: "atletico-del-plata" },
  { id: "e12", title: "Firma de préstamo de Antúnez", type: "Firma", date: "2026-09-29", time: "12:00", playerId: "diego-antunez", clubId: "sporting-del-sur" },
  { id: "e13", title: "Llamada con Estrela do Atlântico", type: "Llamada", date: "2026-09-23", time: "14:00", playerId: "luca-bianchi", clubId: "estrela-atlantico", contactId: "c06" },
  { id: "e14", title: "Seguimiento semanal de pipeline", type: "Seguimiento", date: "2026-09-18", time: "09:00" },
  { id: "e15", title: "Videollamada con Vega Real", type: "Videollamada", date: "2026-09-24", time: "16:00", playerId: "luca-bianchi", clubId: "atletico-vega-real", contactId: "c09" },
];

// ============ COMUNICACIONES ============
export const communications: Communication[] = [
  { id: "cm01", date: "2026-09-15", type: "Email", contactId: "c01", playerId: "mateo-ferrer", clubId: "atletico-horizonte", subject: "Portfolio Mateo Ferrer", description: "Alsina confirma recepción del dossier y pide video de la temporada 2025.", owner: "Martín Solari" },
  { id: "cm02", date: "2026-09-14", type: "WhatsApp", contactId: "c04", playerId: "valentin-roldan", clubId: "union-andina", subject: "Contraoferta Roldán", description: "Andina mejora la oferta y pide respuesta antes del 17/09.", owner: "Lucía Menéndez" },
  { id: "cm03", date: "2026-09-12", type: "Llamada", contactId: "c02", playerId: "thiago-duarte", clubId: "cd-mar-de-luz", subject: "Informes de Duarte", description: "Mar de Luz solicita informes defensivos completos con video de duelos.", owner: "Martín Solari" },
  { id: "cm04", date: "2026-09-11", type: "Reunión", contactId: "c08", playerId: "diego-antunez", clubId: "sporting-del-sur", subject: "Préstamo Antúnez", description: "Quito confirma minutos garantizados y rol de lateral titular alterno.", owner: "Martín Solari" },
  { id: "cm05", date: "2026-09-10", type: "Email", contactId: "c06", playerId: "luca-bianchi", clubId: "estrela-atlantico", subject: "Presentación Bianchi", description: "Se envía perfil preliminar del extremo a dirección deportiva.", owner: "Lucía Menéndez" },
  { id: "cm06", date: "2026-09-09", type: "Llamada", contactId: "c03", playerId: "juan-sosa", clubId: "atletico-del-plata", subject: "Renovación Sosa", description: "Pereyra adelanta propuesta de 2 años con mejora escalonada.", owner: "Lucía Menéndez" },
  { id: "cm07", date: "2026-09-08", type: "WhatsApp", contactId: "c07", playerId: "nicolas-rivas", clubId: "ac-pontenuovo", subject: "Interés Pontenuovo", description: "Ferretti confirma que el club observó a Rivas en dos partidos.", owner: "Rodrigo Paiva" },
  { id: "cm08", date: "2026-09-05", type: "Email", contactId: "c05", playerId: "bruno-cabrera", clubId: "real-monteverde", subject: "Reporte trimestral", description: "Se envía reporte de estado de Duarte y Cabrera a secretaría técnica.", owner: "Rodrigo Paiva" },
  { id: "cm09", date: "2026-09-04", type: "Seguimiento", contactId: "c20", playerId: "luca-bianchi", clubId: "cd-central", subject: "Renovación Bianchi", description: "Melo acepta reunirse la semana del 22 para hablar de renovación.", owner: "Lucía Menéndez" },
  { id: "cm10", date: "2026-09-02", type: "Nota", playerId: "mateo-ferrer", subject: "Nota interna Ferrer", description: "Familia prioriza Europa en 2026. Evaluar impacto de la oferta de Horizonte.", owner: "Martín Solari" },
];

// ============ DOCUMENTOS (20) ============
const d = (id: string, name: string, category: DocumentItem["category"], date: string, status: DocumentItem["status"], extra: Partial<DocumentItem> = {}): DocumentItem =>
  ({ id, name, category, date, status, ...extra });

export const documents: DocumentItem[] = [
  d("d01", "Contrato de representación — Mateo Ferrer", "Contratos", "2024-03-01", "Vigente", { playerId: "mateo-ferrer", expiry: "2027-03-01" }),
  d("d02", "Contrato vigente con Atlético del Plata — Ferrer", "Contratos", "2024-07-01", "Vigente", { playerId: "mateo-ferrer", clubId: "atletico-del-plata", expiry: "2027-06-30" }),
  d("d03", "Pasaporte — Thiago Duarte", "Pasaportes", "2021-10-10", "Por vencer", { playerId: "thiago-duarte", expiry: "2026-10-10" }),
  d("d04", "Contrato de representación — Luca Bianchi", "Contratos", "2023-12-01", "Vigente", { playerId: "luca-bianchi", expiry: "2026-12-01" }),
  d("d05", "Informe de scouting — Diego Antúnez", "Informes", "2026-08-15", "Vigente", { playerId: "diego-antunez" }),
  d("d06", "Contrato vigente con Real Monteverde — Cabrera", "Contratos", "2026-06-02", "Vigente", { playerId: "bruno-cabrera", clubId: "real-monteverde", expiry: "2028-06-30" }),
  d("d07", "Autorización de imagen — Nicolás Rivas", "Autorizaciones", "2025-02-10", "Vigente", { playerId: "nicolas-rivas", expiry: "2027-02-10" }),
  d("d08", "Presentación institucional NEXUS SPORTS", "Presentaciones", "2026-01-20", "Vigente"),
  d("d09", "Video highlights — Mateo Ferrer 2025", "Videos", "2026-08-01", "Vigente", { playerId: "mateo-ferrer" }),
  d("d10", "Video highlights — Thiago Duarte 2025", "Videos", "2026-07-22", "Vigente", { playerId: "thiago-duarte" }),
  d("d11", "Pasaporte — Mateo Ferrer", "Pasaportes", "2023-05-15", "Vigente", { playerId: "mateo-ferrer", expiry: "2028-05-15" }),
  d("d12", "Contrato de representación — Valentín Roldán", "Contratos", "2024-01-15", "Por vencer", { playerId: "valentin-roldan", expiry: "2026-12-31" }),
  d("d13", "Informe médico anual — Juan Sosa", "Administrativa", "2026-02-01", "Vigente", { playerId: "juan-sosa" }),
  d("d14", "Minuta de préstamo — Diego Antúnez", "Contratos", "2026-09-12", "Vigente", { playerId: "diego-antunez", clubId: "sporting-del-sur" }),
  d("d15", "Contrato de representación — Thiago Duarte", "Contratos", "2022-06-01", "Vigente", { playerId: "thiago-duarte", expiry: "2027-06-01" }),
  d("d16", "Autorización de viaje menor — Antúnez (vencida)", "Autorizaciones", "2025-03-01", "Vencido", { playerId: "diego-antunez", expiry: "2026-03-01" }),
  d("d17", "Informe de rendimiento — Bruno Cabrera 2025", "Informes", "2026-01-10", "Vigente", { playerId: "bruno-cabrera" }),
  d("d18", "Contrato de representación — Juan Sosa", "Contratos", "2023-01-10", "Por vencer", { playerId: "juan-sosa", expiry: "2026-06-30" }),
  d("d19", "Video compilado defensivo — Thiago Duarte", "Videos", "2026-09-01", "Vigente", { playerId: "thiago-duarte" }),
  d("d20", "Póliza de seguro deportivo — Nicolás Rivas", "Administrativa", "2025-12-01", "Vigente", { playerId: "nicolas-rivas", expiry: "2026-12-01" }),
];

// ============ SCOUTING ============
export const scoutingReports: ScoutingReport[] = [
  { id: "s01", name: "Facundo Vera", age: 17, position: "Extremo izquierdo", club: "Juveniles de Bahía", country: "Argentina", potential: 8, rating: 6, status: "Observado", scout: "Camila Duarte", notes: "Desequilibrante, falta físico. Revisar en 3 meses." },
  { id: "s02", name: "Ignacio Pereira", age: 19, position: "Defensor central", club: "Defensor del Litoral", country: "Uruguay", potential: 7, rating: 6, status: "En evaluación", scout: "Camila Duarte", notes: "Buen juego aéreo. Ver contra delanteros rápidos." },
  { id: "s03", name: "Bastián Fuentes", age: 18, position: "Mediocampista", club: "Unión Andina", country: "Chile", potential: 8, rating: 7, status: "Contactado", scout: "Rodrigo Paiva", notes: "Muy buen primer pase. Entorno abierto a conversar." },
  { id: "s04", name: "Lautaro Insúa", age: 16, position: "Delantero", club: "Formativas Santa Fe", country: "Argentina", potential: 9, rating: 6, status: "Detectado", scout: "Camila Duarte", notes: "Goleador del torneo juvenil. Seguimiento regulado +16." },
  { id: "s05", name: "Emiliano Costa", age: 20, position: "Arquero", club: "Sporting del Sur", country: "Argentina", potential: 6, rating: 6, status: "Reunión", scout: "Rodrigo Paiva", notes: "Suplente con buenos números en reserva." },
  { id: "s06", name: "Tomás Aguirre", age: 21, position: "Volante", club: "Atlético Horizonte", country: "Argentina", potential: 6, rating: 5, status: "Descartado", scout: "Camila Duarte", notes: "No superó evaluación física." },
];

// ============ ACTIVIDAD ============
export const activities: Activity[] = [
  { id: "a01", date: "2026-09-15", text: "Email recibido de Federico Alsina (Atlético Horizonte) por Mateo Ferrer", kind: "contacto" },
  { id: "a02", date: "2026-09-15", text: "Negociación con Unión Andina por Valentín Roldán avanzó a Contraoferta", kind: "negociacion" },
  { id: "a03", date: "2026-09-14", text: "Portfolio de Mateo Ferrer enviado a Atlético Horizonte", kind: "portfolio" },
  { id: "a04", date: "2026-09-13", text: "Nueva oportunidad creada: Rivas → Atlético Horizonte (préstamo)", kind: "oportunidad" },
  { id: "a05", date: "2026-09-12", text: "Reunión registrada con Andrés Quito por préstamo de Antúnez", kind: "reunion" },
  { id: "a06", date: "2026-09-12", text: "Minuta de préstamo de Antúnez cargada en Documentos", kind: "documento" },
  { id: "a07", date: "2026-09-11", text: "Nuevo contacto agregado: Nadia Fernández (Nutricionista)", kind: "contacto" },
  { id: "a08", date: "2026-09-10", text: "CD Mar de Luz mostró interés formal en Thiago Duarte", kind: "club" },
  { id: "a09", date: "2026-09-09", text: "Tarea completada: revisión documental de Roldán", kind: "tarea" },
  { id: "a10", date: "2026-09-08", text: "Video compilado defensivo de Duarte actualizado", kind: "documento" },
];

// ============ NOTIFICACIONES ============
export const notifications: Notification[] = [
  { id: "nt1", text: "Pasaporte de Thiago Duarte vence en 23 días", date: "2026-09-17", read: false, kind: "documento" },
  { id: "nt2", text: "Deadline: respuesta a contraoferta de Unión Andina hoy", date: "2026-09-17", read: false, kind: "oportunidad" },
  { id: "nt3", text: "Reunión con Atlético Horizonte mañana 10:00", date: "2026-09-17", read: false, kind: "reunion" },
  { id: "nt4", text: "Contrato de representación de Juan Sosa vence en 9 meses", date: "2026-09-15", read: true, kind: "contrato" },
  { id: "nt5", text: "Nueva oportunidad: Rivas → Atlético Horizonte", date: "2026-09-13", read: true, kind: "oportunidad" },
  { id: "nt6", text: "Autorización de viaje de Antúnez vencida", date: "2026-09-10", read: true, kind: "documento" },
];
