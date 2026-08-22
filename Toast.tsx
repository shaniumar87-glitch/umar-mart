import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-slate-900 border border-blue-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-blue-900/40 flex items-center space-x-3 backdrop-blur-md max-w-md">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        <span className="text-xs font-semibold leading-tight">{message}</span>
        <button onClick={onClose} className="text-slate-400 hover:text-white pl-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
