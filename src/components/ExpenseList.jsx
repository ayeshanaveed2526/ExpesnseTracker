import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses = [] }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No transactions yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col -mx-4 md:mx-0">
      {expenses.map((expense, index) => (
        <ExpenseItem key={expense.id} index={index} {...expense} />
      ))}
    </div>
  );
};

export default ExpenseList;
