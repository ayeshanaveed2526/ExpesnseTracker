import React, { useState } from 'react';
import { X } from 'lucide-react';

const ExpenseForm = ({ onClose, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !date) return;

    const newExpense = {
      id: Date.now(),
      title: description,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: parseFloat(amount),
      category: category === 'Income' ? 'Income' : category,
      type: category === 'Income' ? 'income' : 'expense'
    };

    onAddExpense(newExpense);
  };

  return (
    <div className="bg-surface-bright rounded-2xl p-6 shadow-2xl border border-white/10 relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-bold mb-6 text-white">Record Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Amount (Rs.)</label>
          <input 
            type="number" 
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
          <input 
            type="text" 
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary appearance-none"
            >
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transportation</option>
              <option value="Housing">Housing</option>
              <option value="Income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-primary text-secondary font-bold text-lg py-3 rounded-xl hover:bg-primary/90 hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
