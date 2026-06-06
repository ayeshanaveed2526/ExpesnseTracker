import { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, Volume2, VolumeX, Plus, Repeat, FileText, Check, Pencil } from 'lucide-react';
import { CATEGORY_COLORS, EMOJI_CHOICES, getCategory, hexToRgba } from '../lib/categories';
import { parseTransactionsCSV } from '../lib/csv';

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
  categories = [],
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  recurring = [],
  onAddRecurring,
  onDeleteRecurring,
  onImportCSV,
  onRestoreBackup,
  soundEnabled,
  setSoundEnabled,
  savingsGoal,
  setSavingsGoal,
  onClose,
}) => {
  const jsonInputRef = useRef(null);
  const csvInputRef = useRef(null);
  const isLight = theme === 'light';

  const CURRENCY_SYMBOLS = { PKR: 'Rs.', USD: '$', EUR: '€', GBP: '£' };
  const symbol = CURRENCY_SYMBOLS[currency] || 'Rs.';

  // --- Category manager state ---
  const [showCatForm, setShowCatForm] = useState(false);
  const [catName, setCatName] = useState('');
  const [catEmoji, setCatEmoji] = useState(EMOJI_CHOICES[0]);
  const [catColor, setCatColor] = useState(CATEGORY_COLORS[0]);
  const [catType, setCatType] = useState('expense');
  const [editingCat, setEditingCat] = useState(null);
  const [editEmoji, setEditEmoji] = useState(EMOJI_CHOICES[0]);
  const [editColor, setEditColor] = useState(CATEGORY_COLORS[0]);

  // --- Recurring manager state ---
  const [showRecForm, setShowRecForm] = useState(false);
  const [recTitle, setRecTitle] = useState('');
  const [recAmount, setRecAmount] = useState('');
  const [recType, setRecType] = useState('expense');
  const [recCategory, setRecCategory] = useState('');
  const [recDay, setRecDay] = useState('1');

  const handleExport = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ expenses, budgets }));
      const a = document.createElement('a');
      a.setAttribute('href', dataStr);
      a.setAttribute('download', `finpulse_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      alert('Failed to export data: ' + e.message);
    }
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && Array.isArray(parsed.expenses)) {
          onRestoreBackup(parsed.expenses, Array.isArray(parsed.budgets) ? parsed.budgets : []);
          onClose();
        } else {
          throw new Error('Invalid file content format.');
        }
      } catch {
        alert('Restoration failed: Please upload a valid FinPulse backup JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportCSV = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseTransactionsCSV(event.target.result);
        onImportCSV(parsed);
        onClose();
      } catch (err) {
        alert('CSV import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'CAUTION: Are you sure you want to permanently delete all transactions, custom budget limits, and history? This cannot be undone.'
    );
    if (confirmed) {
      localStorage.removeItem('finpulse_expenses_v2');
      localStorage.removeItem('finpulse_budgets_v2');
      localStorage.removeItem('finpulse_user_name');
      setExpenses([]);
      setBudgets([]);
      setUserName('');
      alert('App data has been cleared.');
      onClose();
    }
  };

  const submitCategory = () => {
    const ok = onAddCategory({ name: catName, emoji: catEmoji, color: catColor, type: catType });
    if (ok) {
      setCatName('');
      setCatEmoji(EMOJI_CHOICES[0]);
      setCatColor(CATEGORY_COLORS[0]);
      setCatType('expense');
      setShowCatForm(false);
    }
  };

  const startEditCat = (cat) => {
    setEditingCat(cat.name);
    setEditEmoji(cat.emoji);
    setEditColor(cat.color);
  };

  const saveEditCat = () => {
    onUpdateCategory(editingCat, { emoji: editEmoji, color: editColor });
    setEditingCat(null);
  };

  const submitRecurring = (e) => {
    e.preventDefault();
    const amt = parseFloat(recAmount);
    if (!recTitle.trim() || isNaN(amt) || amt <= 0 || !recCategory) {
      alert('Please fill in a title, a positive amount and a category.');
      return;
    }
    const day = Math.min(Math.max(1, parseInt(recDay, 10) || 1), 31);
    onAddRecurring({ title: recTitle.trim(), amount: amt, type: recType, category: recCategory, dayOfMonth: day });
    setRecTitle('');
    setRecAmount('');
    setRecDay('1');
    setShowRecForm(false);
  };

  const recCategoryOptions = categories.filter(c => c.type === recType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-bright rounded-2xl border border-border-main p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300 max-h-[88vh] overflow-y-auto custom-scrollbar">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors p-1 rounded-lg hover:bg-glass cursor-pointer z-10"
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

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-border-main">
                <div className="flex items-center gap-2">
                  {soundEnabled ? <Volume2 size={16} className="text-primary" /> : <VolumeX size={16} className="text-text-muted" />}
                  <div>
                    <h4 className="text-sm font-semibold text-text-main">Sound Effects</h4>
                    <p className="text-[11px] text-text-muted">Play a chime when adding</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(v => !v)}
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-all ${soundEnabled ? 'bg-primary' : 'bg-surface-bright border border-border-main'}`}
                  aria-label="Toggle sound"
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${soundEnabled ? 'right-1 bg-zinc-950' : 'left-1 bg-primary'}`}></div>
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
                  <span className="text-xs text-text-muted">{symbol}</span>
                  <input
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val >= 0) setSavingsGoal(val);
                    }}
                    className="bg-transparent text-xs text-text-main font-bold w-20 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Categories</h3>
              <button
                onClick={() => setShowCatForm(v => !v)}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Plus size={13} /> New
              </button>
            </div>

            {showCatForm && (
              <div className="bg-surface/50 border border-primary/30 rounded-xl p-3 mb-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 bg-surface border border-border-main rounded-lg px-3 py-2 text-xs text-text-main font-bold focus:outline-none focus:border-primary placeholder:text-text-muted/40"
                  />
                  <div className="flex bg-surface border border-border-main rounded-lg p-0.5">
                    {['expense', 'income'].map(t => (
                      <button
                        key={t}
                        onClick={() => setCatType(t)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${catType === t ? 'bg-primary text-zinc-950' : 'text-text-muted'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Icon</p>
                  <div className="flex flex-wrap gap-1">
                    {EMOJI_CHOICES.map(em => (
                      <button
                        key={em}
                        onClick={() => setCatEmoji(em)}
                        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm transition-all cursor-pointer ${catEmoji === em ? 'bg-primary/20 border border-primary' : 'hover:bg-glass border border-transparent'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Color</p>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_COLORS.map(col => (
                      <button
                        key={col}
                        onClick={() => setCatColor(col)}
                        className={`w-6 h-6 rounded-full transition-all cursor-pointer ${catColor === col ? 'ring-2 ring-offset-2 ring-offset-surface-bright ring-text-main scale-110' : ''}`}
                        style={{ backgroundColor: col }}
                        aria-label={`Color ${col}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setShowCatForm(false)} className="flex-1 bg-surface border border-border-main text-[11px] font-bold py-2 rounded-lg text-text-main hover:scale-95 transition-all cursor-pointer">Cancel</button>
                  <button onClick={submitCategory} className="flex-1 bg-primary text-zinc-950 text-[11px] font-bold py-2 rounded-lg hover:scale-95 transition-all cursor-pointer">Add Category</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat.name} className="bg-surface/50 border border-border-main rounded-xl p-2.5">
                  {editingCat === cat.name ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {EMOJI_CHOICES.map(em => (
                          <button key={em} onClick={() => setEditEmoji(em)} className={`w-7 h-7 rounded-md flex items-center justify-center text-sm cursor-pointer ${editEmoji === em ? 'bg-primary/20 border border-primary' : 'hover:bg-glass border border-transparent'}`}>{em}</button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_COLORS.map(col => (
                          <button key={col} onClick={() => setEditColor(col)} className={`w-5 h-5 rounded-full cursor-pointer ${editColor === col ? 'ring-2 ring-offset-2 ring-offset-surface-bright ring-text-main' : ''}`} style={{ backgroundColor: col }} aria-label={`Color ${col}`} />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingCat(null)} className="flex-1 bg-surface border border-border-main text-[11px] font-bold py-1.5 rounded-lg text-text-main cursor-pointer">Cancel</button>
                        <button onClick={saveEditCat} className="flex-1 bg-primary text-zinc-950 text-[11px] font-bold py-1.5 rounded-lg cursor-pointer flex items-center justify-center gap-1"><Check size={12} /> Save</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border" style={{ backgroundColor: hexToRgba(cat.color, 0.15), borderColor: hexToRgba(cat.color, 0.25) }}>
                          {cat.emoji}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-main">{cat.name}</p>
                          <p className="text-[10px] text-text-muted capitalize">{cat.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditCat(cat)} className="p-1.5 text-text-muted hover:text-primary rounded-lg hover:bg-surface border border-transparent hover:border-border-main cursor-pointer" title="Edit"><Pencil size={12} /></button>
                        <button onClick={() => onDeleteCategory(cat.name)} className="p-1.5 text-text-muted hover:text-rose-500 rounded-lg hover:bg-surface border border-transparent hover:border-border-main cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recurring Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5"><Repeat size={11} /> Recurring</h3>
              <button
                onClick={() => {
                  setShowRecForm(v => !v);
                  if (recCategoryOptions[0]) setRecCategory(recCategoryOptions[0].name);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Plus size={13} /> New
              </button>
            </div>

            {showRecForm && (
              <form onSubmit={submitRecurring} className="bg-surface/50 border border-primary/30 rounded-xl p-3 mb-3 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex bg-surface border border-border-main rounded-lg p-0.5">
                  {['expense', 'income'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setRecType(t);
                        const opts = categories.filter(c => c.type === t);
                        setRecCategory(opts[0] ? opts[0].name : '');
                      }}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${recType === t ? 'bg-primary text-zinc-950' : 'text-text-muted'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input type="text" value={recTitle} onChange={(e) => setRecTitle(e.target.value)} placeholder="e.g. Rent, Salary" className="w-full bg-surface border border-border-main rounded-lg px-3 py-2 text-xs text-text-main font-bold focus:outline-none focus:border-primary placeholder:text-text-muted/40" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1 bg-surface border border-border-main rounded-lg px-2.5 py-2">
                    <span className="text-[11px] text-text-muted">{symbol}</span>
                    <input type="number" value={recAmount} onChange={(e) => setRecAmount(e.target.value)} placeholder="0.00" min="1" className="bg-transparent text-xs text-text-main font-bold w-full focus:outline-none" />
                  </div>
                  <select value={recCategory} onChange={(e) => setRecCategory(e.target.value)} className="bg-surface border border-border-main rounded-lg px-2.5 py-2 text-xs text-text-main font-bold focus:outline-none cursor-pointer">
                    {recCategoryOptions.length === 0 && <option value="">No categories</option>}
                    {recCategoryOptions.map(c => <option key={c.name} value={c.name} className="bg-surface-bright">{c.emoji} {c.name}</option>)}
                  </select>
                </div>
                <div className="flex items-center justify-between gap-2 bg-surface border border-border-main rounded-lg px-3 py-2">
                  <label className="text-[11px] font-bold text-text-muted">Day of month</label>
                  <input type="number" value={recDay} onChange={(e) => setRecDay(e.target.value)} min="1" max="31" className="bg-transparent text-xs text-text-main font-bold w-12 text-right focus:outline-none" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowRecForm(false)} className="flex-1 bg-surface border border-border-main text-[11px] font-bold py-2 rounded-lg text-text-main hover:scale-95 transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 bg-primary text-zinc-950 text-[11px] font-bold py-2 rounded-lg hover:scale-95 transition-all cursor-pointer">Save Rule</button>
                </div>
              </form>
            )}

            {recurring.length === 0 && !showRecForm ? (
              <p className="text-[11px] text-text-muted text-center py-3 bg-surface/30 rounded-xl border border-dashed border-border-main">No recurring transactions. Add rent, salary, subscriptions…</p>
            ) : (
              <div className="space-y-2">
                {recurring.map(rule => (
                  <div key={rule.id} className="flex items-center justify-between bg-surface/50 border border-border-main rounded-xl p-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border flex-shrink-0" style={{ backgroundColor: hexToRgba(getCategory(categories, rule.category).color, 0.15), borderColor: hexToRgba(getCategory(categories, rule.category).color, 0.25) }}>
                        {getCategory(categories, rule.category).emoji}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-main truncate">{rule.title}</p>
                        <p className="text-[10px] text-text-muted">
                          {rule.type === 'income' ? '+' : '-'}{symbol} {rule.amount.toLocaleString('en-US')} • Day {rule.dayOfMonth}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteRecurring(rule.id)} className="p-1.5 text-text-muted hover:text-rose-500 rounded-lg hover:bg-surface border border-transparent hover:border-border-main cursor-pointer flex-shrink-0" title="Delete rule">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Backup & Actions Section */}
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Backup & Data</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-surface/40 hover:bg-glass border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Download size={14} className="text-primary" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => jsonInputRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-surface/40 hover:bg-glass border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <Upload size={14} className="text-primary" />
                <span>Import JSON</span>
              </button>

              <button
                onClick={() => csvInputRef.current?.click()}
                className="col-span-2 flex items-center justify-center gap-2 bg-surface/40 hover:bg-glass border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <FileText size={14} className="text-primary" />
                <span>Import Transactions from CSV</span>
              </button>

              <input type="file" ref={jsonInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />
              <input type="file" ref={csvInputRef} onChange={handleImportCSV} accept=".csv,text/csv" className="hidden" />
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
