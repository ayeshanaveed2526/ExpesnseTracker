import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Summary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-surface-bright rounded-xl border border-white/5 p-6">
        <p className="text-white/60 text-sm font-medium mb-1">Total Balance</p>
        <h3 className="text-3xl font-bold flex items-center">
          <span className="mr-2">Rs.</span>
          1,45,000
        </h3>
        <div className="mt-4 flex items-center text-primary text-sm font-medium">
          <TrendingUp size={16} className="mr-1" />
          <span>+2.4% from last month</span>
        </div>
      </div>
      
      <div className="bg-surface-bright rounded-xl border border-white/5 p-6">
        <p className="text-white/60 text-sm font-medium mb-1">Monthly Spending</p>
        <h3 className="text-3xl font-bold flex items-center">
          <span className="mr-2">Rs.</span>
          32,500
        </h3>
        <div className="mt-4 flex items-center text-danger text-sm font-medium">
          <TrendingDown size={16} className="mr-1" />
          <span>-1.2% from last month</span>
        </div>
      </div>

      <div className="bg-surface-bright rounded-xl border border-white/5 p-6">
        <p className="text-white/60 text-sm font-medium mb-1">Savings Goal</p>
        <h3 className="text-3xl font-bold flex items-center text-primary">
          <span className="mr-2">Rs.</span>
          12,500
        </h3>
        <div className="mt-4 w-full bg-surface rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
        </div>
        <p className="text-xs text-white/50 mt-2 text-right">65% Achieved</p>
      </div>
    </div>
  );
};

export default Summary;
