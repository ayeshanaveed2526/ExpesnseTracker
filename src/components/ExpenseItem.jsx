import { Pencil, Trash2, Copy } from 'lucide-react';
import { getCategory, hexToRgba } from '../lib/categories';

const parseDateParts = (dateStr) => {
  if (!dateStr || dateStr.includes(',')) return null; // null = legacy/unknown, use raw
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parts[0], parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
};

const formatDate = (dateStr) => {
  const d = parseDateParts(dateStr);
  if (!d) return dateStr || '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Shorter form (no year) used on narrow screens to save horizontal space.
const formatDateShort = (dateStr) => {
  const d = parseDateParts(dateStr);
  if (!d) return dateStr || '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ExpenseItem = ({ id, title, date, amount, category, type, notes, index = 0, onEdit, onDelete, onDuplicate, currencySymbol = 'Rs.', categories = [] }) => {
  const cat = getCategory(categories, category);
  const isIncome = type === 'income';
  const expense = { id, title, date, amount, category, type, notes };

  return (
    <div
      className="flex items-center justify-between gap-2 p-3 sm:p-3.5 bg-surface-bright/20 hover:bg-glass/85 border border-border-main/50 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s`, animationFillMode: 'both' }}
    >
      {/* Left: icon + title + meta */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-base border"
          style={{ backgroundColor: hexToRgba(cat.color, 0.15), borderColor: hexToRgba(cat.color, 0.25) }}
          title={cat.name}
        >
          <span aria-hidden>{cat.emoji}</span>
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-text-main text-sm truncate leading-tight mb-1">{title}</h4>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-semibold min-w-0">
            <span className="whitespace-nowrap">
              <span className="sm:hidden">{formatDateShort(date)}</span>
              <span className="hidden sm:inline">{formatDate(date)}</span>
            </span>
            <span aria-hidden className="text-text-muted/50">•</span>
            <span
              className="inline-flex px-1.5 py-0.5 rounded-md border text-[9px] uppercase tracking-wider truncate max-w-[80px] flex-shrink-0"
              style={{ color: cat.color, backgroundColor: hexToRgba(cat.color, 0.1), borderColor: hexToRgba(cat.color, 0.15) }}
            >
              {category}
            </span>
            {notes && (
              <span className="hidden sm:inline truncate max-w-[90px] italic text-text-muted/70 normal-case tracking-normal" title={notes}>
                — {notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: amount (stacks above actions on mobile, inline on desktop) */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 sm:flex-row sm:items-center sm:gap-1.5">
        <span className={`text-sm font-bold tracking-tight whitespace-nowrap ${isIncome ? 'text-emerald-500' : 'text-text-main'}`}>
          {isIncome ? '+' : '-'} {currencySymbol} {amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
        </span>

        {/* Actions: always visible on touch (no hover), hover-reveal on desktop */}
        <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(expense)}
              className="p-1.5 text-text-muted hover:text-primary transition-all rounded-lg hover:bg-surface border border-transparent hover:border-border-main active:scale-90 cursor-pointer shadow-sm"
              title="Duplicate Transaction"
              aria-label="Duplicate transaction"
            >
              <Copy size={12} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(expense)}
              className="p-1.5 text-text-muted hover:text-primary transition-all rounded-lg hover:bg-surface border border-transparent hover:border-border-main active:scale-90 cursor-pointer shadow-sm"
              title="Edit Transaction"
              aria-label="Edit transaction"
            >
              <Pencil size={12} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-text-muted hover:text-rose-500 transition-all rounded-lg hover:bg-surface border border-transparent hover:border-border-main active:scale-90 cursor-pointer shadow-sm"
              title="Delete Transaction"
              aria-label="Delete transaction"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
