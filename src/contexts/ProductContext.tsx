import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { getAllActiveProducts, getProductsByCategory, getNewProducts } from '../services/productService.ts';

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

  // Charger tous les produits actifs
  const loadProducts = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const products = await getAllActiveProducts();
      dispatch({ type: 'LOAD_PRODUCTS', payload: products });
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des produits' });
    }
  };

  // Charger les nouveaux produits
  const loadNewProducts = async (): Promise<void> => {
    try {
      const newProducts = await getNewProducts();
      dispatch({ type: 'LOAD_NEW_PRODUCTS', payload: newProducts });
    } catch (error) {
      console.error('Erreur lors du chargement des nouveaux produits:', error);
    }
  };

  // Filtrer par catégorie
  const filterByCategory = async (category: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category });
    
    try {
      if (category === 'all') {
        const products = await getAllActiveProducts();
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: products });
        dispatch({ type: 'SET_SELECTED_CATEGORY', payload: null });
      } else {
        const products = await getProductsByCategory(category);
        dispatch({ type: 'SET_FILTERED_PRODUCTS', payload: products });
      }
    } catch (error) {
      console.error('Erreur lors du filtrage par catégorie:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du filtrage' });
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
  }, []);

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
