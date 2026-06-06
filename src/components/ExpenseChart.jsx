import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ExpenseChart = ({ expenses = [], theme = 'dark', currencySymbol = 'Rs.' }) => {
  const [activeTab, setActiveTab] = useState('category');
  const isLight = theme === 'light';

  // --- Doughnut Data (Category Share) ---
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#10B981', // primary green
          '#3B82F6', // blue
          '#F59E0B', // amber
          '#8B5CF6', // purple
          '#EC4899', // pink
        ],
        borderWidth: 0,
        hoverOffset: 12,
        borderRadius: 4,
        spacing: 2
      },
    ],
  };

  // --- Bar Data (Cash Flow) ---
  const getMonthYear = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const normalized = dateStr.includes(',') ? dateStr : dateStr.replace(/-/g, '/');
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return 'Unknown';
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const monthlyData = expenses.reduce((acc, curr) => {
    const month = getMonthYear(curr.date);
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    if (curr.type === 'income') {
      acc[month].income += curr.amount;
    } else {
      acc[month].expense += curr.amount;
    }
    return acc;
  }, {});

  // Sort months chronologically
  const months = Object.keys(monthlyData).sort((a, b) => {
    const parseMonth = (str) => {
      const parts = str.split(' ');
      return new Date(`20${parts[1]} ${parts[0]} 1`);
    };
    return parseMonth(a) - parseMonth(b);
  });

  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthlyData[m].income),
        backgroundColor: '#10B981',
        borderRadius: 6,
        maxBarThickness: 20,
      },
      {
        label: 'Expenses',
        data: months.map(m => monthlyData[m].expense),
        backgroundColor: '#EF4444',
        borderRadius: 6,
        maxBarThickness: 20,
      }
    ]
  };

  // --- Theme Colors ---
  const textColor = isLight ? '#475569' : '#a1a1aa';
  const gridColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const tooltipBg = isLight ? '#ffffff' : '#18181b';
  const tooltipText = isLight ? '#0f172a' : '#ffffff';
  const tooltipBorder = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)';

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: {
            family: "'Lexend', sans-serif",
            size: 11
          }
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: '#10B981',
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${currencySymbol} ${context.parsed.toLocaleString('en-US')}`;
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: "'Lexend', sans-serif", size: 10 }
        }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: "'Lexend', sans-serif", size: 10 },
          callback: (value) => `${currencySymbol}${value.toLocaleString()}`
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          boxWidth: 12,
          usePointStyle: true,
          font: { family: "'Lexend', sans-serif", size: 11 }
        }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${currencySymbol} ${context.parsed.toLocaleString('en-US')}`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-6 h-[330px] flex flex-col justify-between hover:border-border-main/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.02)]">
      
      {/* Header and Switch Tabs */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-main tracking-tight">Analytics</h2>
        
        <div className="flex bg-surface-bright border border-border-main p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('category')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'category' ? 'bg-primary text-zinc-950 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            <PieChart size={14} />
            <span>Category Share</span>
          </button>
          <button 
            onClick={() => setActiveTab('cashflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'cashflow' ? 'bg-primary text-zinc-950 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            <BarChart3 size={14} />
            <span>Cash Flow</span>
          </button>
        </div>
      </div>

      {/* Chart Render Area */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'category' ? (
          expenseItems.length > 0 ? (
            <div className="h-full w-full py-1">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-sm font-medium">
              No expenses recorded yet.
            </div>
          )
        ) : (
          expenses.length > 0 ? (
            <div className="h-full w-full py-1">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-text-muted text-sm font-medium">
              No transactions recorded yet.
            </div>
          )
        )}
      </div>

    </div>
  );
};

export default ExpenseChart;
