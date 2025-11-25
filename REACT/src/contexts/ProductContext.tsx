import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase.ts';

export interface Product {
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

interface ProductState {
  products: Product[];
  newProducts: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  searchTerm: string;
}

type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_PRODUCTS'; payload: Product[] }
  | { type: 'LOAD_NEW_PRODUCTS'; payload: Product[] }
  | { type: 'SET_FILTERED_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'CLEAR_FILTERS' };

const initialState: ProductState = {
  products: [],
  newProducts: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  selectedCategory: null,
  searchTerm: '',
};

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
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
      };
    case 'LOAD_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
        isLoading: false,
        error: null,
      };
    case 'LOAD_NEW_PRODUCTS':
      return {
        ...state,
        newProducts: action.payload,
      };
    case 'SET_FILTERED_PRODUCTS':
      return {
        ...state,
        filteredProducts: action.payload,
      };
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        selectedCategory: null,
        searchTerm: '',
        filteredProducts: state.products,
      };
    default:
      return state;
  }
};

interface ProductContextType {
  state: ProductState;
  loadProducts: () => Promise<void>;
  loadNewProducts: () => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  searchProducts: (searchTerm: string) => Promise<Product[]>;
  clearFilters: () => void;
  getProductById: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Charger tous les produits actifs depuis Supabase
  const loadProducts = useCallback(async (): Promise<void> => {
    // Éviter les appels multiples simultanés
    if (state.isLoading) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('Chargement des produits depuis Supabase...');
      
      // Limiter à 50 produits et sélectionner seulement les champs nécessaires pour éviter les timeouts
      // Exclure les produits premium (is_premium = false ou NULL)
      const { data, error } = await supabase
        .from('products')
        .select('id, product_id, name, category, price, original_price, stock, image_url, image_data, sizes, colors, is_new, is_active, is_premium, description, created_at, updated_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      console.log('Produits chargés:', data?.length || 0);

      // Convertir les données Supabase au format Product avec gestion d'erreur
      // Exclure les produits premium (is_premium = true)
      const products: Product[] = (data || [])
        .map((item: any) => {
          try {
            return {
              id: item.id,
              product_id: item.product_id,
              name: item.name,
              category: item.category,
              price: Number(item.price),
              original_price: item.original_price ? Number(item.original_price) : undefined,
              stock: item.stock || 0,
              image_url: item.image_url || undefined,
              // Limiter la taille de image_data pour éviter les erreurs JSON (500KB max)
              image_data: item.image_data ? (typeof item.image_data === 'string' && item.image_data.length < 500000 ? item.image_data : undefined) : undefined,
              sizes: Array.isArray(item.sizes) ? item.sizes : [],
              colors: Array.isArray(item.colors) ? item.colors : [],
              is_new: item.is_new || false,
              is_active: item.is_active !== false,
              is_premium: item.is_premium || false,
              description: item.description || undefined,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          } catch (parseError) {
            console.error('Erreur lors de la conversion d\'un produit:', parseError, item);
            return null;
          }
        })
        .filter((p): p is Product => p !== null)
        .filter(p => !p.is_premium); // Exclure les produits premium

      dispatch({ type: 'LOAD_PRODUCTS', payload: products });
    } catch (error: any) {
      console.error('Erreur lors du chargement des produits:', error);
      const errorMessage = error?.message || 'Erreur lors du chargement des produits';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // Fallback vers localStorage si Supabase échoue
      console.log('Tentative de chargement depuis localStorage...');
      try {
        const savedProducts = localStorage.getItem('siggil_products');
        if (savedProducts) {
          const products: Product[] = JSON.parse(savedProducts);
          const activeProducts = products.filter(p => p.is_active !== false);
          dispatch({ type: 'LOAD_PRODUCTS', payload: activeProducts });
          console.log('Produits chargés depuis localStorage:', activeProducts.length);
        } else {
          dispatch({ type: 'LOAD_PRODUCTS', payload: [] });
          console.log('Aucun produit dans localStorage');
        }
      } catch (localError) {
        console.error('Erreur lors du chargement depuis localStorage:', localError);
        dispatch({ type: 'LOAD_PRODUCTS', payload: [] });
      }
    }
  }, [state.isLoading]);

  // Charger les nouveaux produits depuis Supabase
  const loadNewProducts = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur Supabase (nouveaux produits):', error);
        throw error;
      }

