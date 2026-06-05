import React from 'react';
import ExpenseItem from './ExpenseItem';

const mockExpenses = [
  { id: 1, title: 'Grocery Shopping', date: 'Oct 24, 2026', amount: 4500, category: 'Food', type: 'expense' },
  { id: 2, title: 'Uber to Airport', date: 'Oct 23, 2026', amount: 1200, category: 'Transport', type: 'expense' },
  { id: 3, title: 'Freelance Payment', date: 'Oct 21, 2026', amount: 45000, category: 'Income', type: 'income' },
  { id: 4, title: 'Apartment Rent', date: 'Oct 01, 2026', amount: 25000, category: 'Housing', type: 'expense' },
];

const ExpenseList = () => {
  return (
    <div className="flex flex-col -mx-4 md:mx-0">
      {mockExpenses.map(expense => (
        <ExpenseItem key={expense.id} {...expense} />
      ))}
    </div>
  );
};

export default ExpenseList;
