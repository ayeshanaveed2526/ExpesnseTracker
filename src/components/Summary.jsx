import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Summary = ({ expenses = [] }) => {
  const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const savingsGoal = 100000;
  const savingsProgress = Math.min((balance / savingsGoal) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up">
      <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1">
        <p className="text-text-main/60 text-sm font-medium mb-1">Total Balance</p>
        <h3 className="text-3xl font-bold flex items-center">
          <span className="mr-2">Rs.</span>
          {balance.toLocaleString('en-PK')}
        </h3>
        <div className="mt-4 flex items-center text-primary text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          <span>Looking good!</span>
        </div>
      </div>
      
      <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-6 hover:border-danger/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] hover:-translate-y-1">
        <p className="text-text-main/60 text-sm font-medium mb-1">Total Spending</p>
        <h3 className="text-3xl font-bold flex items-center">
          <span className="mr-2">Rs.</span>
          {totalExpense.toLocaleString('en-PK')}
        </h3>
        <div className="mt-4 flex items-center text-danger text-sm font-medium">
          <TrendingDown size={16} className="mr-1" />
          <span>Keep an eye on this</span>
        </div>
      </div>

      <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1">
        <p className="text-text-main/60 text-sm font-medium mb-1">Savings Goal</p>
        <h3 className="text-3xl font-bold flex items-center text-primary">
          <span className="mr-2">Rs.</span>
          {savingsGoal.toLocaleString('en-PK')}
        </h3>
        <div className="mt-4 w-full bg-surface rounded-full h-2 overflow-hidden">
          <div className="bg-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.max(savingsProgress, 0)}%` }}></div>
        </div>
        <p className="text-xs text-text-muted mt-2 text-right">{savingsProgress.toFixed(1)}% Achieved</p>
      </div>
    </div>
  );
};

export default Summary;
