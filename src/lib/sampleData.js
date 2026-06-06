// Demo content for the "Explore with sample data" onboarding option.
// Dates are generated relative to the current month so the default
// "This Month" period shows a populated dashboard immediately.

export function buildSampleData(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const day = (d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  let id = now.getTime();
  const next = () => (id += 1);

  const expenses = [
    { id: next(), title: 'Monthly Salary', amount: 120000, date: day(1), category: 'Income', type: 'income', notes: '' },
    { id: next(), title: 'Apartment Rent', amount: 45000, date: day(2), category: 'Housing', type: 'expense', notes: '' },
    { id: next(), title: 'Groceries', amount: 8200, date: day(4), category: 'Food', type: 'expense', notes: 'Weekly run' },
    { id: next(), title: 'Fuel', amount: 6000, date: day(6), category: 'Transport', type: 'expense', notes: '' },
    { id: next(), title: 'Dinner out', amount: 3400, date: day(9), category: 'Food', type: 'expense', notes: '' },
    { id: next(), title: 'Cab rides', amount: 2100, date: day(12), category: 'Transport', type: 'expense', notes: '' },
    { id: next(), title: 'Freelance project', amount: 25000, date: day(15), category: 'Income', type: 'income', notes: '' },
    { id: next(), title: 'Groceries', amount: 7600, date: day(18), category: 'Food', type: 'expense', notes: '' },
  ];

  const budgets = [
    { category: 'Food', limit: 25000 },
    { category: 'Transport', limit: 10000 },
    { category: 'Housing', limit: 50000 },
  ];

  return { expenses, budgets };
}
