import { addDays, differenceInDays, parseISO, startOfDay } from "date-fns";

/**
 * Parse seguro de "yyyy-MM-dd" -> Date
 * Se vier vazio ou inválido, retorna null.
 */
export function safeParseDate(value?: string): Date | null {
  if (!value) return null;
  try {
    const d = parseISO(value);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

/**
 * Calcula nextServiceDate (yyyy-MM-dd) usando lastServiceDate + intervalo
 */
export function computeNextServiceDate(
  lastServiceDate: string,
  intervalDays: number
): string {
  const base = safeParseDate(lastServiceDate);
  if (!base) return "";
  const next = addDays(base, intervalDays);
  return next.toISOString().slice(0, 10);
}

/**
 * Classifica a próxima manutenção:
 * - overdue: passou do dia de hoje
 * - due_soon: 0..30 dias
 * - ok: mais que 30 dias
 * - unknown: não dá pra calcular
 */
export function getDueState(nextServiceDate?: string): {
  state: "overdue" | "due_soon" | "ok" | "unknown";
  daysDelta?: number;
} {
  const next = safeParseDate(nextServiceDate);
  if (!next) return { state: "unknown" };

  const today = startOfDay(new Date());
  const nextDay = startOfDay(next);

  const daysDelta = differenceInDays(nextDay, today);

  if (daysDelta < 0) return { state: "overdue", daysDelta };
  if (daysDelta <= 30) return { state: "due_soon", daysDelta };
  return { state: "ok", daysDelta };
}
