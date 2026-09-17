import { useSyncExternalStore } from "react";
import type {
  Activity, AgencyEvent, Communication, Contact, DocumentItem, Inquiry,
  Negotiation, Notification, Opportunity, Player, ScoutingReport, Task,
} from "./data/types";
import * as seed from "./data/seed";

export type Store = {
  authenticated: boolean;
  userName: string;
  players: Player[];
  clubs: Contact extends never ? never : import("./data/types").Club[];
  contacts: Contact[];
  opportunities: Opportunity[];
  negotiations: Negotiation[];
  tasks: Task[];
  events: AgencyEvent[];
  communications: Communication[];
  documents: DocumentItem[];
  scouting: ScoutingReport[];
  activities: Activity[];
  notifications: Notification[];
  inquiries: Inquiry[];
};

function initialState(): Store {
  return {
    authenticated: false,
    userName: "Martín Solari",
    players: [...seed.players],
    clubs: [...seed.clubs],
    contacts: [...seed.contacts],
    opportunities: [...seed.opportunities],
    negotiations: [...seed.negotiations],
    tasks: [...seed.tasks],
    events: [...seed.events],
    communications: [...seed.communications],
    documents: [...seed.documents],
    scouting: [...seed.scouting],
    activities: [...seed.activities],
    notifications: [...seed.notifications],
    inquiries: [],
  };
}

let state: Store = initialState();
const listeners = new Set<() => void>();

function setState(patch: Partial<Store>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function useStore(): Store {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => state,
    () => state,
  );
}

const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);

function pushActivity(text: string, kind: Activity["kind"]) {
  setState({
    activities: [{ id: uid(), date: today(), text, kind }, ...state.activities].slice(0, 60),
  });
}

export const actions = {
  login() { setState({ authenticated: true }); },
  logout() { setState({ authenticated: false }); },

  // Helpers genéricos de colección
  add<K extends "players" | "clubs" | "contacts" | "opportunities" | "tasks" | "events" | "communications" | "documents" | "scouting" | "inquiries">(
    key: K, item: Store[K][number],
  ) {
    setState({ [key]: [{ ...(item as object), id: (item as { id?: string }).id ?? uid() }, ...(state[key] as unknown[])] } as Partial<Store>);
  },
  update<K extends "players" | "clubs" | "contacts" | "opportunities" | "tasks" | "events" | "communications" | "documents" | "scouting" | "negotiations" | "inquiries">(
    key: K, id: string, patch: Partial<Store[K][number]>,
  ) {
    setState({
      [key]: (state[key] as { id: string }[]).map((it) => (it.id === id ? { ...it, ...patch } : it)),
    } as Partial<Store>);
  },
  remove<K extends "players" | "clubs" | "contacts" | "opportunities" | "tasks" | "events" | "communications" | "documents" | "scouting">(key: K, id: string) {
    setState({ [key]: (state[key] as { id: string }[]).filter((it) => it.id !== id) } as Partial<Store>);
  },

  moveOpportunity(id: string, stage: Opportunity["stage"]) {
    const op = state.opportunities.find((o) => o.id === id);
    if (!op || op.stage === stage) return;
    actions.update("opportunities", id, { stage });
    const player = state.players.find((p) => p.id === op.playerId)?.name ?? "Jugador";
    const club = state.clubs.find((c) => c.id === op.clubId)?.name ?? "Club";
    pushActivity(`Oportunidad ${player} → ${club} movida a "${stage}"`, "oportunidad");
  },

  toggleTask(id: string) {
    const task = state.tasks.find((x) => x.id === id);
    if (!task) return;
    const status = task.status === "Completada" ? "Pendiente" : "Completada";
    actions.update("tasks", id, { status });
    if (status === "Completada") pushActivity(`Tarea completada: ${task.title}`, "tarea");
  },

  addCommunication(comm: Omit<Communication, "id" | "date">) {
    actions.add("communications", { ...comm, id: uid(), date: today() });
    pushActivity(`Comunicación registrada: ${comm.subject}`, "contacto");
  },

  addInquiry(inq: Omit<Inquiry, "id" | "date" | "status">) {
    actions.add("inquiries", { ...inq, id: uid(), date: today(), status: "Nueva" });
  },

  markNotificationRead(id: string) {
    setState({ notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
  },
  markAllNotificationsRead() {
    setState({ notifications: state.notifications.map((n) => ({ ...n, read: true })) });
  },

  logActivity: pushActivity,
};
