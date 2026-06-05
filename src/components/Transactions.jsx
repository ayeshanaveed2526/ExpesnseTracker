import React from 'react';
import { useOutletContext } from 'react-router-dom';
import ExpenseList from './ExpenseList';

const Transactions = () => {
  const { expenses } = useOutletContext();

  return (
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-white/10 p-4 md:p-6 animate-fade-in-up shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">All Transactions</h2>
      </div>
      <ExpenseList expenses={expenses} />
    </div>
  );
};

export default Transactions;
