import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExpenseForm = ({ onClose, onSave, initialData }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTimeout(() => {
        setAmount(initialData.amount ? initialData.amount.toString() : '');
        setDescription(initialData.title || '');
        setCategory(initialData.category || 'Food');
        
        let dateVal = '';
        if (initialData.date) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(initialData.date)) {
            dateVal = initialData.date;
          } else {
            const d = new Date(initialData.date);
            if (!isNaN(d)) {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              dateVal = `${year}-${month}-${day}`;
            }
          }
        }
        setDate(dateVal || new Date().toISOString().split('T')[0]);
      }, 0);
    } else {
      setTimeout(() => {
        setAmount('');
        setDescription('');
        setCategory('Food');
        setDate(new Date().toISOString().split('T')[0]);
      }, 0);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !description || !date) {
      setError('All fields are required.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a positive number greater than zero.');
      return;
    }

    const updatedExpense = {
      id: initialData ? initialData.id : Date.now(),
      title: description,
      date: date,
      amount: parseFloat(amount),
      category: category === 'Income' ? 'Income' : category,
      type: category === 'Income' ? 'income' : 'expense'
    };

    onSave(updatedExpense);
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
              placeholder="What did you pay for?"
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
                <option value="Food" className="bg-surface-bright text-text-main">Food & Dining</option>
                <option value="Transport" className="bg-surface-bright text-text-main">Transportation</option>
                <option value="Housing" className="bg-surface-bright text-text-main">Housing</option>
                <option value="Income" className="bg-surface-bright text-text-main">Income</option>
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

        <div className="pt-4 flex gap-3">
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
