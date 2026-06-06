import { useState } from 'react';
import { Pencil, Check, X, AlertTriangle, Trash2, Plus } from 'lucide-react';

const Budgets = ({ expenses, budgets = [], onUpdateBudget, onDeleteBudget, currencySymbol = 'Rs.' }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('Food');
  const [newLimit, setNewLimit] = useState('');
  
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const availableCategories = ['Food', 'Transport', 'Housing'].filter(
    cat => !budgets.some(b => b.category === cat)
  );

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

  const startAdd = () => {
    if (availableCategories.length > 0) {
      setNewCategory(availableCategories[0]);
      setNewLimit('');
      setIsAdding(true);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const limitNum = parseFloat(newLimit);
    if (!isNaN(limitNum) && limitNum > 0) {
      onUpdateBudget(newCategory, limitNum);
      setIsAdding(false);
      setNewLimit('');
    } else {
      alert("Budget limit must be a valid number greater than zero.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-main tracking-tight">Monthly Budgets</h2>
        {availableCategories.length > 0 && !isAdding && (
          <button 
            onClick={startAdd}
            className="flex items-center gap-1 bg-primary text-zinc-950 text-xs font-bold py-1.5 px-3 rounded-xl hover:scale-[0.98] transition-all active:scale-95 cursor-pointer shadow-md shadow-primary/10"
          >
            <Plus size={13} />
            <span>Add Budget</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const spent = categoryTotals[budget.category] || 0;
          const percentage = budget.limit > 0 ? Math.max(0, Math.min((spent / budget.limit) * 100, 100)) : 0;
          const isOver = budget.limit > 0 && spent > budget.limit;
          const isNear = budget.limit > 0 && spent >= budget.limit * 0.8 && spent <= budget.limit;
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
                      <button 
                        onClick={() => onDeleteBudget && onDeleteBudget(budget.category)}
                        className="text-text-muted hover:text-rose-500 transition-all p-1.5 rounded-lg bg-surface border border-border-main hover:scale-95 cursor-pointer shadow-sm"
                        title="Delete Budget"
                      >
                        <Trash2 size={12} />
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

        {isAdding && (
          <div className="bg-surface-bright/30 backdrop-blur-xl rounded-2xl border border-primary/30 p-5 relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="font-bold text-text-main text-sm mb-3">Add Budget Limit</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-surface text-xs text-text-main border border-border-main rounded-lg px-2.5 py-2 cursor-pointer font-bold focus:outline-none focus:border-primary"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat} className="bg-surface-bright text-text-main">{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Limit ({currencySymbol})</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full bg-surface text-xs text-text-main border border-border-main rounded-lg px-2.5 py-2 font-bold focus:outline-none focus:border-primary"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-surface border border-border-main text-[11px] font-bold py-2 rounded-lg text-text-main hover:scale-95 transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-primary text-zinc-950 text-[11px] font-bold py-2 rounded-lg hover:scale-95 transition-all cursor-pointer text-center"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        )}

        {budgets.length === 0 && !isAdding && (
          <div className="col-span-full bg-surface-bright/10 rounded-2xl border border-dashed border-border-main p-8 text-center flex flex-col items-center justify-center gap-3">
            <span className="text-text-muted text-xs font-semibold">No budget limits configured yet.</span>
            {availableCategories.length > 0 && (
              <button 
                onClick={startAdd}
                className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-xl hover:scale-95 transition-all cursor-pointer"
              >
                <Plus size={12} />
                <span>Configure Budget</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;
