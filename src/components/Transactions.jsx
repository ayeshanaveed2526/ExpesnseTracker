import React, { useState } from 'react';

import ExpenseList from './ExpenseList';
import { ArrowUpDown, Filter } from 'lucide-react';

const Transactions = ({ expenses, onEdit, onDelete }) => {
  
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredExpenses = expenses.filter(exp => 
    filterCategory === 'All' || exp.category === filterCategory
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
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
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-4 md:p-6 animate-fade-in-up shadow-2xl h-full flex flex-col">
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-text-main">All Transactions</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-border-main flex-1 min-w-[140px]">
            <Filter size={16} className="text-text-muted" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer appearance-none pr-4 w-full"
            >
              <option value="All" className="bg-surface text-text-main">All Categories</option>
              <option value="Food" className="bg-surface text-text-main">Food</option>
              <option value="Transport" className="bg-surface text-text-main">Transport</option>
              <option value="Housing" className="bg-surface text-text-main">Housing</option>
              <option value="Income" className="bg-surface text-text-main">Income</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 border border-border-main flex-1 min-w-[140px]">
            <ArrowUpDown size={16} className="text-text-muted" />
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm text-text-main focus:outline-none cursor-pointer appearance-none pr-4 w-full"
            >
              <option value="newest" className="bg-surface text-text-main">Newest First</option>
              <option value="oldest" className="bg-surface text-text-main">Oldest First</option>
              <option value="highest" className="bg-surface text-text-main">Highest Amount</option>
              <option value="lowest" className="bg-surface text-text-main">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
        <ExpenseList expenses={sortedExpenses} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default Transactions;
