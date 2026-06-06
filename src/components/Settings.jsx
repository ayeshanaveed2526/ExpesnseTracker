import { useRef } from 'react';
import { X, Download, Upload, Trash2 } from 'lucide-react';

const Settings = ({ 
  theme, 
  toggleTheme, 
  currency, 
  setCurrency, 
  userName,
  setUserName,
  expenses, 
  setExpenses, 
  budgets, 
  setBudgets, 
  savingsGoal,
  setSavingsGoal,
  onClose 
}) => {
  const fileInputRef = useRef(null);
  const isLight = theme === 'light';

  const CURRENCY_SYMBOLS = {
    'PKR': 'Rs.',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
  };
  const currencySymbol = CURRENCY_SYMBOLS[currency] || 'Rs.';

  const handleExport = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ expenses, budgets }));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `finpulse_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Failed to export data: " + e.message);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === 'object') {
          if (parsed.expenses && Array.isArray(parsed.expenses)) {
            setExpenses(parsed.expenses);
          }
          if (parsed.budgets && Array.isArray(parsed.budgets)) {
            setBudgets(parsed.budgets);
          }
          alert("Backup restored successfully!");
          onClose();
        } else {
          throw new Error("Invalid file content format.");
        }
      } catch {
        alert("Restoration failed: Please upload a valid FinPulse backup JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "CAUTION: Are you sure you want to permanently delete all transactions, custom budget limits, and history? This cannot be undone."
    );
    if (confirmed) {
      localStorage.removeItem('finpulse_expenses_v2');
      localStorage.removeItem('finpulse_budgets_v2');
      localStorage.removeItem('finpulse_user_name');
      // Reset back to blank or defaults
      setExpenses([]);
      setBudgets([]);
      setUserName('');
      alert("App data has been cleared.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-bright rounded-2xl border border-border-main p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors p-1 rounded-lg hover:bg-glass cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-text-main mb-6 tracking-tight">Configuration Hub</h2>
        
        <div className="space-y-6">
          {/* Preferences Section */}
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Preferences</h3>
            <div className="space-y-3">
              
              {/* Profile Name */}
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-main">
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Profile Name</h4>
                  <p className="text-[11px] text-text-muted">Customize your greeting name</p>
                </div>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-surface border border-border-main rounded-lg px-3 py-1.5 text-xs text-text-main font-bold focus:outline-none focus:border-primary w-36 text-right placeholder:text-text-muted/30"
                />
              </div>

              {/* Theme Selector */}
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-main">
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Interface Theme</h4>
                  <p className="text-[11px] text-text-muted">Use light mode or dark mode</p>
                </div>
                <button 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${isLight ? 'bg-primary' : 'bg-surface-bright border border-border-main'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${isLight ? 'right-1 bg-zinc-950' : 'left-1 bg-primary'}`}></div>
                </button>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-main">
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Default Currency</h4>
                  <p className="text-[11px] text-text-muted">Set global symbol format</p>
                </div>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-surface border border-border-main rounded-lg px-3 py-1.5 text-xs text-text-main font-bold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="PKR" className="bg-surface-bright text-text-main">PKR (Rs.)</option>
                  <option value="USD" className="bg-surface-bright text-text-main">USD ($)</option>
                  <option value="EUR" className="bg-surface-bright text-text-main">EUR (€)</option>
                  <option value="GBP" className="bg-surface-bright text-text-main">GBP (£)</option>
                </select>
              </div>

              {/* Savings Target Selector */}
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-main">
                <div>
                  <h4 className="text-sm font-semibold text-text-main">Savings Target</h4>
                  <p className="text-[11px] text-text-muted">Set target amount manually</p>
                </div>
                <div className="flex items-center gap-1.5 bg-surface border border-border-main rounded-lg px-2.5 py-1.5 shadow-inner">
                  <span className="text-xs text-text-muted">{currencySymbol}</span>
                  <input 
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) {
                        setSavingsGoal(val);
                      }
                    }}
                    className="bg-transparent text-xs text-text-main font-bold w-20 focus:outline-none"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Backup & Actions Section */}
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Backup & Security</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-surface/40 hover:bg-glass border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Download size={14} className="text-primary" />
                <span>Export JSON</span>
              </button>

              <button 
                onClick={handleImportClick}
                className="flex items-center justify-center gap-2 bg-surface/40 hover:bg-glass border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Upload size={14} className="text-primary" />
                <span>Import JSON</span>
              </button>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
            </div>

            {/* Danger Zone */}
            <div className="mt-4 pt-4 border-t border-border-main">
              <button 
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-zinc-950 font-bold p-3.5 rounded-xl text-xs hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Trash2 size={14} />
                <span>Delete All App Data</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
