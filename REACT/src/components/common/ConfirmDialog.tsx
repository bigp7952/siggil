import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      title: 'text-red-900',
      message: 'text-red-800',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      iconBg: 'bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      title: 'text-yellow-900',
      message: 'text-yellow-800',
      icon: 'text-yellow-600',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      iconBg: 'bg-yellow-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      title: 'text-blue-900',
      message: 'text-blue-800',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      iconBg: 'bg-blue-100',
    },
  };

  const colorScheme = colors[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000]"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className={`
                ${colorScheme.bg} ${colorScheme.border} border md:border-2
                rounded-lg md:rounded-xl shadow-xl md:shadow-2xl max-w-md w-full mx-2 md:mx-0
                pointer-events-auto
                p-4 md:p-6
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                <div className={`${colorScheme.iconBg} rounded-full p-1.5 md:p-2 flex-shrink-0`}>
                  <AlertTriangle className={`w-5 h-5 md:w-6 md:h-6 ${colorScheme.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base md:text-lg font-display font-bold ${colorScheme.title} mb-1`}>
                    {title}
                  </h3>
                  <p className={`text-xs md:text-sm ${colorScheme.message} leading-relaxed`}>
                    {message}
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className={`flex-shrink-0 p-1 rounded-md md:rounded-lg transition-colors ${colorScheme.icon} hover:bg-black/5`}
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-end mt-4 md:mt-6">
                <button
                  onClick={onCancel}
                  className="px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors ${colorScheme.button}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

