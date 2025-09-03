import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { createOrder } from '../services/orderService.ts';

interface PaymentMethod {
  id: 'wave' | 'orange' | 'free';
  name: string;
  icon: string | React.ReactNode;
  description: string;
}

interface PaymentState {
  selectedMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  orderId: string | null;
}

type PaymentAction =
  | { type: 'SET_PAYMENT_METHOD'; payload: PaymentMethod }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAYMENT_STATUS'; payload: PaymentState['paymentStatus'] }
  | { type: 'SET_ORDER_ID'; payload: string }
  | { type: 'RESET_PAYMENT' };

const initialState: PaymentState = {
  selectedMethod: null,
  isLoading: false,
  error: null,
  paymentStatus: 'idle',
  orderId: null,
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        selectedMethod: action.payload,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        paymentStatus: 'failed',
      };
    case 'SET_PAYMENT_STATUS':
      return {
        ...state,
        paymentStatus: action.payload,
      };
    case 'SET_ORDER_ID':
      return {
        ...state,
        orderId: action.payload,
      };
    case 'RESET_PAYMENT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

interface PaymentContextType {
  state: PaymentState;
  paymentMethods: PaymentMethod[];
  selectPaymentMethod: (method: PaymentMethod) => void;
  processPayment: (amount: number, phoneNumber: string, userInfo?: any, cartItems?: any[]) => Promise<boolean>;
  resetPayment: () => void;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'wave',
      name: 'Wave',
      icon: '/wave.png',
      description: 'Paiement rapide et sécurisé avec Wave',
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: '/om.png',
      description: 'Paiement mobile avec Orange Money',
    },
    {
      id: 'free',
      name: 'Paiement à la livraison',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Payez à la réception de votre commande',
    },
  ];

  const selectPaymentMethod = (method: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const processPayment = async (amount: number, phoneNumber: string, userInfo: any, cartItems: any[]): Promise<boolean> => {
    if (!state.selectedMethod) {
      dispatch({ type: 'SET_ERROR', payload: 'Veuillez sélectionner un mode de paiement' });
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'processing' });

    try {
      // Générer un ID de commande
      const orderId = `SIGGIL-${Date.now().toString().slice(-8)}`;
      dispatch({ type: 'SET_ORDER_ID', payload: orderId });

      // Simuler le processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulation de succès/échec basée sur le numéro de téléphone
      const isSuccess = phoneNumber.length >= 8;

             if (isSuccess) {
         dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'success' });
         
         // Créer la commande dans Supabase
         const orderData = {
           order_id: orderId,
           user_id: userInfo?.id || 'anonymous',
           user_info: {
             firstName: userInfo?.firstName || 'Anonyme',
             lastName: userInfo?.lastName || 'Utilisateur',
             phoneNumber: phoneNumber,
             address: userInfo?.address || 'Adresse non spécifiée',
           },
           items: cartItems,
           total: amount,
           payment_method: state.selectedMethod.id,
           city: userInfo?.city || 'Dakar',
         };

         const savedOrder = await createOrder(orderData);
         if (!savedOrder) {
           throw new Error('Erreur lors de la sauvegarde de la commande');
         }

         console.log('Commande créée avec succès:', savedOrder);
         console.log('OrderId dans le contexte:', orderId);
         
         return true;
      } else {
        throw new Error('Échec du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du paiement';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetPayment = () => {
    dispatch({ type: 'RESET_PAYMENT' });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: PaymentContextType = {
    state,
    paymentMethods,
    selectPaymentMethod,
    processPayment,
    resetPayment,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
