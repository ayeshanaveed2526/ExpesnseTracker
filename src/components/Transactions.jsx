import { useState } from 'react';
import ExpenseList from './ExpenseList';
import { ArrowUpDown, Filter, Search, Download } from 'lucide-react';

const Transactions = ({ expenses, onEdit, onDelete, currencySymbol = 'Rs.' }) => {
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filteredExpenses = expenses.filter(exp => {
    const matchesCategory = filterCategory === 'All' || exp.category === filterCategory;
    const matchesType = filterType === 'All' || exp.type === filterType;
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exp.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  // Sorting
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

  // CSV Exporter
  const handleExportCSV = () => {
    try {
      const csvHeaders = ["ID", "Title", "Date", "Amount", "Category", "Type"];
      const csvRows = sortedExpenses.map(e => [
        e.id,
        `"${e.title.replace(/"/g, '""')}"`,
        e.date,
        e.amount,
        e.category,
        e.type
      ]);
      const csvContent = [csvHeaders.join(","), ...csvRows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `finpulse_transactions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export CSV: " + err.message);
    }
  };

  return (
    <div className="bg-surface-bright/20 backdrop-blur-xl rounded-2xl border border-border-main p-5 shadow-2xl h-full flex flex-col hover:border-border-main/50 transition-all duration-300">
      
      {/* Title & Export */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-main tracking-tight">Ledger</h2>
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-bright/80 hover:bg-glass border border-border-main text-xs font-bold text-text-muted hover:text-text-main hover:scale-95 transition-all rounded-xl cursor-pointer shadow-sm"
          title="Export CSV"
        >
          <Download size={14} className="text-primary" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3 flex items-center bg-surface-bright/50 rounded-xl px-3 py-2 border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
        <Search size={16} className="text-text-muted mr-2" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search descriptions..."
          className="bg-transparent text-xs text-text-main focus:outline-none w-full placeholder:text-text-muted/50"
        />
      </div>

      {/* Tab Filter Type */}
      <div className="flex bg-surface-bright border border-border-main p-0.5 rounded-xl mb-3">
        {['All', 'income', 'expense'].map((t) => (
          <button 
            key={t}
            onClick={() => setFilterType(t)}
            className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${filterType === t ? 'bg-primary text-zinc-950 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            {t === 'All' ? 'All Types' : t}
          </button>
        ))}
      </div>

      {/* Filters & Sorting */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1.5 bg-surface-bright/50 rounded-xl px-2.5 py-1.5 border border-border-main shadow-inner relative">
          <Filter size={12} className="text-text-muted" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-[11px] text-text-main focus:outline-none cursor-pointer appearance-none pr-3 w-full font-bold"
          >
            <option value="All" className="bg-zinc-900 text-text-main">All Categories</option>
            <option value="Food" className="bg-zinc-900 text-text-main">Food</option>
            <option value="Transport" className="bg-zinc-900 text-text-main">Transport</option>
            <option value="Housing" className="bg-zinc-900 text-text-main">Housing</option>
            <option value="Income" className="bg-zinc-900 text-text-main">Income</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-1.5 bg-surface-bright/50 rounded-xl px-2.5 py-1.5 border border-border-main shadow-inner relative">
          <ArrowUpDown size={12} className="text-text-muted" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-[11px] text-text-main focus:outline-none cursor-pointer appearance-none pr-3 w-full font-bold"
          >
            <option value="newest" className="bg-zinc-900 text-text-main">Newest First</option>
            <option value="oldest" className="bg-zinc-900 text-text-main">Oldest First</option>
            <option value="highest" className="bg-zinc-900 text-text-main">Highest Amount</option>
            <option value="lowest" className="bg-zinc-900 text-text-main">Lowest Amount</option>
          </select>
        </div>
      </div>
      
      {/* Scrollable list */}
      <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
        <ExpenseList 
          expenses={sortedExpenses} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
};

export default Transactions;
