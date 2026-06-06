import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Sun, Moon, Sparkles } from 'lucide-react';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import Budgets from './components/Budgets';
import Settings from './components/Settings';
import ExpenseForm from './components/ExpenseForm';
import Transactions from './components/Transactions';
import AiCoach from './components/AiCoach';

const initialExpenses = [];

const initialBudgets = [];

const CURRENCY_SYMBOLS = {
  'PKR': 'Rs.',
  'USD': '$',
  'EUR': '€',
  'GBP': '£'
};

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finpulse_expenses_v2');
    return saved ? JSON.parse(saved) : initialExpenses;
  });
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finpulse_budgets_v2');
    return saved ? JSON.parse(saved) : initialBudgets;
  });
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finpulse_theme') || 'dark';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('finpulse_currency') || 'PKR';
  });

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('finpulse_savings_goal');
    return saved ? parseFloat(saved) : 100000;
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('finpulse_user_name') || '';
  });
  
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!userName) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('finpulse_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('finpulse_expenses_v2', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('finpulse_budgets_v2', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('finpulse_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finpulse_savings_goal', savingsGoal.toString());
  }, [savingsGoal]);

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
    const exists = budgets.some(b => b.category === category);
    if (exists) {
      setBudgets(budgets.map(b => b.category === category ? { ...b, limit: newLimit } : b));
    } else {
      setBudgets([...budgets, { category, limit: newLimit }]);
    }
  };

  const deleteBudget = (category) => {
    setBudgets(budgets.filter(b => b.category !== category));
  };

  const openAddForm = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (exp) => {
    setExpenseToEdit(exp);
    setIsFormOpen(true);
  };

  const currencySymbol = CURRENCY_SYMBOLS[currency] || 'Rs.';

  return (
    <div className={`min-h-screen bg-surface text-text-main relative overflow-x-hidden transition-colors duration-300 ${theme === 'dark' ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950 to-zinc-950' : 'bg-slate-50'}`}>
      
      {/* Animated Glowing Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-primary rounded-full filter blur-[120px] opacity-10 animate-blob"></div>
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500 rounded-full filter blur-[120px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-[600px] h-[600px] bg-teal-800 rounded-full filter blur-[120px] opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grain opacity-[0.02]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 bg-surface-bright/30 backdrop-blur-xl border border-border-main p-4 rounded-2xl shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-shrink-0 bg-primary/10 flex items-center justify-center border border-primary/20">
              <Sparkles size={22} className="text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-main/70 bg-clip-text text-transparent flex items-center gap-2">
                FinPulse
              </h1>
              <p className="text-[10px] text-text-muted font-medium tracking-widest uppercase">
                {userName ? `Hi, ${userName} 👋` : 'Smart Finance Hub'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={openAddForm}
              className="flex-1 sm:flex-none bg-primary text-zinc-950 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/15 cursor-pointer"
            >
              <Plus size={18} />
              <span>Record Transaction</span>
            </button>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-surface-bright/50 rounded-xl border border-border-main text-text-muted hover:text-text-main transition-all hover:scale-95 cursor-pointer shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 bg-surface-bright/50 rounded-xl border border-border-main text-text-muted hover:text-text-main transition-all hover:scale-95 cursor-pointer shadow-sm"
              aria-label="Settings"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        {/* Top Summary Row */}
        <div className="mb-8">
          <Summary 
            expenses={expenses} 
            currencySymbol={currencySymbol} 
            savingsGoal={savingsGoal}
            onUpdateSavingsGoal={setSavingsGoal}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Charts & Budgets) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <ExpenseChart expenses={expenses} theme={theme} currencySymbol={currencySymbol} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Budgets expenses={expenses} budgets={budgets} onUpdateBudget={updateBudget} onDeleteBudget={deleteBudget} currencySymbol={currencySymbol} />
            </div>
          </div>

          {/* Right Column (Transactions) */}
          <div className="lg:col-span-5 h-[760px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Transactions expenses={expenses} onEdit={openEditForm} onDelete={deleteExpense} currencySymbol={currencySymbol} />
          </div>

        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
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
          currency={currency}
          setCurrency={setCurrency}
          userName={userName}
          setUserName={setUserName}
          expenses={expenses}
          setExpenses={setExpenses}
          budgets={budgets}
          setBudgets={setBudgets}
          savingsGoal={savingsGoal}
          setSavingsGoal={setSavingsGoal}
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-surface-bright border border-border-main p-8 rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <Sparkles size={26} className="text-primary animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-text-main tracking-tight mt-2">Welcome to FinPulse</h2>
              <p className="text-xs text-text-muted max-w-xs font-medium">
                Your smart personal finance companion. To customize your experience, what should we call you?
              </p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const nameVal = e.target.nameInput.value;
                  if (nameVal.trim()) {
                    setUserName(nameVal.trim());
                    setShowOnboarding(false);
                  }
                }}
                className="w-full mt-4 space-y-4"
              >
                <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
                  <input 
                    name="nameInput"
                    type="text" 
                    placeholder="Enter your name..."
                    className="w-full bg-transparent text-text-main focus:outline-none text-sm font-bold px-4 py-3.5 placeholder:text-text-muted/30 text-center"
                    required
                    autoFocus
                  />
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-primary text-zinc-950 font-bold p-3.5 rounded-xl text-xs hover:scale-[0.98] active:scale-95 transition-all cursor-pointer shadow-lg shadow-primary/15"
                >
                  Get Started
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <AiCoach 
        expenses={expenses} 
        budgets={budgets} 
        userName={userName} 
        currencySymbol={currencySymbol} 
        savingsGoal={savingsGoal} 
      />
    </div>
  );
}

export default App;