      // Convertir les données Supabase au format Product
      const newProducts: Product[] = (data || []).map((item: any) => ({
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
        description: item.description || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));

      dispatch({ type: 'LOAD_NEW_PRODUCTS', payload: newProducts });
    } catch (error: any) {
      console.error('Erreur lors du chargement des nouveaux produits:', error);
      // Fallback vers localStorage
      try {
        const savedProducts = localStorage.getItem('siggil_products');
        const products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];
        const newProducts = products.filter(p => p.is_new === true && p.is_active !== false);
        dispatch({ type: 'LOAD_NEW_PRODUCTS', payload: newProducts });
      } catch (localError) {
        console.error('Erreur lors du chargement depuis localStorage:', localError);
      }
    }
  };

  // Filtrer par catégorie
  const filterByCategory = async (category: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    
    try {
      // Si "all", utiliser les produits déjà chargés
      if (category === 'all') {
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: state.products });
        dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Filtrer les produits déjà chargés par catégorie (plus rapide que de refaire une requête)
      const filtered = state.products.filter(p => p.category === category);
      
      if (filtered.length > 0) {
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Si aucun produit trouvé localement, faire une requête Supabase
      let query = supabase
        .from('products')
        .select('id, product_id, name, category, price, original_price, stock, image_url, image_data, sizes, colors, is_new, is_active, description, created_at, updated_at')
        .eq('is_active', true)
        .eq('category', category);

      const { data, error } = await query.order('created_at', { ascending: false }).limit(50);

      if (error) {
        console.error('Erreur Supabase (filtrage):', error);
        throw error;
      }

      // Convertir les données Supabase au format Product
      const products: Product[] = (data || [])
        .map((item: any) => {
          try {
            return {
              id: item.id,
              product_id: item.product_id,
              name: item.name,
              category: item.category,
              price: Number(item.price),
              original_price: item.original_price ? Number(item.original_price) : undefined,
              stock: item.stock || 0,
              image_url: item.image_url || undefined,
              // Limiter la taille de image_data pour éviter les erreurs JSON
              image_data: item.image_data ? (typeof item.image_data === 'string' && item.image_data.length < 500000 ? item.image_data : undefined) : undefined,
              sizes: Array.isArray(item.sizes) ? item.sizes : [],
              colors: Array.isArray(item.colors) ? item.colors : [],
              is_new: item.is_new || false,
              is_active: item.is_active !== false,
              description: item.description || undefined,
              created_at: item.created_at,
              updated_at: item.updated_at,
            };
          } catch (parseError) {
            console.error('Erreur lors de la conversion d\'un produit:', parseError, item);
            return null;
          }
        })
        .filter((p): p is Product => p !== null);

      dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: products });
    } catch (error: any) {
      console.error('Erreur lors du filtrage par catégorie:', error);
      dispatch({ type: 'SET_ERROR', payload: error?.message || 'Erreur lors du filtrage' });
      
      // Fallback vers localStorage
      try {
        const savedProducts = localStorage.getItem('siggil_products');
        const products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];
        const activeProducts = products.filter(p => p.is_active !== false);
        
        if (category === 'all') {
          dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: activeProducts });
          dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null });
        } else {
          const filtered = activeProducts.filter(p => p.category === category);
          dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: filtered });
        }
      } catch (localError) {
        console.error('Erreur lors du chargement depuis localStorage:', localError);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Rechercher des produits
  const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    if (!searchTerm.trim()) {
      return state.products;
    }

    try {
      // Recherche locale dans les produits chargés
      const searchLower = searchTerm.toLowerCase();
      const filteredProducts = state.products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
      
      return filteredProducts;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  };

  // Effacer tous les filtres
  const clearFilters = (): void => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Obtenir un produit par ID
  const getProductById = (productId: string): Product | undefined => {
    return state.products.find(product => product.product_id === productId);
  };

  // Charger les produits au démarrage
  useEffect(() => {
    loadProducts();
    loadNewProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionnellement vide - on charge une seule fois au montage

  const value: ProductContextType = {
    state,
    loadProducts,
    loadNewProducts,
    filterByCategory,
    searchProducts,
    clearFilters,
    getProductById,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
