import { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PieChart, BarChart3 } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FALLBACK_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#F43F5E', '#06B6D4', '#14B8A6'];

// Vertical gradient for the bars (top bright → bottom deep).
const makeBarGradient = (ctx, area, from, to) => {
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  return g;
};

const ExpenseChart = ({ expenses = [], theme = 'dark', currencySymbol = 'Rs.', categories = [] }) => {
  const [activeTab, setActiveTab] = useState('category');
  const isLight = theme === 'light';

  // --- Theme Colors ---
  const textColor = isLight ? '#475569' : '#a1a1aa';
  const strongText = isLight ? '#0f172a' : '#ffffff';
  const gridColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)';
  const tooltipBg = isLight ? '#ffffff' : '#18181b';
  const tooltipText = isLight ? '#0f172a' : '#ffffff';
  const tooltipBorder = isLight ? '#e2e8f0' : 'rgba(255,255,255,0.1)';
  const ringTrack = isLight ? '#ffffff' : '#18181b';

  // --- Doughnut Data (Category Share) ---
  const expenseItems = expenses.filter(e => e.type === 'expense');
  const categoryTotals = expenseItems.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const doughnutLabels = Object.keys(categoryTotals);
  const doughnutValues = Object.values(categoryTotals);
  const doughnutTotal = doughnutValues.reduce((a, b) => a + b, 0);

  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        backgroundColor: doughnutLabels.map((name, i) => {
          const cat = categories.find(c => c.name === name);
          return cat ? cat.color : FALLBACK_COLORS[i % FALLBACK_COLORS.length];
        }),
        borderColor: ringTrack,
        borderWidth: 3,
        hoverOffset: 14,
        hoverBorderColor: ringTrack,
        borderRadius: 6,
        spacing: 2,
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
        backgroundColor: (ctx) => {
          const { chartArea, ctx: c } = ctx.chart;
          if (!chartArea) return '#10B981';
          return makeBarGradient(c, chartArea, '#34D399', '#059669');
        },
        hoverBackgroundColor: '#6EE7B7',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 26,
      },
      {
        label: 'Expenses',
        data: months.map(m => monthlyData[m].expense),
        backgroundColor: (ctx) => {
          const { chartArea, ctx: c } = ctx.chart;
          if (!chartArea) return '#F43F5E';
          return makeBarGradient(c, chartArea, '#FB7185', '#E11D48');
        },
        hoverBackgroundColor: '#FDA4AF',
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 26,
      },
    ],
  };

  // --- Inline plugins (closure over theme + currency) ---

  // Soft drop shadow under the doughnut arcs for depth.
  const arcShadow = {
    id: 'arcShadow',
    beforeDatasetsDraw(chart) {
      const { ctx } = chart;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 5;
    },
    afterDatasetsDraw(chart) {
      chart.ctx.restore();
    },
  };

  // Live "SPENT / total" readout in the middle of the ring.
  const centerLabel = {
    id: 'centerLabel',
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = textColor;
      ctx.font = "700 10px 'Lexend', sans-serif";
      ctx.fillText('SPENT', cx, cy - 13);
      ctx.fillStyle = strongText;
      ctx.font = "700 17px 'Lexend', sans-serif";
      ctx.fillText(`${currencySymbol} ${doughnutTotal.toLocaleString('en-US')}`, cx, cy + 6);
      ctx.restore();
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    layout: { padding: 6 },
    animation: { animateRotate: true, animateScale: true, duration: 900, easing: 'easeOutQuart' },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: textColor,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
          font: { family: "'Lexend', sans-serif", size: 11 },
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
          label: (context) => {
            const value = context.parsed;
            const pct = doughnutTotal > 0 ? ((value / doughnutTotal) * 100).toFixed(1) : '0';
            return `${context.label}: ${currencySymbol} ${value.toLocaleString('en-US')} (${pct}%)`;
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: "'Lexend', sans-serif", size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        border: { display: false },
        ticks: {
          color: textColor,
          font: { family: "'Lexend', sans-serif", size: 10 },
          callback: (value) => `${currencySymbol}${value.toLocaleString()}`,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          boxWidth: 12,
          usePointStyle: true,
          font: { family: "'Lexend', sans-serif", size: 11 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        bodyColor: tooltipText,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          // context.parsed is {x, y} for bars — read .y, not the whole object.
          label: (context) => `${context.dataset.label}: ${currencySymbol} ${context.parsed.y.toLocaleString('en-US')}`,
        },
      },
    },
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
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[arcShadow, centerLabel]} />
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
