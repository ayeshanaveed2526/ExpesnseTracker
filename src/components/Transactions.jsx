import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ExpenseList from './ExpenseList';
import { ArrowUpDown } from 'lucide-react';

const Transactions = () => {
  const { expenses } = useOutletContext();
  const [sortOrder, setSortOrder] = useState('newest');

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    } else if (sortOrder === 'highest') {
      return b.amount - a.amount;
    } else if (sortOrder === 'lowest') {
      return a.amount - b.amount;
    }
    return 0;
  });

  return (
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-4 md:p-6 animate-fade-in-up shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-text-main">All Transactions</h2>
        
        <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-border-main">
          <ArrowUpDown size={16} className="text-text-muted" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer appearance-none pr-4"
          >
            <option value="newest" className="bg-surface text-text-main">Newest First</option>
            <option value="oldest" className="bg-surface text-text-main">Oldest First</option>
            <option value="highest" className="bg-surface text-text-main">Highest Amount</option>
            <option value="lowest" className="bg-surface text-text-main">Lowest Amount</option>
          </select>
        </div>
      </div>
      <ExpenseList expenses={sortedExpenses} />
    </div>
  );
};

export default Transactions;
