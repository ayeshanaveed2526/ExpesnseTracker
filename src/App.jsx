import React, { useState } from 'react';
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, Plus } from 'lucide-react';
import Summary from './components/Summary';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] bg-surface-bright border-r border-white/5 p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface font-bold text-xl">
            F
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FinPulse</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<ArrowRightLeft size={20} />} label="Transactions" />
          <NavItem icon={<Wallet size={20} />} label="Budgets" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="mt-auto w-full bg-primary text-secondary font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-95 transition-transform active:scale-90"
        >
          <Plus size={20} />
          <span>Record Expense</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-surface font-bold">F</div>
            <h1 className="text-xl font-bold">FinPulse</h1>
          </div>
        </header>

        <div className="space-y-8">
          <Summary />
          <div className="bg-surface-bright rounded-xl border border-white/5 p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <button className="text-primary text-sm font-medium hover:underline">View All</button>
            </div>
            <ExpenseList />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-bright border-t border-white/5 px-6 py-4 flex justify-between items-center z-40">
        <button className="text-primary flex flex-col items-center gap-1">
          <LayoutDashboard size={24} />
        </button>
        <button className="text-white/50 hover:text-white transition-colors flex flex-col items-center gap-1">
          <ArrowRightLeft size={24} />
        </button>
        <div className="relative -top-6">
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-14 h-14 bg-primary text-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-95 transition-transform active:scale-90 border-4 border-surface"
          >
            <Plus size={28} />
          </button>
        </div>
        <button className="text-white/50 hover:text-white transition-colors flex flex-col items-center gap-1">
          <Wallet size={24} />
        </button>
        <button className="text-white/50 hover:text-white transition-colors flex flex-col items-center gap-1">
          <Settings size={24} />
        </button>
      </div>

      {/* Expense Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <ExpenseForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default App;