import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const expenseItems = expenses.filter(e => e.type === 'expense');

  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#10B981', 
          '#0ea5e9', 
          '#f59e0b', 
          '#8b5cf6', 
          '#ec4899', 
        ],
        borderColor: '#131313',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          font: { family: 'Lexend' },
          padding: 20,
        }
      }
    },
    cutout: '75%',
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-white/10 p-6 h-[320px] animate-fade-in-up hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
      <h2 className="text-lg font-semibold mb-4 text-white">Spending by Category</h2>
      {expenseItems.length > 0 ? (
        <div className="h-[220px] flex justify-center">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-white/50">
          No expenses recorded yet.
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
