import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getAllOrders, updateOrderStatus as updateOrderStatusService, getOrderStats } from '../services/orderService.ts';
import { getAllProducts, createProduct, updateProduct as updateProductService, deleteProduct as deleteProductService, getProductStats } from '../services/productService.ts';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface Order {
  id?: string;
  order_id: string;
  userId?: string;
  user_id?: string;
  userInfo?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  };
  user_info?: {
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
    size?: string;
    color?: string;
  }>;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: 'wave' | 'orange' | 'free';
  payment_method?: 'wave' | 'orange' | 'free';
  createdAt?: string;
  created_at?: string;
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
  id?: string;
  product_id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  stock: number;
  image_url?: string;
  image_data?: string;
  sizes: string[];
  colors: string[];
  is_new: boolean;
  is_active: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
  adminLogin: (phoneNumber: string, password: string) => Promise<void>;
  adminLogout: () => void;
  loadOrders: () => void;
  refreshOrders: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  loadPremiumRequests: () => void;
  approvePremiumRequest: (requestId: string) => void;
  rejectPremiumRequest: (requestId: string) => void;
  loadProducts: () => void;
  addProduct: (product: Omit<Product, 'product_id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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

  const adminLogin = async (phoneNumber: string, password: string): Promise<void> => {
    dispatch({ type: 'ADMIN_LOGIN_START' });

    try {
      // Simuler une vérification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier avec les nouveaux identifiants admin
      const ADMIN_PHONE = '221781002253';
      const ADMIN_PASSWORD = 'siggilepsixella2025';

      if (phoneNumber.replace(/\D/g, '') === ADMIN_PHONE && password === ADMIN_PASSWORD) {
        const admin: AdminUser = {
          username: 'admin',
          isAuthenticated: true,
        };
        dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: admin });
      } else {
        dispatch({ 
          type: 'ADMIN_LOGIN_FAILURE', 
          payload: 'Numéro de téléphone ou mot de passe administrateur incorrect.' 
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

  // Fonction pour normaliser les données des commandes
  const normalizeOrder = (order: any): Order => {
    return {
      ...order,
      userInfo: order.user_info || order.userInfo,
      user_info: order.user_info || order.userInfo,
      paymentMethod: order.payment_method || order.paymentMethod,
      payment_method: order.payment_method || order.paymentMethod,
      createdAt: order.created_at || order.createdAt,
      created_at: order.created_at || order.createdAt,
    };
  };

  const loadOrders = useCallback(async (): Promise<void> => {
    try {
      const orders = await getAllOrders();
      const normalizedOrders = orders.map(normalizeOrder);
      dispatch({ type: 'LOAD_ORDERS', payload: normalizedOrders });
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      dispatch({ type: 'LOAD_ORDERS', payload: [] });
    }
  }, []);

  const refreshOrders = useCallback(async (): Promise<void> => {
    await loadOrders();
  }, [loadOrders]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']): Promise<void> => {
    try {
      const success = await updateOrderStatusService(orderId, status);
      if (success) {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
      } else {
        console.error('Erreur lors de la mise à jour du statut de la commande');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
    }
  }, []);

  const loadPremiumRequests = useCallback((): void => {
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
  }, []);

  const approvePremiumRequest = useCallback((requestId: string): void => {
    const code = `SIGGIL-${Date.now().toString().slice(-6)}`;
    dispatch({ type: 'APPROVE_PREMIUM_REQUEST', payload: { requestId, code } });
    
    // Mettre à jour dans le localStorage
    const updatedRequests = state.premiumRequests.map(request =>
      request.id === requestId 
        ? { ...request, status: 'approved', code } 
        : request
    );
    localStorage.setItem('siggil_premium_requests', JSON.stringify(updatedRequests));
  }, [state.premiumRequests]);

  const rejectPremiumRequest = useCallback((requestId: string): void => {
    dispatch({ type: 'REJECT_PREMIUM_REQUEST', payload: requestId });
    
    // Mettre à jour dans le localStorage
    const updatedRequests = state.premiumRequests.map(request =>
      request.id === requestId 
        ? { ...request, status: 'rejected' } 
        : request
    );
    localStorage.setItem('siggil_premium_requests', JSON.stringify(updatedRequests));
  }, [state.premiumRequests]);

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      const products = await getAllProducts();
      dispatch({ type: 'LOAD_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      dispatch({ type: 'LOAD_PRODUCTS', payload: [] });
    }
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'product_id'>): Promise<void> => {
    try {
      const productId = `PROD-${Date.now().toString().slice(-8)}`;
      const newProductData = {
        ...productData,
        product_id: productId,
      };
      
      const savedProduct = await createProduct(newProductData);
      if (savedProduct) {
        dispatch({ type: 'ADD_PRODUCT', payload: savedProduct });
      } else {
        console.error('Erreur lors de la création du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product): Promise<void> => {
    try {
      const success = await updateProductService(product.product_id, {
        name: product.name,
        category: product.category,
        price: product.price,
        original_price: product.original_price,
        stock: product.stock,
        image_url: product.image_url,
        image_data: product.image_data,
        sizes: product.sizes,
        colors: product.colors,
        is_new: product.is_new,
        is_active: product.is_active,
        description: product.description,
      });
      
      if (success) {
        dispatch({ type: 'UPDATE_PRODUCT', payload: product });
      } else {
        console.error('Erreur lors de la mise à jour du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string): Promise<void> => {
    try {
      const success = await deleteProductService(productId);
      if (success) {
        dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      } else {
        console.error('Erreur lors de la suppression du produit');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  }, []);

  const updateStats = useCallback(async (): Promise<void> => {
    try {
      const orderStats = await getOrderStats();
      const productStats = await getProductStats();
      const customers = new Set(state.orders.map(order => order.userId || order.user_id));
      const customersByCity: Record<string, number> = {};
      
      state.orders.forEach(order => {
        const city = order.city || 'Inconnue';
        customersByCity[city] = (customersByCity[city] || 0) + 1;
      });

      const stats = {
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        pendingOrders: orderStats.pendingOrders,
        totalCustomers: customers.size,
        customersByCity,
        totalProducts: productStats.totalProducts,
        lowStockProducts: productStats.lowStockProducts,
      };

      dispatch({ type: 'UPDATE_STATS', payload: stats });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
  }, [state.orders]);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AdminContextType = {
    state,
    adminLogin,
    adminLogout,
    loadOrders,
    refreshOrders,
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
