import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface Order {
  id: string;
  userId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'wave' | 'orange' | 'free';
  createdAt: string;
  city: string;
}

interface PremiumRequest {
  id: string;
  userId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  socialProofs: {
    instagram: string;
    tiktok: string;
    likes: number;
    comments: string[];
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  code?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  image: string;
  sizes: string[];
  colors: string[];
  isNew: boolean;
  isActive: boolean;
}

interface AdminState {
  admin: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  orders: Order[];
  premiumRequests: PremiumRequest[];
  products: Product[];
  stats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    totalCustomers: number;
    customersByCity: Record<string, number>;
    totalProducts: number;
    lowStockProducts: number;
  };
}

type AdminAction =
  | { type: 'ADMIN_LOGIN_START' }
  | { type: 'ADMIN_LOGIN_SUCCESS'; payload: AdminUser }
  | { type: 'ADMIN_LOGIN_FAILURE'; payload: string }
  | { type: 'ADMIN_LOGOUT' }
  | { type: 'LOAD_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'LOAD_PREMIUM_REQUESTS'; payload: PremiumRequest[] }
  | { type: 'APPROVE_PREMIUM_REQUEST'; payload: { requestId: string; code: string } }
  | { type: 'REJECT_PREMIUM_REQUEST'; payload: string }
  | { type: 'LOAD_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'UPDATE_STATS'; payload: AdminState['stats'] }
  | { type: 'CLEAR_ERROR' };

const initialState: AdminState = {
  admin: null,
  isLoading: false,
  error: null,
  orders: [],
  premiumRequests: [],
  products: [],
  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    customersByCity: {},
    totalProducts: 0,
    lowStockProducts: 0,
  },
};

const adminReducer = (state: AdminState, action: AdminAction): AdminState => {
  switch (action.type) {
    case 'ADMIN_LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'ADMIN_LOGIN_SUCCESS':
      return {
        ...state,
        admin: action.payload,
        isLoading: false,
        error: null,
      };
    case 'ADMIN_LOGIN_FAILURE':
      return {
        ...state,
        admin: null,
        isLoading: false,
        error: action.payload,
      };
    case 'ADMIN_LOGOUT':
      return {
        ...state,
        admin: null,
        isLoading: false,
        error: null,
      };
    case 'LOAD_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    case 'LOAD_PREMIUM_REQUESTS':
      return {
        ...state,
        premiumRequests: action.payload,
      };
    case 'APPROVE_PREMIUM_REQUEST':
      return {
        ...state,
        premiumRequests: state.premiumRequests.map(request =>
          request.id === action.payload.requestId
            ? { ...request, status: 'approved', code: action.payload.code }
            : request
        ),
      };
    case 'REJECT_PREMIUM_REQUEST':
      return {
        ...state,
        premiumRequests: state.premiumRequests.map(request =>
          request.id === action.payload
            ? { ...request, status: 'rejected' }
            : request
        ),
      };
    case 'LOAD_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AdminContextType {
  state: AdminState;
  adminLogin: (username: string, password: string) => Promise<void>;
  adminLogout: () => void;
  loadOrders: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  loadPremiumRequests: () => void;
  approvePremiumRequest: (requestId: string) => void;
  rejectPremiumRequest: (requestId: string) => void;
  loadProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStats: () => void;
  clearError: () => void;
  isAdminAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Charger l'admin depuis le localStorage au démarrage
  useEffect(() => {
    const savedAdmin = localStorage.getItem('siggil_admin');
    if (savedAdmin) {
      try {
        const admin = JSON.parse(savedAdmin);
        dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: admin });
      } catch (error) {
        localStorage.removeItem('siggil_admin');
      }
    }
  }, []);

  // Sauvegarder l'admin dans le localStorage
  useEffect(() => {
    if (state.admin) {
      localStorage.setItem('siggil_admin', JSON.stringify(state.admin));
    } else {
      localStorage.removeItem('siggil_admin');
    }
  }, [state.admin]);

  const adminLogin = async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'ADMIN_LOGIN_START' });

    try {
      // Simuler une vérification
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username === 'fallou' && password === 'lepsixella') {
        const admin: AdminUser = {
          username: 'fallou',
          isAuthenticated: true,
        };
        dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: admin });
      } else {
        dispatch({ 
          type: 'ADMIN_LOGIN_FAILURE', 
          payload: 'Nom d\'utilisateur ou mot de passe incorrect.' 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'ADMIN_LOGIN_FAILURE', 
        payload: 'Erreur lors de la connexion. Veuillez réessayer.' 
      });
    }
  };

  const adminLogout = (): void => {
    dispatch({ type: 'ADMIN_LOGOUT' });
  };

  const loadOrders = (): void => {
    // Charger les commandes depuis le localStorage
    const savedOrders = localStorage.getItem('siggil_orders');
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders);
        dispatch({ type: 'LOAD_ORDERS', payload: orders });
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error);
      }
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']): void => {
    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    
    // Mettre à jour dans le localStorage
    const updatedOrders = state.orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    localStorage.setItem('siggil_orders', JSON.stringify(updatedOrders));
  };

  const loadPremiumRequests = (): void => {
    // Charger les demandes premium depuis le localStorage
    const savedRequests = localStorage.getItem('siggil_premium_requests');
    if (savedRequests) {
      try {
        const requests = JSON.parse(savedRequests);
        dispatch({ type: 'LOAD_PREMIUM_REQUESTS', payload: requests });
      } catch (error) {
        console.error('Erreur lors du chargement des demandes premium:', error);
      }
    }
  };

  const approvePremiumRequest = (requestId: string): void => {
    const code = `SIGGIL-${Date.now().toString().slice(-6)}`;
    dispatch({ type: 'APPROVE_PREMIUM_REQUEST', payload: { requestId, code } });
    
    // Mettre à jour dans le localStorage
    const updatedRequests = state.premiumRequests.map(request =>
      request.id === requestId 
        ? { ...request, status: 'approved', code } 
        : request
    );
    localStorage.setItem('siggil_premium_requests', JSON.stringify(updatedRequests));
  };

  const rejectPremiumRequest = (requestId: string): void => {
    dispatch({ type: 'REJECT_PREMIUM_REQUEST', payload: requestId });
    
    // Mettre à jour dans le localStorage
    const updatedRequests = state.premiumRequests.map(request =>
      request.id === requestId 
        ? { ...request, status: 'rejected' } 
        : request
    );
    localStorage.setItem('siggil_premium_requests', JSON.stringify(updatedRequests));
  };

  const loadProducts = (): void => {
    // Charger les produits depuis le localStorage
    const savedProducts = localStorage.getItem('siggil_products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        dispatch({ type: 'LOAD_PRODUCTS', payload: products });
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    }
  };

  const addProduct = (productData: Omit<Product, 'id'>): void => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    
    // Sauvegarder dans le localStorage
    const updatedProducts = [...state.products, newProduct];
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (product: Product): void => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    
    // Mettre à jour dans le localStorage
    const updatedProducts = state.products.map(p =>
      p.id === product.id ? product : p
    );
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId: string): void => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
    // Mettre à jour dans le localStorage
    const updatedProducts = state.products.filter(p => p.id !== productId);
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const updateStats = (): void => {
    const orders = state.orders;
    const customers = new Set(orders.map(order => order.userId));
    const customersByCity: Record<string, number> = {};
    
    orders.forEach(order => {
      const city = order.city || 'Inconnue';
      customersByCity[city] = (customersByCity[city] || 0) + 1;
    });

    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders
        .filter(order => order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered')
        .reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalCustomers: customers.size,
      customersByCity,
      totalProducts: state.products.length,
      lowStockProducts: state.products.filter(product => product.stock < 10).length,
    };

    dispatch({ type: 'UPDATE_STATS', payload: stats });
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AdminContextType = {
    state,
    adminLogin,
    adminLogout,
    loadOrders,
    updateOrderStatus,
    loadPremiumRequests,
    approvePremiumRequest,
    rejectPremiumRequest,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStats,
    clearError,
    isAdminAuthenticated: !!state.admin?.isAuthenticated,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
