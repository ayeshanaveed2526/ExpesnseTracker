import React from 'react';
import { X } from 'lucide-react';

const ExpenseForm = ({ onClose }) => {
  return (
    <div className="bg-surface-bright rounded-2xl p-6 shadow-2xl border border-white/10 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold mb-6 text-white">Record Transaction</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Amount (Rs.)</label>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
          <input 
            type="text" 
            placeholder="What was this for?"
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
            <select className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none">
              <option>Food & Dining</option>
              <option>Transportation</option>
              <option>Housing</option>
              <option>Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="w-full bg-primary text-secondary font-bold text-lg py-3 rounded-xl hover:bg-primary/90 hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
