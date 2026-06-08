import { useState } from 'react';
import { TrendingUp, TrendingDown, Wallet, CreditCard, Target, Pencil, Check, X, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import { monthExpenseTotal } from '../lib/period';
import { getCategory } from '../lib/categories';

const Summary = ({ expenses = [], allExpenses = [], periodLabel = 'This Month', currencySymbol = 'Rs.', savingsGoal = 0, onUpdateSavingsGoal, categories = [] }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [editGoalValue, setEditGoalValue] = useState(savingsGoal.toString());

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const savingsProgress = savingsGoal > 0 ? Math.max(0, Math.min((balance / savingsGoal) * 100, 100)) : 0;

  // --- Insights: this calendar month vs last (independent of selected period) ---
  const thisMonth = monthExpenseTotal(allExpenses, 0);
  const lastMonth = monthExpenseTotal(allExpenses, 1);
  let momDelta = null;
  if (lastMonth > 0) momDelta = ((thisMonth - lastMonth) / lastMonth) * 100;
  else if (thisMonth > 0) momDelta = 100;

  // Top spending category within the currently scoped period.
  const catTotals = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const topEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const handleStartEdit = () => {
    setEditGoalValue(savingsGoal.toString());
    setIsEditingGoal(true);
  };

  const handleSaveGoal = () => {
    const val = parseFloat(editGoalValue);
    if (!isNaN(val) && val >= 0) {
      if (onUpdateSavingsGoal) onUpdateSavingsGoal(val);
      setIsEditingGoal(false);
    } else {
      alert("Savings target must be a valid number greater than or equal to zero.");
    }
  };

  const handleCancelEdit = () => setIsEditingGoal(false);

  const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Net Balance</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/10">
                <Wallet size={18} />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-text-main flex items-baseline">
              <span className="text-lg font-medium text-emerald-500 mr-1.5">{currencySymbol}</span>
              <AnimatedNumber value={balance} format={money} />
            </h3>
          </div>
          <div className="mt-6 flex items-center text-text-muted text-xs font-semibold tracking-wide uppercase">
            <TrendingUp size={14} className="mr-1 text-emerald-500" />
            <span>{periodLabel}</span>
          </div>
        </div>

        {/* Total Spending Card */}
        <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-rose-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,63,94,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all duration-500 pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Total Spendings</span>
              <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/10">
                <CreditCard size={18} />
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-text-main flex items-baseline">
              <span className="text-lg font-medium text-rose-500 mr-1.5">{currencySymbol}</span>
              <AnimatedNumber value={totalExpense} format={money} />
            </h3>
          </div>
          <div className="mt-6 flex items-center text-rose-500 text-xs font-semibold tracking-wide uppercase">
            <TrendingDown size={14} className="mr-1" />
            <span>Monitor outgoings</span>
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Savings Target</span>

              <div className="flex items-center gap-2">
                {isEditingGoal ? (
                  <div className="flex items-center gap-1 bg-surface border border-border-main rounded-lg px-2 py-1 shadow-inner z-10">
                    <span className="text-[10px] text-text-muted">{currencySymbol}</span>
                    <input
                      type="number"
                      value={editGoalValue}
                      onChange={(e) => setEditGoalValue(e.target.value)}
                      className="bg-transparent text-xs font-bold text-text-main w-20 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleSaveGoal} className="text-primary hover:text-emerald-400 p-0.5 cursor-pointer" title="Save">
                      <Check size={12} />
                    </button>
                    <button onClick={handleCancelEdit} className="text-rose-500 hover:text-rose-400 p-0.5 cursor-pointer" title="Cancel">
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg bg-surface border border-border-main hover:scale-95 transition-all text-text-muted hover:text-primary cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Edit Savings Target"
                  >
                    <Pencil size={12} />
                  </button>
                )}

                <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
                  <Target size={18} />
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-text-main flex items-baseline mb-2">
              <span className="text-lg font-medium text-primary mr-1.5">{currencySymbol}</span>
              {savingsGoal.toLocaleString('en-US')}
            </h3>
            <div className="w-full bg-surface-bright border border-border-main rounded-full h-1.5 overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${savingsProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-text-muted">
            <span>Progress</span>
            <span className="text-primary font-bold">{savingsProgress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Insight Chips */}
      {(momDelta !== null || topEntry) && (
        <div className="flex flex-wrap items-center gap-2">
          {momDelta !== null && (
            <div className="inline-flex items-center gap-1.5 bg-surface-bright/40 border border-border-main rounded-full px-3 py-1.5 text-[11px] font-bold text-text-muted shadow-sm">
              {momDelta > 0 ? (
                <ArrowUp size={12} className="text-rose-500" />
              ) : momDelta < 0 ? (
                <ArrowDown size={12} className="text-emerald-500" />
              ) : (
                <Minus size={12} className="text-text-muted" />
              )}
              <span className="text-text-main">Spending</span>
              <span className={momDelta > 0 ? 'text-rose-500' : momDelta < 0 ? 'text-emerald-500' : 'text-text-muted'}>
                {momDelta > 0 ? '+' : ''}{Math.abs(momDelta) >= 999 ? '999' : momDelta.toFixed(0)}%
              </span>
              <span>vs last month</span>
            </div>
          )}
          {topEntry && (
            <div className="inline-flex items-center gap-1.5 bg-surface-bright/40 border border-border-main rounded-full px-3 py-1.5 text-[11px] font-bold text-text-muted shadow-sm">
              <span aria-hidden>{getCategory(categories, topEntry[0]).emoji}</span>
              <span>Top category</span>
              <span className="text-text-main">{topEntry[0]}</span>
              <span className="text-text-muted/70">({currencySymbol} {money(topEntry[1])})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Summary;
