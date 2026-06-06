import { useState } from 'react';
import { X, TrendingDown, TrendingUp } from 'lucide-react';

const toISODate = (value) => {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value) {
    const d = new Date(value);
    if (!isNaN(d)) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
  return new Date().toISOString().split('T')[0];
};

// App passes a `key` tied to the edit target, so this component remounts when
// switching between add/edit — state can be initialised directly, no effects.
const ExpenseForm = ({ onClose, onSave, initialData, categories = [] }) => {
  const initType = initialData?.type === 'income' ? 'income' : 'expense';
  const firstOfType = (t) => {
    const match = categories.find(c => c.type === t);
    return match ? match.name : '';
  };

  const [type, setType] = useState(initType);
  const [amount, setAmount] = useState(initialData?.amount ? initialData.amount.toString() : '');
  const [description, setDescription] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || firstOfType(initType));
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [date, setDate] = useState(toISODate(initialData?.date));
  const [error, setError] = useState('');

  const categoriesForType = categories.filter(c => c.type === type);

  // Switching type resets the category to the first valid one for that type.
  const handleTypeChange = (nextType) => {
    setType(nextType);
    setCategory(firstOfType(nextType));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !description || !date) {
      setError('Amount, description and date are required.');
      return;
    }
    if (!category) {
      setError(`Add a ${type} category first (in Settings).`);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number greater than zero.');
      return;
    }

    onSave({
      id: initialData ? initialData.id : Date.now(),
      title: description,
      date,
      amount: numAmount,
      category,
      type,
      notes: notes.trim(),
    });
  };

  return (
    <div className="bg-surface-bright border border-border-main p-6 rounded-2xl shadow-2xl relative max-w-md w-full">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-all p-1.5 rounded-lg hover:bg-glass cursor-pointer"
        aria-label="Close form"
      >
        <X size={18} />
      </button>

      <h2 className="text-lg font-bold text-text-main mb-6 tracking-tight">
        {initialData ? 'Update Transaction' : 'New Transaction'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide">
            {error}
          </div>
        )}

        {/* Type Toggle */}
        <div className="flex bg-surface border border-border-main p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${type === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            <TrendingDown size={14} />
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${type === 'income' ? 'bg-emerald-500 text-zinc-950 shadow-sm' : 'text-text-muted hover:text-text-main'}`}
          >
            <TrendingUp size={14} />
            Income
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Amount</label>
          <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent text-text-main focus:outline-none text-xl font-bold px-4 py-3.5 placeholder:text-text-muted/30"
              min="0"
              step="any"
              autoFocus
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Description</label>
          <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
            <input
              type="text"
              placeholder="What was it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent text-xs text-text-main focus:outline-none px-4 py-3.5 placeholder:text-text-muted/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Category</label>
            <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-xs text-text-main focus:outline-none px-4 py-3.5 cursor-pointer appearance-none font-bold"
              >
                {categoriesForType.length === 0 && (
                  <option value="" className="bg-surface-bright text-text-main">No categories</option>
                )}
                {categoriesForType.map(cat => (
                  <option key={cat.name} value={cat.name} className="bg-surface-bright text-text-main">
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Date</label>
            <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-xs text-text-main focus:outline-none px-4 py-3.5 dark:[color-scheme:dark] cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Notes <span className="text-text-muted/50 normal-case">(optional)</span></label>
          <div className="relative flex items-center bg-surface rounded-xl border border-border-main focus-within:border-primary/50 transition-all shadow-inner">
            <textarea
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-transparent text-xs text-text-main focus:outline-none px-4 py-3 placeholder:text-text-muted/30 resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-surface-bright/50 border border-border-main hover:border-text-muted/20 text-xs font-bold p-3.5 rounded-xl text-text-main hover:scale-95 transition-all cursor-pointer shadow-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 bg-primary text-zinc-950 font-bold p-3.5 rounded-xl text-xs hover:scale-95 transition-all cursor-pointer shadow-md shadow-primary/10"
          >
            {initialData ? 'Save Changes' : 'Confirm Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
