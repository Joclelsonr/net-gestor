import type { Expenses, Payments } from "@/generated/prisma/client";

const MS_PER_DAY = 86_400_000;

const cents = (rows: { amount: number }[]) =>
  rows.reduce((total, row) => total + Math.round(Number(row.amount) * 100), 0) /
  100;

export const inPeriod = (date: Date | null, start: Date, end: Date) => {
  if (!date || isNaN(date.getTime())) return false;
  return date >= start && date <= end;
};

export function financeSummary(
  payments: Payments[],
  expenses: Expenses[],
  start: Date,
  end: Date,
  today: Date,
) {
  const due = payments?.filter(
    (r) => r.status !== "CANCELED" && inPeriod(r.dueDate, start, end),
  );

  const received = cents(
    payments?.filter(
      (r) => r.status === "PAID" && inPeriod(r.paidDate, start, end),
    ),
  );

  const spent = cents(
    expenses?.filter(
      (r) => r.status === "PAID" && inPeriod(r.paidDate, start, end),
    ),
  );

  const pending = due.filter(
    (r) => r.status === "WAITING" || r.status === "ONTIME",
  );

  const overdue = pending.filter((r) => r.dueDate < today);

  const billed = cents(due);

  return {
    received,
    spent,
    net: Math.round((received - spent) * 100) / 100,
    billed,
    receivable: cents(pending),
    overdue: cents(overdue),
    overdueCount: overdue.length,
    delinquency: billed ? (cents(overdue) / billed) * 100 : 0,
    payable: cents(
      expenses?.filter(
        (r) => r.status === "WAITING" && inPeriod(r.dueDate, start, end),
      ),
    ),
  };
}

export function monthRange(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function yearRange(date: Date = new Date()) {
  const year = date.getUTCFullYear();
  const start = new Date(year, 0, 1, 0, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);
  return { start, end };
}

export function cashSeries(
  payments: Payments[],
  expenses: Expenses[],
  start: Date,
  end: Date = new Date(),
) {
  const now = new Date();
  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const effectiveEnd = new Date(Math.min(end.getTime(), now.getTime()));
  effectiveEnd.setHours(23, 59, 59, 999);

  const startTime = start.getTime();
  const endTime = end.getTime();

  if (startTime > endTime) return [];

  const isDaily = (endTime - startTime) / MS_PER_DAY <= 62;
  const sliceLength = isDaily ? 10 : 7;

  const map = new Map<
    string,
    { date: string; received: number; spent: number }
  >();

  for (let t = startTime; t <= endTime; t += MS_PER_DAY) {
    const dateKey = new Date(t).toISOString().slice(0, sliceLength);
    if (!map.has(dateKey)) {
      map.set(dateKey, { date: dateKey, received: 0, spent: 0 });
    }
  }

  const endDateKey = effectiveEnd.toISOString().slice(0, sliceLength);
  if (!map.has(endDateKey)) {
    map.set(endDateKey, { date: endDateKey, received: 0, spent: 0 });
  }

  const sources = [
    { rows: payments, key: "received" as const },
    { rows: expenses, key: "spent" as const },
  ];

  for (const { rows, key } of sources) {
    for (const row of rows) {
      if (row.status !== "PAID" || !row.paidDate) continue;

      const paidDate =
        row.paidDate instanceof Date ? row.paidDate : new Date(row.paidDate);

      if (!inPeriod(paidDate, startDate, effectiveEnd)) continue;

      const dateKey = paidDate.toISOString().slice(0, sliceLength);
      const entry = map.get(dateKey);

      if (entry) {
        const value = Number(row.amount) || 0;
        entry[key] = Math.round((entry[key] + value) * 100) / 100;
      }
    }
  }

  return Array.from(map.values());
}

export const formatDate = (
  date: Date | string | null | undefined,
): string | null => {
  if (!date) return null;

  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }

  return null;
};

export const compact = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function daysLate(due: Date, today: Date = new Date()): number {
  const dueNormalized = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate(),
    12,
    0,
    0,
  );

  const todayNormalized = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
    0,
    0,
  );

  const diffDays = Math.round(
    (todayNormalized.getTime() - dueNormalized.getTime()) / MS_PER_DAY,
  );

  return Math.max(0, diffDays);
}
