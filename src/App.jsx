import { useState, useEffect, useMemo } from 'react';
import { Settings as SettingsIcon, Plus, Sun, Moon, Sparkles, Calendar, Wand2 } from 'lucide-react';
import Summary from './components/Summary';
import ExpenseChart from './components/ExpenseChart';
import Budgets from './components/Budgets';
import Settings from './components/Settings';
import ExpenseForm from './components/ExpenseForm';
import Transactions from './components/Transactions';
import AiCoach from './components/AiCoach';
import { useToast } from './context/ToastContext';
import { CATEGORY_STORAGE_KEY, healCategories } from './lib/categories';
import { PERIODS, filterByPeriod } from './lib/period';
import { RECURRING_STORAGE_KEY, generateDueRecurring } from './lib/recurring';
import { buildSampleData } from './lib/sampleData';
import { playAddSound } from './lib/sound';

const initialExpenses = [];

const initialBudgets = [];

const CURRENCY_SYMBOLS = {
  'PKR': 'Rs.',
  'USD': '$',
  'EUR': '€',
  'GBP': '£'
};

const todayISO = () => new Date().toISOString().split('T')[0];

function App() {
  const { notify } = useToast();

  // Boot: load stored data and run the recurring catch-up so the very first
  // render already includes any due recurring transactions. Each lazy
  // initializer runs exactly once.
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('finpulse_expenses_v2');
    const base = saved ? JSON.parse(saved) : initialExpenses;
    const savedRec = localStorage.getItem(RECURRING_STORAGE_KEY);
    const { newExpenses, changed } = generateDueRecurring(savedRec ? JSON.parse(savedRec) : []);
    return changed && newExpenses.length ? [...newExpenses, ...base] : base;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finpulse_budgets_v2');
    return saved ? JSON.parse(saved) : initialBudgets;
  });

  const [categories, setCategories] = useState(() => {
    const savedCats = localStorage.getItem(CATEGORY_STORAGE_KEY);
    const savedExp = localStorage.getItem('finpulse_expenses_v2');
    const savedBud = localStorage.getItem('finpulse_budgets_v2');
    return healCategories(
      savedCats ? JSON.parse(savedCats) : null,
      savedExp ? JSON.parse(savedExp) : [],
      savedBud ? JSON.parse(savedBud) : []
    );
  });

  const [recurring, setRecurring] = useState(() => {
    const saved = localStorage.getItem(RECURRING_STORAGE_KEY);
    const base = saved ? JSON.parse(saved) : [];
    const { updatedRules, changed } = generateDueRecurring(base);
    return changed ? updatedRules : base;
  });

  // How many recurring transactions the boot catch-up generated (for the toast).
  const [bootRecurringCount] = useState(() => {
    const saved = localStorage.getItem(RECURRING_STORAGE_KEY);
    const { newExpenses, changed } = generateDueRecurring(saved ? JSON.parse(saved) : []);
    return changed ? newExpenses.length : 0;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('finpulse_theme') || 'dark';
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('finpulse_currency') || 'PKR';
  });

  const [savingsGoal, setSavingsGoal] = useState(() => {
    const saved = localStorage.getItem('finpulse_savings_goal');
    return saved ? parseFloat(saved) : 0;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('finpulse_sound') !== 'false';
  });

  const [period, setPeriod] = useState(() => {
    return localStorage.getItem('finpulse_period') || 'thisMonth';
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recordPulse, setRecordPulse] = useState(false);

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('finpulse_user_name') || '';
  });

  // Onboarding is shown purely based on whether a name is set — no separate state.
  const showOnboarding = !userName;

  const openAddForm = () => {
    setExpenseToEdit(null);
    setIsFormOpen(true);
  };

  const openEditForm = (exp) => {
    setExpenseToEdit(exp);
    setIsFormOpen(true);
  };

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
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(RECURRING_STORAGE_KEY, JSON.stringify(recurring));
  }, [recurring]);

  useEffect(() => {
    localStorage.setItem('finpulse_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('finpulse_savings_goal', savingsGoal.toString());
  }, [savingsGoal]);

  useEffect(() => {
    localStorage.setItem('finpulse_sound', soundEnabled ? 'true' : 'false');
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('finpulse_period', period);
  }, [period]);

  useEffect(() => {
    localStorage.setItem('finpulse_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Surface the recurring catch-up (computed during boot) as a toast on mount.
  useEffect(() => {
    if (bootRecurringCount > 0) {
      notify({
        message: `${bootRecurringCount} recurring transaction${bootRecurringCount > 1 ? 's' : ''} added`,
        type: 'success',
      });
    }
  }, [notify, bootRecurringCount]);

  // Global keyboard shortcuts: N = new, / = focus search, Esc = close modals.
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target;
      const typing =
        el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);

      if (e.key === 'Escape') {
        if (isFormOpen) { setIsFormOpen(false); setExpenseToEdit(null); }
        if (isSettingsOpen) setIsSettingsOpen(false);
        return;
      }
      if (typing) return;

      const anyModal = isFormOpen || isSettingsOpen || showOnboarding;
      if ((e.key === 'n' || e.key === 'N') && !anyModal) {
        e.preventDefault();
        openAddForm();
      } else if (e.key === '/' && !anyModal) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('finpulse:focus-search'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFormOpen, isSettingsOpen, showOnboarding]);

  const scopedExpenses = useMemo(
    () => filterByPeriod(expenses, period),
    [expenses, period]
  );

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const triggerAddFeedback = () => {
    if (soundEnabled) playAddSound();
    setRecordPulse(true);
    window.setTimeout(() => setRecordPulse(false), 700);
  };

  const handleAddOrEdit = (exp) => {
    const isNew = !expenseToEdit;
    if (expenseToEdit) {
      setExpenses(expenses.map(e => e.id === exp.id ? exp : e));
    } else {
      setExpenses([exp, ...expenses]);
    }
    setIsFormOpen(false);
    setExpenseToEdit(null);
    if (isNew) triggerAddFeedback();
  };

  const deleteExpense = (id) => {
    const idx = expenses.findIndex(e => e.id === id);
    if (idx === -1) return;
    const removed = expenses[idx];
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    notify({
      message: 'Transaction deleted',
      actionLabel: 'Undo',
      type: 'danger',
      onAction: () => setExpenses(prev => {
        const copy = [...prev];
        copy.splice(Math.min(idx, copy.length), 0, removed);
        return copy;
      }),
    });
  };

  const duplicateExpense = (exp) => {
    const copy = { ...exp, id: Date.now(), date: todayISO() };
    setExpenses(prev => [copy, ...prev]);
    triggerAddFeedback();
    notify({ message: 'Transaction duplicated', type: 'success' });
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

  // --- Category management ---
  const addCategory = (cat) => {
    const name = cat.name.trim();
    if (!name) {
      notify({ message: 'Category name is required', type: 'danger' });
      return false;
    }
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      notify({ message: `"${name}" already exists`, type: 'danger' });
      return false;
    }
    setCategories(prev => [...prev, { ...cat, name }]);
    notify({ message: `Category "${name}" added`, type: 'success' });
    return true;
  };

  const updateCategory = (name, patch) => {
    setCategories(prev => prev.map(c => c.name === name ? { ...c, ...patch } : c));
  };

  const deleteCategory = (name) => {
    if (expenses.some(e => e.category === name)) {
      notify({ message: `Can't delete "${name}" — it's used by transactions`, type: 'danger' });
      return;
    }
    setCategories(prev => prev.filter(c => c.name !== name));
    setBudgets(prev => prev.filter(b => b.category !== name));
    notify({ message: `Category "${name}" deleted`, type: 'success' });
  };

  // --- Recurring management ---
  const addRecurring = (rule) => {
    const newRule = { ...rule, id: Date.now(), lastRun: null };
    // Materialise this month's entry immediately and advance lastRun in one pass.
    const { newExpenses, updatedRules, changed } = generateDueRecurring([newRule]);
    if (changed && newExpenses.length) {
      setExpenses(prev => [...newExpenses, ...prev]);
    }
    setRecurring(prev => [...prev, updatedRules[0]]);
    notify({ message: 'Recurring transaction created', type: 'success' });
  };

  const deleteRecurring = (id) => {
    setRecurring(prev => prev.filter(r => r.id !== id));
  };

  // Merge imported data and heal categories so new labels get proper emoji/color.
  const applyImportedData = (impExpenses, impBudgets, mode) => {
    const merged = mode === 'replace' ? impExpenses : [...impExpenses, ...expenses];
    const nextBudgets = impBudgets != null ? impBudgets : budgets;
    setExpenses(merged);
    if (impBudgets != null) setBudgets(impBudgets);
    setCategories(prev => healCategories(prev, merged, nextBudgets));
  };

  const importTransactionsCSV = (parsedExpenses) => {
    applyImportedData(parsedExpenses, null, 'append');
    notify({ message: `${parsedExpenses.length} transaction${parsedExpenses.length > 1 ? 's' : ''} imported`, type: 'success' });
  };

  const restoreBackup = (impExpenses, impBudgets) => {
    applyImportedData(impExpenses || [], impBudgets || [], 'replace');
    notify({ message: 'Backup restored', type: 'success' });
  };

  const loadSampleData = (name) => {
    const { expenses: se, budgets: sb } = buildSampleData();
    setExpenses(se);
    setBudgets(sb);
    setUserName(name && name.trim() ? name.trim() : 'Explorer');
  };

  const currencySymbol = CURRENCY_SYMBOLS[currency] || 'Rs.';
  const periodLabel = (PERIODS.find(p => p.key === period) || PERIODS[0]).label;

  // Theme + Settings icons — reused in the mobile (top-right) and desktop (inline) header slots.
  const iconButtons = (
    <>
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
    </>
  );

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
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10 bg-surface-bright/30 backdrop-blur-xl border border-border-main p-4 rounded-2xl shadow-xl transition-all duration-300">
          {/* Brand row (with theme/settings pinned right on mobile) */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)] flex-shrink-0 bg-primary/10 flex items-center justify-center border border-primary/20">
                <Sparkles size={22} className="text-primary animate-pulse" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-main/70 bg-clip-text text-transparent">
                  FinPulse
                </h1>
                <p className="text-[10px] text-text-muted font-medium tracking-widest uppercase truncate">
                  {userName ? `Hi, ${userName} 👋` : 'Smart Finance Hub'}
                </p>
              </div>
            </div>

            {/* Icons here on mobile only */}
            <div className="flex items-center gap-2 flex-shrink-0 sm:hidden">
              {iconButtons}
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Period Selector */}
            <div className="flex items-center gap-1.5 bg-surface-bright/50 rounded-xl px-3 py-2.5 border border-border-main shadow-sm flex-1 sm:flex-none">
              <Calendar size={15} className="text-primary flex-shrink-0" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-transparent text-xs font-bold text-text-main focus:outline-none cursor-pointer appearance-none w-full sm:w-auto pr-1"
                aria-label="Time period"
              >
                {PERIODS.map(p => (
                  <option key={p.key} value={p.key} className="bg-surface-bright text-text-main">{p.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={openAddForm}
              className={`flex-1 sm:flex-none bg-primary text-zinc-950 font-bold py-2.5 px-4 sm:px-5 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/15 cursor-pointer ${recordPulse ? 'animate-add-pulse' : ''}`}
            >
              <Plus size={18} className="flex-shrink-0" />
              <span className="sm:hidden">Record</span>
              <span className="hidden sm:inline">Record Transaction</span>
            </button>

            {/* Icons here on desktop only */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              {iconButtons}
            </div>
          </div>
        </header>

        {/* Top Summary Row */}
        <div className="mb-8">
          <Summary
            expenses={scopedExpenses}
            allExpenses={expenses}
            periodLabel={periodLabel}
            currencySymbol={currencySymbol}
            savingsGoal={savingsGoal}
            onUpdateSavingsGoal={setSavingsGoal}
            categories={categories}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (Charts & Budgets) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <ExpenseChart expenses={scopedExpenses} theme={theme} currencySymbol={currencySymbol} categories={categories} />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Budgets expenses={scopedExpenses} budgets={budgets} categories={categories} onUpdateBudget={updateBudget} onDeleteBudget={deleteBudget} currencySymbol={currencySymbol} periodLabel={periodLabel} />
            </div>
          </div>

          {/* Right Column (Transactions) */}
          <div className="lg:col-span-5 h-[760px] overflow-hidden flex flex-col animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Transactions expenses={scopedExpenses} categories={categories} onEdit={openEditForm} onDelete={deleteExpense} onDuplicate={duplicateExpense} currencySymbol={currencySymbol} />
          </div>

        </div>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-300">
            <ExpenseForm
              key={expenseToEdit ? expenseToEdit.id : 'new'}
              onClose={() => { setIsFormOpen(false); setExpenseToEdit(null); }}
              onSave={handleAddOrEdit}
              initialData={expenseToEdit}
              categories={categories}
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
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
          recurring={recurring}
          onAddRecurring={addRecurring}
          onDeleteRecurring={deleteRecurring}
          onImportCSV={importTransactionsCSV}
          onRestoreBackup={restoreBackup}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          savingsGoal={savingsGoal}
          setSavingsGoal={setSavingsGoal}
          currencySymbol={currencySymbol}
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

              <div className="flex items-center gap-3 w-full my-1">
                <div className="h-px bg-border-main flex-1" />
                <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">or</span>
                <div className="h-px bg-border-main flex-1" />
              </div>

              <button
                onClick={() => loadSampleData('')}
                className="w-full flex items-center justify-center gap-2 bg-surface border border-border-main hover:border-primary/40 text-text-main font-bold p-3 rounded-xl text-xs hover:scale-[0.98] active:scale-95 transition-all cursor-pointer"
              >
                <Wand2 size={14} className="text-primary" />
                Explore with sample data
              </button>
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
