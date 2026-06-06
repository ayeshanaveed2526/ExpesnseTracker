import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus } from 'lucide-react';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Settings from './components/Settings';
import ExpenseForm from './components/ExpenseForm';

const initialExpenses = [
  { id: 1, title: 'Grocery Shopping', date: '2026-10-24', amount: 4500, category: 'Food', type: 'expense' },
  { id: 2, title: 'Uber to Airport', date: '2026-10-23', amount: 1200, category: 'Transport', type: 'expense' },
  { id: 3, title: 'Freelance Payment', date: '2026-10-21', amount: 45000, category: 'Income', type: 'income' },
  { id: 4, title: 'Apartment Rent', date: '2026-10-01', amount: 25000, category: 'Housing', type: 'expense' },
];

const initialBudgets = [
  { category: 'Food', limit: 20000 },
  { category: 'Transport', limit: 10000 },
  { category: 'Housing', limit: 40000 },
];

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finpulse_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finpulse_budgets');
    return saved ? JSON.parse(saved) : initialBudgets;
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finpulse_theme') || 'dark';
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('finpulse_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('finpulse_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finpulse_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleAddOrEdit = (exp) => {
    if (expenseToEdit) {
      setExpenses(expenses.map(e => e.id === exp.id ? exp : e));
    } else {
      setExpenses([exp, ...expenses]);
    }
    setIsFormOpen(false);
    setExpenseToEdit(null);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateBudget = (category, newLimit) => {
    setBudgets(budgets.map(b => b.category === category ? { ...b, limit: newLimit } : b));
  };

  const openAddForm = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (exp) => {
    setExpenseToEdit(exp);
    setIsFormOpen(true);
  };

  return (
    <div className={`min-h-screen bg-surface text-text-main relative overflow-x-hidden ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface' : ''}`}>
      
      {/* Animated Grainy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary rounded-full filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-3/4 h-3/4 bg-emerald-500 rounded-full filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-teal-800 rounded-full filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 bg-surface-bright/40 backdrop-blur-md border border-border-main p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.4)] flex-shrink-0 bg-white">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent"> FinTracker</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={openAddForm}
              className="flex-1 sm:flex-none bg-primary text-secondary font-semibold py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:scale-95 transition-transform active:scale-90 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              <span>Record Transaction</span>
            </button>
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 bg-surface rounded-xl border border-border-main text-text-muted hover:text-text-main transition-colors hover:scale-95"
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        {/* Top Summary Row */}
        <div className="mb-8">
          <Summary expenses={expenses} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Charts & Budgets) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <ExpenseChart expenses={expenses} theme={theme} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Budgets expenses={expenses} budgets={budgets} onUpdateBudget={updateBudget} />
            </div>
          </div>

          {/* Right Column (Transactions) */}
          <div className="lg:col-span-5 h-[800px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Transactions expenses={expenses} onEdit={openEditForm} onDelete={deleteExpense} />
          </div>

        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
            <ExpenseForm 
              onClose={() => { setIsFormOpen(false); setExpenseToEdit(null); }} 
              onSave={handleAddOrEdit} 
              initialData={expenseToEdit}
            />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <Settings 
          theme={theme} 
          toggleTheme={toggleTheme} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;