import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, Plus } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import SettingsView from './components/Settings';
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

function Layout({ expenses, onAddExpense, onEditExpense, onDeleteExpense, budgets, onUpdateBudget, theme, toggleTheme }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const location = useLocation();

  const handleAddOrEdit = (exp) => {
    if (expenseToEdit) {
      onEditExpense(exp);
    } else {
      onAddExpense(exp);
    }
    setIsFormOpen(false);
    setExpenseToEdit(null);
  };

  const openAddForm = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (exp) => {
    setExpenseToEdit(exp);
    setIsFormOpen(true);
  };

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/transactions': return 'Transactions';
      case '/budgets': return 'Budgets';
      case '/settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row bg-surface text-text-main relative overflow-hidden ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface' : ''}`}>
      
      {/* Animated Grainy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-3/4 h-3/4 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-3/4 h-3/4 bg-teal-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-surface-bright/50 backdrop-blur-xl border-r border-border-main p-6 h-screen sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-surface font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            ET
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">Expense Tracker</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/transactions" icon={<ArrowRightLeft size={20} />} label="Transactions" />
          <NavItem to="/budgets" icon={<Wallet size={20} />} label="Budgets" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button 
          onClick={openAddForm}
          className="mt-auto w-full bg-primary text-secondary font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-95 transition-transform active:scale-90 shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          <span>Record Expense</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-6xl mx-auto w-full relative z-10">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-surface font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]">ET</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">{getPageTitle()}</h1>
          </div>
        </header>

        <Outlet context={{ expenses, onEdit: openEditForm, onDelete: onDeleteExpense, budgets, onUpdateBudget, theme, toggleTheme }} />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-bright border-t border-border-main px-6 py-4 flex justify-between items-center z-40">
        <MobileNavItem to="/" icon={<LayoutDashboard size={24} />} />
        <MobileNavItem to="/transactions" icon={<ArrowRightLeft size={24} />} />
        <div className="relative -top-6">
          <button 
            onClick={openAddForm}
            className="w-14 h-14 bg-primary text-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-95 transition-transform active:scale-90 border-4 border-surface"
          >
            <Plus size={28} />
          </button>
        </div>
        <MobileNavItem to="/budgets" icon={<Wallet size={24} />} />
        <MobileNavItem to="/settings" icon={<Settings size={24} />} />
      </div>

      {/* Expense Form Modal */}
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
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-[inset_2px_0_0_rgba(16,185,129,1)]' : 'text-text-muted hover:bg-glass hover:text-text-main hover:translate-x-1'}`}
    >
      {icon}
      <span className="font-medium tracking-wide">{label}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, icon }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-main'}`}
    >
      {icon}
    </NavLink>
  );
}

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budgets, setBudgets] = useState(initialBudgets);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const editExpense = (updatedExpense) => {
    setExpenses(expenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const updateBudget = (category, newLimit) => {
    setBudgets(budgets.map(b => b.category === category ? { ...b, limit: newLimit } : b));
  };

  return (
    <Routes>
      <Route path="/" element={<Layout expenses={expenses} onAddExpense={addExpense} onEditExpense={editExpense} onDeleteExpense={deleteExpense} budgets={budgets} onUpdateBudget={updateBudget} theme={theme} toggleTheme={toggleTheme} />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
}

export default App;