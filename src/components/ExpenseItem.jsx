import React from 'react';
import { ShoppingBag, Coffee, Car, Home, Wallet, Pencil, Trash2 } from 'lucide-react';


const ExpenseItem = ({ id, title, date, amount, category, type, index = 0, onEdit, onDelete }) => {
  
  
  

  const getIcon = () => {
    switch(category) {
      case 'Food': return <Coffee size={20} className="text-secondary" />;
      case 'Transport': return <Car size={20} className="text-secondary" />;
      case 'Housing': return <Home size={20} className="text-secondary" />;
      case 'Income': return <Wallet size={20} className="text-secondary" />;
      default: return <ShoppingBag size={20} className="text-secondary" />;
    }
  };

  const isIncome = type === 'income';

  return (
    <div 
      className="flex items-center justify-between p-4 hover:bg-glass transition-colors border-b border-border-main last:border-0 rounded-lg animate-fade-in-up group"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${isIncome ? 'bg-primary shadow-primary/20' : 'bg-surface-bright shadow-white/10'}`}>
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-text-main">{title}</h4>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>{date}</span>
            <span>•</span>
            <span>{category}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className={`font-bold block ${isIncome ? 'text-primary' : 'text-text-main'}`}>
            {isIncome ? '+' : '-'} Rs. {amount.toLocaleString('en-PK')}
          </span>
        </div>
        
        {/* Action Buttons (visible on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={() => onEdit({ id, title, date, amount, category, type })}
              className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-glass"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => onDelete(id)}
              className="p-2 text-text-muted hover:text-danger transition-colors rounded-lg hover:bg-glass"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseItem;
