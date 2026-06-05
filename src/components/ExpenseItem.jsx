import React from 'react';
import { ShoppingBag, Coffee, Car, Home, Wallet } from 'lucide-react';

const ExpenseItem = ({ title, date, amount, category, type, index = 0 }) => {
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
      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 rounded-lg animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-primary' : 'bg-white/90'}`}>
          {getIcon()}
        </div>
        <div>
          <h4 className="font-semibold text-white">{title}</h4>
          <p className="text-sm text-white/50">{date}</p>
        </div>
      </div>
      <div className={`text-right font-bold flex items-center ${isIncome ? 'text-primary' : 'text-danger'}`}>
        {isIncome ? '+' : '-'}
        <span className="mx-1">Rs.</span>
        {amount.toLocaleString('en-PK')}
      </div>
    </div>
  );
};

export default ExpenseItem;
