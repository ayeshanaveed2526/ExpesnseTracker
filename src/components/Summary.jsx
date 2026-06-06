import { TrendingUp, TrendingDown, Wallet, CreditCard, Target } from 'lucide-react';

const Summary = ({ expenses = [], currencySymbol = 'Rs.' }) => {
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const savingsGoal = 100000;
  const savingsProgress = Math.max(0, Math.min((balance / savingsGoal) * 100, 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
      {/* Total Balance Card */}
      <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500"></div>
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Net Balance</span>
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/10">
              <Wallet size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-text-main flex items-baseline">
            <span className="text-lg font-medium text-emerald-500 mr-1.5">{currencySymbol}</span>
            {balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="mt-6 flex items-center text-emerald-500 text-xs font-semibold tracking-wide uppercase">
          <TrendingUp size={14} className="mr-1 animate-bounce" />
          <span>Cash Flow is active</span>
        </div>
      </div>
      
      {/* Total Spending Card */}
      <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-rose-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,63,94,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all duration-500"></div>
        <div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Total Spendings</span>
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500 border border-rose-500/10">
              <CreditCard size={18} />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-text-main flex items-baseline">
            <span className="text-lg font-medium text-rose-500 mr-1.5">{currencySymbol}</span>
            {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="mt-6 flex items-center text-rose-500 text-xs font-semibold tracking-wide uppercase">
          <TrendingDown size={14} className="mr-1" />
          <span>Monitor outgoings</span>
        </div>
      </div>

      {/* Savings Goal Card */}
      <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-0.5 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-text-muted text-sm font-semibold tracking-wide uppercase">Savings Target</span>
            <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
              <Target size={18} />
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
  );
};

export default Summary;
