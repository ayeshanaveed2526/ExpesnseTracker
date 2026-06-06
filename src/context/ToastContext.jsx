import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((options) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      message: options.message,
      type: options.type || 'success',
      actionLabel: options.actionLabel,
      onAction: options.onAction,
      duration: options.duration || 4000,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-primary shrink-0 animate-bounce" />;
      case 'danger':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-danger shrink-0 animate-pulse" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      
      {/* Toast Portal/Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 bg-surface-bright/80 backdrop-blur-xl border border-border-main rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 fade-in duration-300"
            role="alert"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {getIcon(toast.type)}
              <p className="text-xs font-bold text-text-main truncate pr-2">
                {toast.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {toast.onAction && toast.actionLabel && (
                <button
                  onClick={() => {
                    toast.onAction();
                    removeToast(toast.id);
                  }}
                  className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-extrabold tracking-wide uppercase rounded-lg transition-all hover:scale-95 cursor-pointer"
                >
                  {toast.actionLabel}
                </button>
              )}
              
              <button
                onClick={() => removeToast(toast.id)}
                className="text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
