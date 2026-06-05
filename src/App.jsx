import React, { useState } from 'react';
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

function Layout({ expenses, onAddExpense }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();

  const handleAdd = (exp) => {
    onAddExpense(exp);
    setIsFormOpen(false);
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
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-surface-bright/50 backdrop-blur-xl border-r border-white/5 p-6 h-screen sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-surface font-bold text-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Expense Tracker</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/transactions" icon={<ArrowRightLeft size={20} />} label="Transactions" />
          <NavItem to="/budgets" icon={<Wallet size={20} />} label="Budgets" />
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button 
          onClick={() => setIsFormOpen(true)}
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
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-surface font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]">F</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{getPageTitle()}</h1>
          </div>
        </header>

        <Outlet context={{ expenses, onAddExpense: handleAdd }} />
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-bright border-t border-white/5 px-6 py-4 flex justify-between items-center z-40">
        <MobileNavItem to="/" icon={<LayoutDashboard size={24} />} />
        <MobileNavItem to="/transactions" icon={<ArrowRightLeft size={24} />} />
        <div className="relative -top-6">
          <button 
            onClick={() => setIsFormOpen(true)}
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
            <ExpenseForm onClose={() => setIsFormOpen(false)} onAddExpense={handleAdd} />
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
      className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary shadow-[inset_2px_0_0_rgba(16,185,129,1)]' : 'text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-1'}`}
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
      className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-white/50 hover:text-white'}`}
    >
      {icon}
    </NavLink>
  );
}

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const addExpense = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout expenses={expenses} onAddExpense={addExpense} />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
}

export default App;