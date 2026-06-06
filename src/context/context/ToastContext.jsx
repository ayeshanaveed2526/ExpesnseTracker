import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle, Info, Undo2, X } from 'lucide-react';

const ToastContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const ctx = useContext(ToastContext);
  // Safe no-op fallback so callers never crash if used outside a provider.
  return ctx || { notify: () => {}, dismiss: () => {} };
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const notify = useCallback(
    ({ message, actionLabel, onAction, duration = 4000, type = 'info' }) => {
      const id = (idCounter += 1);
      setToasts((prev) => [...prev, { id, message, actionLabel, onAction, type }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center gap-2 w-[calc(100%-2rem)] max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const Icon = t.type === 'success' ? CheckCircle : Info;
        const accent =
          t.type === 'success'
            ? 'text-primary'
            : t.type === 'danger'
            ? 'text-rose-500'
            : 'text-text-muted';
        return (
          <div
            key={t.id}
            className="pointer-events-auto w-full flex items-center gap-3 bg-surface-bright/95 backdrop-blur-xl border border-border-main rounded-xl px-4 py-3 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300"
          >
            <Icon size={16} className={accent} />
            <span className="text-xs font-semibold text-text-main flex-1 truncate">
              {t.message}
            </span>
            {t.actionLabel && (
              <button
                onClick={() => {
                  if (t.onAction) t.onAction();
                  dismiss(t.id);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-emerald-400 transition-colors cursor-pointer flex-shrink-0"
              >
                <Undo2 size={13} />
                {t.actionLabel}
              </button>
            )}
            <button
              onClick={() => dismiss(t.id)}
              className="text-text-muted hover:text-text-main transition-colors cursor-pointer flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
