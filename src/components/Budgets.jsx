import { useState } from 'react';
import { Pencil, Check, X, AlertTriangle } from 'lucide-react';

const Budgets = ({ expenses, budgets, onUpdateBudget, currencySymbol = 'Rs.' }) => {
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
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-main tracking-tight">Monthly Budgets</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const spent = categoryTotals[budget.category] || 0;
          const percentage = Math.max(0, Math.min((spent / budget.limit) * 100, 100));
          const isOver = spent > budget.limit;
          const isNear = spent >= budget.limit * 0.8 && spent <= budget.limit;
          const isEditing = editingCategory === budget.category;

          // Alert status styling
          let statusLabel = "On Track";
          let barColor = "bg-emerald-500";
          let badgeColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/10";
          if (isOver) {
            statusLabel = "Over Budget";
            barColor = "bg-rose-500";
            badgeColor = "text-rose-500 bg-rose-500/10 border-rose-500/10";
          } else if (isNear) {
            statusLabel = "Near Limit";
            barColor = "bg-amber-500";
            badgeColor = "text-amber-500 bg-amber-500/10 border-amber-500/10";
          }

          return (
            <div 
              key={index} 
              className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5 group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-text-main text-base">{budget.category}</h3>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1.5 ${badgeColor}`}>
                    {isOver && <AlertTriangle size={10} />}
                    {statusLabel}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <div className="flex items-center gap-1 bg-surface-bright border border-border-main rounded-xl px-2 py-1 shadow-inner">
                      <span className="text-xs text-text-muted">{currencySymbol}</span>
                      <input 
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(e.target.value)}
                        className="bg-transparent text-xs font-bold text-text-main w-20 focus:outline-none"
                        autoFocus
                      />
                      <button 
                        onClick={() => saveEdit(budget.category)} 
                        className="text-emerald-500 hover:text-emerald-400 p-1 cursor-pointer"
                        title="Save"
                      >
                        <Check size={12} />
                      </button>
                      <button 
                        onClick={cancelEdit} 
                        className="text-rose-500 hover:text-rose-400 p-1 cursor-pointer"
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs text-text-muted block font-medium">Spent / Limit</span>
                        <span className={`text-xs font-bold ${isOver ? 'text-rose-500' : 'text-text-main'}`}>
                          {currencySymbol} {spent.toLocaleString('en-US')} / {currencySymbol} {budget.limit.toLocaleString('en-US')}
                        </span>
                      </div>
                      <button 
                        onClick={() => startEdit(budget.category, budget.limit)}
                        className="text-text-muted hover:text-primary transition-all p-1.5 rounded-lg bg-surface border border-border-main hover:scale-95 cursor-pointer shadow-sm"
                        title="Edit Budget Limit"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-bright border border-border-main rounded-full h-2 overflow-hidden mt-4">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${barColor}`} 
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
