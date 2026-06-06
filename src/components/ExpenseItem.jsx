import { ShoppingBag, Coffee, Car, Home, Wallet, Pencil, Trash2 } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes(',')) return dateStr; // Legacy format e.g. "Oct 24, 2026"
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, monthIndex, day);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return dateStr;
};

const ExpenseItem = ({ id, title, date, amount, category, type, index = 0, onEdit, onDelete, currencySymbol = 'Rs.' }) => {
  
  const getCategoryConfig = () => {
    switch(category) {
      case 'Food': 
        return {
          icon: <Coffee size={16} />,
          bg: 'bg-amber-500/10 text-amber-500 border-amber-500/10',
          iconBg: 'bg-amber-500/15 text-amber-500 border border-amber-500/20'
        };
      case 'Transport': 
        return {
          icon: <Car size={16} />,
          bg: 'bg-blue-500/10 text-blue-500 border-blue-500/10',
          iconBg: 'bg-blue-500/15 text-blue-500 border border-blue-500/20'
        };
      case 'Housing': 
        return {
          icon: <Home size={16} />,
          bg: 'bg-purple-500/10 text-purple-500 border-purple-500/10',
          iconBg: 'bg-purple-500/15 text-purple-500 border border-purple-500/20'
        };
      case 'Income': 
        return {
          icon: <Wallet size={16} />,
          bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10',
          iconBg: 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20'
        };
      default: 
        return {
          icon: <ShoppingBag size={16} />,
          bg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/10',
          iconBg: 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/20'
        };
    }
  };

  const config = getCategoryConfig();
  const isIncome = type === 'income';

  return (
    <div 
      className="flex items-center justify-between p-3.5 bg-surface-bright/20 hover:bg-glass/85 border border-border-main/50 rounded-xl transition-all duration-200 group shadow-sm hover:shadow-md animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Category Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${config.iconBg}`}>
          {config.icon}
        </div>
        
        {/* Title & Metadata */}
        <div className="min-w-0">
          <h4 className="font-bold text-text-main text-sm truncate leading-tight mb-1">{title}</h4>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-semibold">
            <span>{formatDate(date)}</span>
            <span>•</span>
            <span className={`inline-flex px-1.5 py-0.5 rounded-md border text-[9px] uppercase tracking-wider ${config.bg}`}>
              {category}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Amount */}
        <div className="text-right">
          <span className={`text-sm font-bold tracking-tight block ${isIncome ? 'text-emerald-500' : 'text-text-main'}`}>
            {isIncome ? '+' : '-'} {currencySymbol} {amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button 
              onClick={() => onEdit({ id, title, date, amount, category, type })}
              className="p-1.5 text-text-muted hover:text-primary transition-all rounded-lg hover:bg-surface border border-transparent hover:border-border-main hover:scale-95 cursor-pointer shadow-sm"
              title="Edit Transaction"
            >
              <Pencil size={12} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(id)}
              className="p-1.5 text-text-muted hover:text-rose-500 transition-all rounded-lg hover:bg-surface border border-transparent hover:border-border-main hover:scale-95 cursor-pointer shadow-sm"
              title="Delete Transaction"
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
