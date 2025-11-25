import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, Package, XCircle, CreditCard } from 'lucide-react';

interface TimelineStep {
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  date?: string;
}

interface OrderTimelineProps {
  currentStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, createdAt, updatedAt }) => {
  const allSteps: TimelineStep[] = [
    {
      status: 'pending',
      label: 'Commande reçue',
      description: 'Votre commande a été enregistrée',
      icon: Package,
    },
    {
      status: 'paid',
      label: 'Paiement confirmé',
      description: 'Votre paiement a été validé',
      icon: CreditCard,
    },
    {
      status: 'shipped',
      label: 'Expédiée',
      description: 'Votre commande est en route',
      icon: Truck,
    },
    {
      status: 'delivered',
      label: 'Livrée',
      description: 'Votre commande a été livrée',
      icon: CheckCircle,
    },
  ];

  const cancelledStep: TimelineStep = {
    status: 'cancelled',
    label: 'Annulée',
    description: 'Votre commande a été annulée',
    icon: XCircle,
  };

  const getStatusIndex = (status: string): number => {
    const statusOrder = ['pending', 'paid', 'shipped', 'delivered'];
    return statusOrder.indexOf(status);
  };

  const isStepCompleted = (stepStatus: string): boolean => {
    if (currentStatus === 'cancelled') {
      return stepStatus === 'cancelled';
    }
    return getStatusIndex(stepStatus) <= getStatusIndex(currentStatus);
  };

  const isStepActive = (stepStatus: string): boolean => {
    return stepStatus === currentStatus;
  };

  const getStepColor = (step: TimelineStep, isCompleted: boolean, isActive: boolean) => {
    if (currentStatus === 'cancelled') {
      return {
        bg: 'bg-red-100',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: 'text-red-600',
      };
    }
    if (isActive) {
      return {
        bg: 'bg-[#ff6c00]',
        border: 'border-[#ff6c00]',
        text: 'text-[#ff6c00]',
        icon: 'text-white',
      };
    }
    if (isCompleted) {
      return {
        bg: 'bg-green-100',
        border: 'border-green-300',
        text: 'text-green-700',
        icon: 'text-green-600',
      };
    }
    return {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-400',
      icon: 'text-gray-400',
    };
  };

  const stepsToShow = currentStatus === 'cancelled' 
    ? [allSteps[0], cancelledStep]
    : allSteps.filter(step => {
        const stepIndex = getStatusIndex(step.status);
        const currentIndex = getStatusIndex(currentStatus);
        return stepIndex <= currentIndex || stepIndex === currentIndex + 1;
      });

  return (
    <div className="relative">
      <div className="space-y-6">
        {stepsToShow.map((step, index) => {
          const isCompleted = isStepCompleted(step.status);
          const isActive = isStepActive(step.status);
          const isLast = index === stepsToShow.length - 1;
          const colors = getStepColor(step, isCompleted, isActive);
          const Icon = step.icon;

          return (
            <div key={step.status} className="relative flex gap-4">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-5 top-12 w-0.5 h-full">
                  <div
                    className={`h-full ${
                      isCompleted && currentStatus !== 'cancelled'
                        ? 'bg-green-300'
                        : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'ring-4 ring-[#ff6c00]/20' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${colors.icon}`} />
                {isCompleted && currentStatus !== 'cancelled' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </motion.div>

              {/* Content */}
              <div className="flex-1 pb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                  className={`${colors.text}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold text-sm md:text-base ${isActive ? 'text-[#ff6c00]' : ''}`}>
                      {step.label}
                    </h3>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ff6c00]/10 text-[#ff6c00]"
                      >
                        En cours
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-text">{step.description}</p>
                  {isActive && updatedAt && (
                    <p className="text-xs text-gray-text mt-1">
                      Mis à jour le {new Date(updatedAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;

