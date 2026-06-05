import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses = [] }) => {
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
          '#10B981', // primary
          '#3B82F6', // blue
          '#F59E0B', // amber
          '#8B5CF6', // purple
          '#EC4899', // pink
        ],
        borderWidth: 0,
        hoverOffset: 15,
        borderRadius: 4,
        spacing: 2
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text-muted)',
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Hanken Grotesk', sans-serif",
            size: 13
          }
        },
      },
      tooltip: {
        backgroundColor: '#18181b',
        titleColor: '#10B981',
        bodyColor: 'var(--text-main)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += 'Rs. ' + context.parsed.toLocaleString('en-PK');
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-6 h-[320px] animate-fade-in-up hover:border-border-main transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]">
      <h2 className="text-lg font-semibold mb-4 text-text-main">Spending by Category</h2>
      {expenseItems.length > 0 ? (
        <div className="h-[220px] flex justify-center">
          <Doughnut data={data} options={options} />
        </div>
      ) : (
        <div className="h-[220px] flex items-center justify-center text-text-muted">
          No expenses recorded yet.
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
