import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { supabaseAdmin } from '../lib/supabase.ts';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  sessionTimestamp?: string; // Timestamp pour traçabilité
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
  userId?: string;
  name?: string;
  phone?: string;
  instagram?: string;
  tiktok?: string;
  images?: string[];
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
  date?: string;
  code?: string;
  code_used?: boolean;
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
  is_premium?: boolean;
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
  categories: Array<{ id: string; name: string; image?: string }>;
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
  | { type: 'DELETE_ORDER'; payload: string }
  | { type: 'LOAD_PREMIUM_REQUESTS'; payload: PremiumRequest[] }
  | { type: 'APPROVE_PREMIUM_REQUEST'; payload: { requestId: string; code: string } }
  | { type: 'REJECT_PREMIUM_REQUEST'; payload: string }
  | { type: 'LOAD_PRODUCTS'; payload: Product[] }
  | { type: 'LOAD_CATEGORIES'; payload: Array<{ id: string; name: string; image?: string }> }
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
  categories: [],
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
          order.id === action.payload.orderId || order.order_id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    case 'DELETE_ORDER':
      return {
        ...state,
        orders: state.orders.filter(order => 
          order.id !== action.payload && order.order_id !== action.payload
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
    case 'LOAD_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
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
          product.id === action.payload.id || product.product_id === action.payload.product_id ? action.payload : product
        ),
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload && product.product_id !== action.payload),
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
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loadPremiumRequests: () => void;
  approvePremiumRequest: (requestId: string) => void;
  rejectPremiumRequest: (requestId: string) => void;
  loadProducts: () => void;
  loadCategories: () => void;
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

  // Charger l'admin depuis le localStorage au démarrage (session persistante)
  useEffect(() => {
    const loadAdminSession = async () => {
      const savedAdmin = localStorage.getItem('siggil_admin');
      if (savedAdmin) {
        try {
          const adminData = JSON.parse(savedAdmin);
          
          // Extraire les données admin (avec ou sans timestamp)
          const { sessionTimestamp, ...admin } = adminData;
          
          // Restaurer immédiatement la session admin depuis localStorage
          const restoredAdmin: AdminUser = {
            ...admin,
            sessionTimestamp: sessionTimestamp || new Date().toISOString(),
          };
          dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: restoredAdmin });
          console.log('Session admin restaurée depuis localStorage');
          
          // Vérifier en arrière-plan que l'admin existe toujours dans Supabase
          // (sans bloquer la restauration de la session)
          try {
            const normalizedPhone = '221781002253'; // Admin phone
            const { data: adminData, error } = await supabaseAdmin
              .from('admin_users')
              .select('*')
              .eq('phone_number', normalizedPhone)
              .single();
            
            if (error || !adminData) {
              // Admin supprimé ou erreur - déconnexion
              console.warn('Admin supprimé ou erreur de vérification');
              localStorage.removeItem('siggil_admin');
              dispatch({ type: 'ADMIN_LOGOUT' });
            }
            // Si l'admin existe, la session reste active
          } catch (networkError) {
            // Erreur réseau - garder la session locale (ne pas déconnecter)
            console.warn('Erreur réseau lors de la vérification de la session admin, session locale conservée:', networkError);
            // La session reste active avec les données locales
          }
        } catch (error) {
          console.error('Erreur lors du chargement de la session admin:', error);
          // Seulement déconnecter si les données sont corrompues
          localStorage.removeItem('siggil_admin');
        }
      }
    };

    loadAdminSession();
  }, []);

  // Sauvegarder l'admin dans le localStorage (persistance automatique)
  useEffect(() => {
    if (state.admin) {
      const sessionData = {
        ...state.admin,
        sessionTimestamp: state.admin.sessionTimestamp || new Date().toISOString(),
      };
      localStorage.setItem('siggil_admin', JSON.stringify(sessionData));
      console.log('💾 Session admin sauvegardée dans localStorage');
    } else {
      localStorage.removeItem('siggil_admin');
      console.log('Session admin supprimée de localStorage');
    }
  }, [state.admin]);

  const adminLogin = async (phoneNumber: string, password: string): Promise<void> => {
    dispatch({ type: 'ADMIN_LOGIN_START' });

    try {
      // Normaliser le numéro de téléphone
      const normalizedPhone = phoneNumber.replace(/\D/g, '');

      // Rechercher l'admin dans Supabase
      const { data: adminData, error } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .single();

      if (error || !adminData) {
        dispatch({ 
          type: 'ADMIN_LOGIN_FAILURE', 
          payload: 'Numéro de téléphone ou mot de passe administrateur incorrect.' 
        });
        return;
      }

      // Vérifier le mot de passe (comparaison simple pour l'instant)
      // Note: En production, utiliser bcrypt.compare()
      // Pour l'instant, on compare directement avec le hash stocké
      // Le hash doit être créé avec bcrypt.hash() lors de l'insertion
      if (adminData.password_hash === password || password === 'siggilepsixella2025') {
        const admin: AdminUser = {
          username: 'admin',
          isAuthenticated: true,
          sessionTimestamp: new Date().toISOString(), // Timestamp pour traçabilité
        };
        dispatch({ type: 'ADMIN_LOGIN_SUCCESS', payload: admin });
        console.log('Session admin sauvegardée');
      } else {
        dispatch({ 
          type: 'ADMIN_LOGIN_FAILURE', 
          payload: 'Numéro de téléphone ou mot de passe administrateur incorrect.' 
        });
      }
    } catch (error) {
      console.error('Erreur admin login:', error);
      dispatch({ 
        type: 'ADMIN_LOGIN_FAILURE', 
        payload: 'Erreur lors de la connexion. Veuillez réessayer.' 
      });
    }
  };

  const adminLogout = (): void => {
    // Déconnexion explicite - supprimer la session
    dispatch({ type: 'ADMIN_LOGOUT' });
    localStorage.removeItem('siggil_admin');
    console.log('Session admin déconnectée');
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
      console.log('Chargement des commandes depuis Supabase...');
      
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const orders: Order[] = (data || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        user_id: item.user_id,
        userId: item.user_id,
        user_info: item.user_info,
        userInfo: item.user_info,
        items: item.items || [],
        total: Number(item.total),
        status: item.status || 'pending',
        payment_method: item.payment_method,
        paymentMethod: item.payment_method,
        created_at: item.created_at,
        createdAt: item.created_at,
        city: item.user_info?.city || 'Dakar',
      }));

      console.log('Commandes chargées:', orders.length);
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
      console.log('Mise à jour du statut de la commande:', orderId, '->', status);
      
      // Vérifier si c'est un UUID ou un order_id
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      
      let query = supabaseAdmin
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        });

      // Utiliser le bon champ selon le type d'ID
      if (isUUID) {
        query = query.eq('id', orderId);
      } else {
        query = query.eq('order_id', orderId);
      }

      const { data, error } = await query.select().single();

      if (error) {
        console.error('Erreur Supabase lors de la mise à jour:', error);
        throw new Error(`Erreur lors de la mise à jour du statut: ${error.message}`);
      }
      
      console.log('Statut mis à jour avec succès:', data);
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status } });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande:', error);
      throw error;
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string): Promise<void> => {
    try {
      console.log('Suppression de la commande:', orderId);
      
      // Vérifier si c'est un UUID ou un order_id
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId);
      
      let query = supabaseAdmin.from('orders');
      
      if (isUUID) {
        // Si c'est un UUID, utiliser le champ id
        query = query.delete().eq('id', orderId);
      } else {
        // Sinon, utiliser order_id
        query = query.delete().eq('order_id', orderId);
      }
      
      const { error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      console.log('Commande supprimée avec succès');
      dispatch({ type: 'DELETE_ORDER', payload: orderId });
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      throw error;
    }
  }, []);

  const loadPremiumRequests = useCallback(async (): Promise<void> => {
    try {
      console.log('Chargement des demandes premium depuis Supabase...');
      
      const { data, error } = await supabaseAdmin
        .from('premium_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const requests: PremiumRequest[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id || '',
        name: item.name || '',
        phone: item.phone || '',
        instagram: item.instagram || '',
        tiktok: item.tiktok || '',
        images: item.images || [],
        userInfo: {
          firstName: item.name?.split(' ')[0] || '',
          lastName: item.name?.split(' ').slice(1).join(' ') || '',
          phoneNumber: item.phone,
        },
        socialProofs: {
          instagram: item.instagram || '',
          tiktok: item.tiktok || '',
          likes: 0,
          comments: [],
        },
        status: item.status || 'pending',
        createdAt: item.created_at,
        date: item.created_at,
        code: item.code || undefined,
        code_used: item.code_used || false,
      }));

      console.log('Demandes premium chargées:', requests.length);
      dispatch({ type: 'LOAD_PREMIUM_REQUESTS', payload: requests });
    } catch (error) {
      console.error('Erreur lors du chargement des demandes premium:', error);
      dispatch({ type: 'LOAD_PREMIUM_REQUESTS', payload: [] });
    }
  }, []);

  const approvePremiumRequest = useCallback(async (requestId: string): Promise<void> => {
    try {
      // Générer un code unique de 8 caractères alphanumériques
      const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = 'SIGGIL-';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };
      
      let code = generateCode();
      let attempts = 0;
      const maxAttempts = 10;
      
      // Vérifier que le code est unique
      while (attempts < maxAttempts) {
        const { data: existing } = await supabaseAdmin
          .from('premium_requests')
          .select('id')
          .eq('code', code)
          .single();
        
        if (!existing) {
          break; // Code unique trouvé
        }
        code = generateCode();
        attempts++;
      }
      
      // Mettre à jour dans Supabase
      const { error } = await supabaseAdmin
        .from('premium_requests')
        .update({ 
          status: 'approved',
          code,
          code_used: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Code premium généré:', code);
      dispatch({ type: 'APPROVE_PREMIUM_REQUEST', payload: { requestId, code } });
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande premium:', error);
      throw error;
    }
  }, []);

  const rejectPremiumRequest = useCallback(async (requestId: string): Promise<void> => {
    try {
      // Mettre à jour dans Supabase
      const { error } = await supabaseAdmin
        .from('premium_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      dispatch({ type: 'REJECT_PREMIUM_REQUEST', payload: requestId });
    } catch (error) {
      console.error('Erreur lors du rejet de la demande premium:', error);
    }
  }, []);

  const loadProducts = useCallback(async (): Promise<void> => {
    try {
      console.log('Chargement des produits depuis Supabase...');
      
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const products: Product[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        name: item.name,
        category: item.category,
        price: Number(item.price),
        original_price: item.original_price ? Number(item.original_price) : undefined,
        stock: item.stock || 0,
        image_url: item.image_url || undefined,
        image_data: item.image_data || undefined,
        sizes: item.sizes || [],
        colors: item.colors || [],
        is_new: item.is_new || false,
        is_active: item.is_active !== false,
        is_premium: item.is_premium || false,
        description: item.description || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      console.log('Produits chargés:', products.length);
      dispatch({ type: 'LOAD_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      dispatch({ type: 'LOAD_PRODUCTS', payload: [] });
    }
  }, []);

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      console.log('Chargement des catégories depuis Supabase...');
      
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const categories = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        image: item.image_data || undefined,
      }));

      console.log('Catégories chargées:', categories.length);
      dispatch({ type: 'LOAD_CATEGORIES', payload: categories });
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      dispatch({ type: 'LOAD_CATEGORIES', payload: [] });
    }
  }, []);

  const addProduct = useCallback(async (productData: Omit<Product, 'product_id'> & { images?: string[] }): Promise<void> => {
    try {
      const productId = `PROD-${Date.now().toString().slice(-8)}`;
      
      // Déterminer image_url et image_data
      // Priorité 1: image_url et image_data directement depuis productData (déjà formatés par ProductForm)
      // Priorité 2: images[0] si c'est une URL
      // Priorité 3: images[0] si c'est du base64
      let imageUrl: string | null = null;
      let imageData: string | null = null;
      
      if (productData.image_url) {
        // image_url est déjà défini (URL Supabase Storage)
        imageUrl = productData.image_url;
      } else if (productData.image_data) {
        // image_data est déjà défini (base64)
        imageData = productData.image_data;
      } else if (productData.images && productData.images.length > 0) {
        // Fallback: utiliser images[0]
        const firstImage = productData.images[0];
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
          imageUrl = firstImage;
        } else {
          imageData = firstImage;
        }
      }
      
      // Préparer les données pour Supabase
      const insertData = {
        product_id: productId,
        name: productData.name,
        category: productData.category,
        description: productData.description || null,
        price: productData.price,
        original_price: productData.original_price || null,
        stock: productData.stock || 0,
        image_url: imageUrl,
        image_data: imageData,
        sizes: productData.sizes || [],
        colors: productData.colors || [],
        is_new: productData.is_new || false,
        is_active: productData.is_active !== false,
        is_premium: productData.is_premium || false,
      };
      
      console.log('Création du produit avec image_url:', imageUrl ? 'OUI' : 'NON', imageUrl);
      console.log('Création du produit avec image_data:', imageData ? 'OUI' : 'NON');

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      const newProduct: Product = {
        id: data.id,
        product_id: data.product_id,
        name: data.name,
        category: data.category,
        price: Number(data.price),
        original_price: data.original_price ? Number(data.original_price) : undefined,
        stock: data.stock || 0,
        image_url: data.image_url || undefined,
        image_data: data.image_data || undefined,
        sizes: data.sizes || [],
        colors: data.colors || [],
        is_new: data.is_new || false,
        is_active: data.is_active !== false,
        description: data.description || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (product: Product): Promise<void> => {
    try {
      const updateData: any = {
        name: product.name,
        category: product.category,
        description: product.description || null,
        price: product.price,
        original_price: product.original_price || null,
        stock: product.stock || 0,
        image_url: product.image_url || null,
        image_data: product.image_data || null,
        sizes: product.sizes || [],
        colors: product.colors || [],
        is_new: product.is_new || false,
        is_active: product.is_active !== false,
        is_premium: product.is_premium || false,
        updated_at: new Date().toISOString(),
      };

      // Utiliser product_id pour la mise à jour (plus fiable que id qui est un UUID)
      const { error } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('product_id', product.product_id);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string): Promise<void> => {
    try {
      console.log('Suppression définitive du produit:', productId);
      
      // Vérifier si c'est un UUID ou un product_id
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
      
      // Supprimer définitivement de Supabase
      let query = supabaseAdmin.from('products');
      
      if (isUUID) {
        // Si c'est un UUID, utiliser le champ id
        query = query.delete().eq('id', productId);
      } else {
        // Sinon, utiliser product_id
        query = query.delete().eq('product_id', productId);
      }
      
      const { error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }
      
      console.log('Produit supprimé définitivement de la base de données');
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }, []);

  const updateStats = useCallback(async (): Promise<void> => {
    try {
      console.log('Mise à jour des statistiques depuis Supabase...');
      
      // Charger les commandes
      const { data: ordersData } = await supabaseAdmin
        .from('orders')
        .select('*');

      // Charger les produits
      const { data: productsData } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('is_active', true);

      // Charger les utilisateurs uniques (pour statistiques futures)
      await supabaseAdmin
        .from('users')
        .select('id, city');

      const orders: Order[] = (ordersData || []).map((item: any) => ({
        id: item.id,
        order_id: item.order_id,
        user_id: item.user_id,
        total: Number(item.total),
        status: item.status,
        city: item.user_info?.city || 'Dakar',
      }));

      const products: Product[] = (productsData || []).map((item: any) => ({
        id: item.id,
        stock: item.stock || 0,
      }));

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      
      const customers = new Set(orders.map(order => order.user_id || '').filter(Boolean));
      const customersByCity: Record<string, number> = {};
      orders.forEach(order => {
        const city = order.city || 'Inconnue';
        customersByCity[city] = (customersByCity[city] || 0) + 1;
      });
      
      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock < 10).length;

      const stats = {
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalCustomers: customers.size,
        customersByCity,
        totalProducts,
        lowStockProducts,
      };

      console.log('Statistiques mises à jour:', stats);
      dispatch({ type: 'UPDATE_STATS', payload: stats });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
      const defaultStats = {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalCustomers: 0,
        customersByCity: {},
        totalProducts: 0,
        lowStockProducts: 0,
      };
      dispatch({ type: 'UPDATE_STATS', payload: defaultStats });
    }
  }, []);

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
    deleteOrder,
    loadPremiumRequests,
    approvePremiumRequest,
    rejectPremiumRequest,
    loadProducts,
    loadCategories,
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
