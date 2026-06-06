// Category model + migration helpers.
// Categories are referenced by name (string) everywhere (transactions, budgets),
// so existing data keeps working with zero migration. We only ever ADD missing
// categories so nothing referenced is ever orphaned.

export const CATEGORY_STORAGE_KEY = 'finpulse_categories_v1';

export const CATEGORY_COLORS = [
  '#10B981', // emerald
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#F43F5E', // rose
  '#06B6D4', // cyan
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
];

export const EMOJI_CHOICES = [
  '🍔', '🛒', '🚗', '🏠', '💡', '💊', '🎬', '✈️', '👕', '🎓',
  '🎁', '🐶', '📱', '💪', '☕', '⛽', '💰', '💼', '📈', '🏷️',
];

export const DEFAULT_CATEGORIES = [
  { name: 'Food', emoji: '🍔', color: '#F59E0B', type: 'expense' },
  { name: 'Transport', emoji: '🚗', color: '#3B82F6', type: 'expense' },
  { name: 'Housing', emoji: '🏠', color: '#8B5CF6', type: 'expense' },
  { name: 'Income', emoji: '💰', color: '#10B981', type: 'income' },
];

const pickColor = (i) => CATEGORY_COLORS[i % CATEGORY_COLORS.length];

// Ensure every category name referenced by existing transactions/budgets exists
// in the list. Returns a new array (defaults seeded when nothing is stored yet).
export function healCategories(stored, expenses = [], budgets = []) {
  const list = Array.isArray(stored) && stored.length
    ? stored.map((c) => ({ ...c }))
    : DEFAULT_CATEGORIES.map((c) => ({ ...c }));

  const names = new Set(list.map((c) => c.name));

  const ensure = (name, type) => {
    if (!name || names.has(name)) return;
    list.push({
      name,
      emoji: type === 'income' ? '💰' : '🏷️',
      color: pickColor(list.length),
      type: type === 'income' ? 'income' : 'expense',
    });
    names.add(name);
  };

  expenses.forEach((e) => ensure(e.category, e.type));
  budgets.forEach((b) => ensure(b.category, 'expense'));

  return list;
}

export function getCategory(categories, name) {
  return (
    categories.find((c) => c.name === name) || {
      name: name || 'Other',
      emoji: '🏷️',
      color: '#06B6D4',
      type: 'expense',
    }
  );
}

// Convert a #rrggbb hex into an rgba() string for tinted backgrounds/borders.
export function hexToRgba(hex, alpha = 1) {
  if (typeof hex !== 'string') return `rgba(6,182,212,${alpha})`;
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return `rgba(6,182,212,${alpha})`;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
