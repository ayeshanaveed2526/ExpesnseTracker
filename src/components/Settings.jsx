import React from 'react';
import { X } from 'lucide-react';

const Settings = ({ theme, toggleTheme, onClose }) => {
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-bright rounded-2xl border border-border-main p-6 shadow-2xl relative animate-in slide-in-from-bottom-8 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-text-main mb-8">Settings</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-main">
                <div>
                  <h4 className="font-medium text-text-main">Light Mode</h4>
                  <p className="text-sm text-text-muted">Switch application theme</p>
                </div>
                <div 
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full relative cursor-pointer shadow-lg transition-colors ${isLight ? 'bg-primary' : 'bg-surface-bright border border-border-main'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isLight ? 'right-1 bg-surface-bright' : 'left-1 bg-primary'}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border-main">
                <div>
                  <h4 className="font-medium text-text-main">Currency</h4>
                  <p className="text-sm text-text-muted">Select default currency</p>
                </div>
                <select className="bg-surface-bright border border-border-main rounded-lg px-3 py-1 text-text-main focus:outline-none focus:border-primary">
                  <option>PKR (Rs.)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
