// Time-period scoping helpers shared across Summary, charts, budgets and ledger.

export const PERIODS = [
  { key: 'thisMonth', label: 'This Month' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'all', label: 'All Time' },
];

// Robustly parse both ISO (YYYY-MM-DD) and legacy ("Oct 24, 2026") dates.
export function parseTxnDate(dateStr) {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Returns the {year, month} of the month referenced by a period key.
function targetMonth(period, now) {
  const base = new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'lastMonth') base.setMonth(base.getMonth() - 1);
  return { year: base.getFullYear(), month: base.getMonth() };
}

export function filterByPeriod(expenses, period, now = new Date()) {
  if (period === 'all') return expenses;
  const { year, month } = targetMonth(period, now);
  return expenses.filter((e) => {
    const d = parseTxnDate(e.date);
    return d && d.getFullYear() === year && d.getMonth() === month;
  });
}

// Sum of expense-type transactions for a given calendar month offset (0 = this month).
export function monthExpenseTotal(expenses, monthsAgo = 0, now = new Date()) {
  const base = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  return expenses
    .filter((e) => e.type === 'expense')
    .filter((e) => {
      const d = parseTxnDate(e.date);
      return d && d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((acc, e) => acc + e.amount, 0);
}
