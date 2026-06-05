import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Budgets = () => {
  const { expenses } = useOutletContext();
  
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const budgets = [
    { category: 'Food', limit: 20000 },
    { category: 'Transport', limit: 10000 },
    { category: 'Housing', limit: 40000 },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-white mb-6">Monthly Budgets</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget, index) => {
          const spent = categoryTotals[budget.category] || 0;
          const percentage = Math.min((spent / budget.limit) * 100, 100);
          const isOver = spent > budget.limit;

          return (
            <div key={index} className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-white">{budget.category}</h3>
                <span className={`text-sm font-bold ${isOver ? 'text-danger' : 'text-white/70'}`}>
                  Rs. {spent.toLocaleString('en-PK')} / Rs. {budget.limit.toLocaleString('en-PK')}
                </span>
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
