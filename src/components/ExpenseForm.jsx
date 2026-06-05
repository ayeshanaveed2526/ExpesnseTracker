import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ExpenseForm = ({ onClose, onSave, initialData }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setDescription(initialData.title);
      setCategory(initialData.category);
      // Try to parse the formatted date back into YYYY-MM-DD
      const d = new Date(initialData.date);
      if (!isNaN(d)) {
        setDate(d.toISOString().split('T')[0]);
      }
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

    const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const updatedExpense = {
      id: initialData ? initialData.id : Date.now(),
      title: description,
      date: formattedDate,
      amount: parseFloat(amount),
      category: category === 'Income' ? 'Income' : category,
      type: category === 'Income' ? 'income' : 'expense'
    };

    onSave(updatedExpense);
  };

  return (
    <div className="bg-surface-bright rounded-2xl p-6 shadow-2xl border border-border-main relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold mb-6 text-text-main">{initialData ? 'Edit Transaction' : 'Record Transaction'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Amount (Rs.)</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-lg"
            min="0"
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">Description</label>
          <input 
            type="text" 
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary appearance-none"
            >
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transportation</option>
              <option value="Housing">Housing</option>
              <option value="Income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-primary text-secondary font-bold text-lg py-3 rounded-xl hover:bg-primary/90 hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            {initialData ? 'Save Changes' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
