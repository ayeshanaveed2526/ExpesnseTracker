import React, { useState } from 'react';

import { Pencil, Check, X } from 'lucide-react';

const Budgets = ({ expenses, budgets, onUpdateBudget }) => {
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const startEdit = (category, limit) => {
    setEditingCategory(category);
    setEditLimit(limit.toString());
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditLimit('');
  };

  const saveEdit = (category) => {
    const limitNum = parseFloat(editLimit);
    if (!isNaN(limitNum) && limitNum > 0) {
      onUpdateBudget(category, limitNum);
      setEditingCategory(null);
    } else {
      alert("Budget limit must be a valid number greater than zero.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-text-main mb-6">Monthly Budgets</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const spent = categoryTotals[budget.category] || 0;
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOver = spent > budget.limit;
          const isEditing = editingCategory === budget.category;

          return (
            <div key={index} className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-text-main">{budget.category}</h3>
                
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-2 bg-surface rounded-lg px-2 py-1 border border-border-main">
                      <span className="text-sm text-text-muted">Rs.</span>
                      <input 
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="bg-transparent text-sm font-bold text-text-main w-20 focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(budget.category)} className="text-primary hover:text-emerald-400 p-1">
                        <Check size={14} />
                      </button>
                      <button onClick={cancelEdit} className="text-danger hover:text-red-400 p-1">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isOver ? 'text-danger' : 'text-text-muted'}`}>
                        Rs. {spent.toLocaleString('en-PK')} / Rs. {budget.limit.toLocaleString('en-PK')}
                      </span>
                      <button 
                        onClick={() => startEdit(budget.category, budget.limit)}
                        className="text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full bg-surface rounded-full h-3 overflow-hidden mt-4">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isOver ? 'bg-danger' : 'bg-primary'}`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Budgets;
