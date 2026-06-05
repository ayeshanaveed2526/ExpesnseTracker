import React from 'react';
import { useOutletContext } from 'react-router-dom';

const Settings = () => {
  const { theme, toggleTheme } = useOutletContext();
  const isLight = theme === 'light';

  return (
    <div className="bg-surface-bright/40 backdrop-blur-lg rounded-2xl border border-border-main p-4 md:p-8 animate-fade-in-up max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-xl font-bold text-text-main mb-8">Settings</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-text-main mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Full Name</label>
              <input type="text" defaultValue="John Doe" className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Email Address</label>
              <input type="email" defaultValue="john@example.com" className="w-full bg-surface border border-border-main rounded-xl px-4 py-3 text-text-main focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-text-main mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-main">
              <div>
                <h4 className="font-medium text-text-main">Light Mode</h4>
                <p className="text-sm text-text-muted">Turn on light mode</p>
              </div>
              <div 
                onClick={toggleTheme}
                className={`w-12 h-6 rounded-full relative cursor-pointer shadow-lg shadow-primary/20 transition-colors ${isLight ? 'bg-primary' : 'bg-surface-bright border border-border-main'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isLight ? 'right-1 bg-surface-bright' : 'left-1 bg-primary'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-main">
              <div>
                <h4 className="font-medium text-text-main">Currency</h4>
                <p className="text-sm text-text-muted">Select your default currency</p>
              </div>
              <select className="bg-surface-bright border border-border-main rounded-lg px-3 py-1 text-text-main focus:outline-none focus:border-primary">
                <option>PKR (Rs.)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-primary text-secondary font-bold py-3 px-8 rounded-xl hover:bg-primary/90 hover:scale-[0.98] transition-all active:scale-95 shadow-lg shadow-primary/20">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
