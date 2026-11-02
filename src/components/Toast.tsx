import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-[#0E1529]/95 text-emerald-400 border-emerald-500/30'
                : isError
                ? 'bg-[#1F0E14]/95 text-rose-400 border-rose-500/30'
                : 'bg-[#0E1326]/95 text-cyan-400 border-cyan-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
              <span className="text-white font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
