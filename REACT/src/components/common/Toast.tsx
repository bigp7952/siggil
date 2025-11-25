import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-900',
      icon: 'text-green-600',
      button: 'hover:bg-green-100',
      shadow: 'shadow-green-200/50',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-900',
      icon: 'text-red-600',
      button: 'hover:bg-red-100',
      shadow: 'shadow-red-200/50',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-900',
      icon: 'text-yellow-600',
      button: 'hover:bg-yellow-100',
      shadow: 'shadow-yellow-200/50',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      button: 'hover:bg-blue-100',
      shadow: 'shadow-blue-200/50',
    },
  };

  const Icon = icons[toast.type];
  const colorScheme = colors[toast.type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        relative flex items-start gap-2 md:gap-3 p-2.5 md:p-4 rounded-lg md:rounded-xl shadow-lg md:shadow-xl
        ${colorScheme.bg} ${colorScheme.border} border md:border-2
        min-w-[280px] max-w-[calc(100vw-2rem)] md:min-w-[320px] md:max-w-[420px]
        backdrop-blur-sm md:backdrop-blur-md
        ${colorScheme.shadow}
      `}
    >
      <div className={`flex-shrink-0 w-7 h-7 md:w-10 md:h-10 rounded-full ${colorScheme.bg} flex items-center justify-center ${colorScheme.icon} bg-opacity-50`}>
        <Icon className="w-3.5 h-3.5 md:w-5 md:h-5" />
      </div>
      <p className={`flex-1 text-xs md:text-sm font-medium ${colorScheme.text} leading-relaxed`}>
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className={`
          flex-shrink-0 p-1 md:p-1.5 rounded-md md:rounded-lg transition-all duration-200
          ${colorScheme.button} ${colorScheme.icon}
          hover:scale-110 active:scale-95
        `}
        aria-label="Fermer"
      >
        <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-[9999] flex flex-col gap-2 md:gap-3 pointer-events-none max-h-[calc(100vh-1rem)] md:max-h-[calc(100vh-2rem)] overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onClose={onClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

