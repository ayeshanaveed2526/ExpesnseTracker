// Recurring (monthly) transaction rules + a catch-up generator that runs on load.
//
// Rule shape:
//   { id, title, amount, category, type, dayOfMonth, lastRun: 'YYYY-MM' | null }
//
// On load we generate one transaction per month that has elapsed since `lastRun`
// (capped to avoid runaway catch-up), then advance `lastRun` to the current month.

export const RECURRING_STORAGE_KEY = 'finpulse_recurring_v1';

const MAX_CATCHUP_MONTHS = 12;

const ymKey = (year, month) => `${year}-${String(month + 1).padStart(2, '0')}`;

const dateString = (year, month, day) => {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const clampedDay = Math.min(Math.max(1, day || 1), lastDay);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
};

// Returns { newExpenses, updatedRules, changed }.
export function generateDueRecurring(rules = [], now = new Date()) {
  if (!Array.isArray(rules) || rules.length === 0) {
    return { newExpenses: [], updatedRules: rules || [], changed: false };
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentKey = ymKey(currentYear, currentMonth);

  const newExpenses = [];
  let idSeed = now.getTime();
  let changed = false;

  const updatedRules = rules.map((rule) => {
    // Determine the first month we still owe a transaction for.
    let cursor;
    if (rule.lastRun && /^\d{4}-\d{2}$/.test(rule.lastRun)) {
      const [ly, lm] = rule.lastRun.split('-').map(Number);
      cursor = new Date(ly, lm - 1, 1);
      cursor.setMonth(cursor.getMonth() + 1); // month after last run
    } else {
      // Never run before: start with the current month only.
      cursor = new Date(currentYear, currentMonth, 1);
    }

    let guard = 0;
    while (
      guard < MAX_CATCHUP_MONTHS &&
      (cursor.getFullYear() < currentYear ||
        (cursor.getFullYear() === currentYear && cursor.getMonth() <= currentMonth))
    ) {
      newExpenses.push({
        id: (idSeed += 1),
        title: rule.title,
        amount: rule.amount,
        category: rule.category,
        type: rule.type === 'income' ? 'income' : 'expense',
        date: dateString(cursor.getFullYear(), cursor.getMonth(), rule.dayOfMonth),
        notes: 'Recurring',
        recurringId: rule.id,
      });
      changed = true;
      cursor.setMonth(cursor.getMonth() + 1);
      guard += 1;
    }

    return { ...rule, lastRun: currentKey };
  });

  return { newExpenses, updatedRules, changed };
}
