// NEXUS SPORTS — Modelo de datos (mock centralizado, preparado para Supabase)

export type PlayerStatus =
  | "Activo"
  | "En desarrollo"
  | "En evaluación"
  | "Lesionado"
  | "Transferible"
  | "Préstamo"
  | "Finalizado";

export type PlayerStats = {
  season: string;
  matches: number;
  minutes: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  starts: number;
};

export type ClubHistoryEntry = {
  clubId: string;
  period: string;
  category: string;
};

export type PlayerVideoCategory =
  | "Highlights"
  | "Skills"
  | "Goles"
  | "Atajadas"
  | "Entrevista"
  | "Detrás de escena"
  | "Rendimiento";

export type PlayerVideo = {
  id: string;
  title: string;
  category: PlayerVideoCategory;
  duration: string;
  url: string;
  date: string;
  featured?: boolean;
  description?: string;
};

export type Player = {
  id: string;
  name: string;
  position: string;
  positionShort: string;
  age: number;
  birthDate: string;
  height: string;
  nationality: string;
  foot: "Derecho" | "Izquierdo" | "Ambidiestro";
  clubId: string;
  number: number;
  status: PlayerStatus;
  contractEnd: string;
  marketValue: string;
  bio: string;
  profile: string;
  traits: string[];
  achievements: string[];
  stats: PlayerStats[];
  history: ClubHistoryEntry[];
  videos: PlayerVideo[];
  photo: string; // clave en playerPhotos
  agent: string;
  nextAction: string;
  internalNotes: string;
  planning: { short: string; mid: string; long: string; actions: string[] };
};

export type ClubRelation = "Prospecto" | "Contactado" | "Relación activa" | "Cliente" | "Inactivo";

export type Club = {
  id: string;
  name: string;
  country: string;
  city: string;
  league: string;
  relation: ClubRelation;
  interestLevel: 1 | 2 | 3 | 4 | 5;
  initials: string;
  colors: [string, string]; // escudo ficticio generado (gradiente)
  notes: string;
};

export type ContactType =
  | "Director deportivo"
  | "Scouting"
  | "Entrenador"
  | "Presidente"
  | "Representante"
  | "Abogado"
  | "Preparador físico"
  | "Periodista"
  | "Otro";

export type Contact = {
  id: string;
  name: string;
  role: string;
  type: ContactType;
  clubId?: string;
  email: string;
  phone: string;
  country: string;
  lastContact: string;
  nextAction: string;
  notes: string;
};

export type OpportunityStage =
  | "Nueva"
  | "Contactado"
  | "Interés"
  | "Negociación"
  | "Propuesta"
  | "Cerrada"
  | "Perdida";

export type Opportunity = {
  id: string;
  playerId: string;
  clubId: string;
  contactId: string;
  type: "Transferencia" | "Préstamo" | "Renovación" | "Prueba";
  date: string;
  owner: string;
  estimatedValue: string;
  probability: number;
  stage: OpportunityStage;
  nextAction: string;
  notes: string;
};

export type NegotiationStep =
  | "Contacto inicial"
  | "Reunión"
  | "Propuesta"
  | "Contraoferta"
  | "Documentación"
  | "Revisión"
  | "Firma"
  | "Cerrada";

export type Negotiation = {
  id: string;
  playerId: string;
  clubId: string;
  type: "Transferencia" | "Préstamo" | "Renovación";
  step: NegotiationStep;
  status: "Activa" | "Pausada" | "Cerrada" | "Caída";
  value: string;
  commission: string;
  startDate: string;
  owner: string;
  lastUpdate: string;
  nextAction: string;
};

export type TaskPriority = "Baja" | "Media" | "Alta" | "Urgente";
export type TaskStatus = "Pendiente" | "En progreso" | "Bloqueada" | "Completada";

export type Task = {
  id: string;
  title: string;
  description: string;
  owner: string;
  playerId?: string;
  clubId?: string;
  contactId?: string;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
};

export type EventType =
  | "Reunión"
  | "Llamada"
  | "Videollamada"
  | "Partido"
  | "Scouting"
  | "Seguimiento"
  | "Firma"
  | "Renovación"
  | "Deadline";

export type AgencyEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO
  time: string;
  playerId?: string;
  clubId?: string;
  contactId?: string;
  notes?: string;
};

export type CommunicationType = "Email" | "Llamada" | "WhatsApp" | "Reunión" | "Nota" | "Seguimiento";

export type Communication = {
  id: string;
  date: string;
  type: CommunicationType;
  contactId?: string;
  playerId?: string;
  clubId?: string;
  subject: string;
  description: string;
  owner: string;
};

export type DocumentCategory =
  | "Contratos"
  | "Pasaportes"
  | "Autorizaciones"
  | "Informes"
  | "Presentaciones"
  | "Videos"
  | "Administrativa";

export type DocumentItem = {
  id: string;
  name: string;
  category: DocumentCategory;
  playerId?: string;
  clubId?: string;
  date: string;
  expiry?: string;
  status: "Vigente" | "Por vencer" | "Vencido";
};

export type ScoutingStatus =
  | "Detectado"
  | "En evaluación"
  | "Observado"
  | "Contactado"
  | "Reunión"
  | "Incorporado"
  | "Descartado";

export type ScoutingReport = {
  id: string;
  name: string;
  age: number;
  position: string;
  club: string;
  country: string;
  potential: number; // 1-10
  rating: number; // 1-10
  status: ScoutingStatus;
  scout: string;
  notes: string;
};

export type Activity = {
  id: string;
  date: string;
  text: string;
  kind: "contacto" | "club" | "portfolio" | "reunion" | "documento" | "oportunidad" | "tarea" | "negociacion";
};

export type Notification = {
  id: string;
  text: string;
  date: string;
  read: boolean;
  kind: "contrato" | "oportunidad" | "tarea" | "contacto" | "reunion" | "documento";
};

export type Inquiry = {
  id: string;
  name: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  playerId?: string;
  message: string;
  date: string;
  status: "Nueva" | "En gestión" | "Respondida";
};
