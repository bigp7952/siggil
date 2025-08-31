import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

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
  description?: string;
  rating?: number;
  reviews?: number;
  images?: string[];
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    category: string;
    size: string;
    color: string;
    priceRange: { min: number; max: number };
    searchQuery: string;
  };
}

type ProductAction =
  | { type: 'LOAD_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<ProductState['filters']> }
  | { type: 'CLEAR_FILTERS' };

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    size: 'all',
    color: 'all',
    priceRange: { min: 0, max: 1000000 },
    searchQuery: '',
  },
};

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case 'LOAD_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        isLoading: false,
        error: null,
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
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    default:
      return state;
  }
};

interface ProductContextType {
  state: ProductState;
  loadProducts: () => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  setFilters: (filters: Partial<ProductState['filters']>) => void;
  clearFilters: () => void;
  getFilteredProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
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

  // Charger les produits depuis le localStorage
  const loadProducts = () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedProducts = localStorage.getItem('siggil_products');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        dispatch({ type: 'LOAD_PRODUCTS', payload: products });
      } else {
        // Produits par défaut si aucun produit n'existe
        const defaultProducts: Product[] = [
          {
            id: '1',
            name: 'SIGGIL Classic T-Shirt',
            category: 'T-shirts',
            price: 19500,
            originalPrice: 25000,
            stock: 50,
            image: '/back.jpg',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['noir', 'blanc', 'rouge'],
            isNew: true,
            isActive: true,
            description: 'T-shirt classique SIGGIL en coton premium',
            rating: 4.8,
            reviews: 157,
            images: [
              '/back.jpg',
              'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
              'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=600&fit=crop&crop=center',
            ]
          },
          {
            id: '2',
            name: 'SIGGIL Premium Hoodie',
            category: 'Vestes',
            price: 45000,
            originalPrice: 55000,
            stock: 30,
            image: '/back.jpg',
            sizes: ['M', 'L', 'XL', 'XXL'],
            colors: ['noir', 'gris'],
            isNew: false,
            isActive: true,
            description: 'Hoodie premium SIGGIL avec broderie exclusive',
            rating: 4.9,
            reviews: 89,
            images: [
              '/back.jpg',
              'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center',
            ]
          },
          {
            id: '3',
            name: 'SIGGIL Urban Jacket',
            category: 'Vestes',
            price: 75000,
            originalPrice: 90000,
            stock: 20,
            image: '/back.jpg',
            sizes: ['S', 'M', 'L'],
            colors: ['noir', 'bleu'],
            isNew: true,
            isActive: true,
            description: 'Veste urbaine SIGGIL pour un style unique',
            rating: 4.7,
            reviews: 45,
            images: [
              '/back.jpg',
              'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&crop=center',
            ]
          }
        ];
        dispatch({ type: 'LOAD_PRODUCTS', payload: defaultProducts });
        localStorage.setItem('siggil_products', JSON.stringify(defaultProducts));
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erreur lors du chargement des produits' });
    }
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    
    // Sauvegarder dans localStorage
    const updatedProducts = [...state.products, newProduct];
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (product: Product) => {
    dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    
    // Mettre à jour dans localStorage
    const updatedProducts = state.products.map(p =>
      p.id === product.id ? product : p
    );
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (productId: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    
    // Mettre à jour dans localStorage
    const updatedProducts = state.products.filter(p => p.id !== productId);
    localStorage.setItem('siggil_products', JSON.stringify(updatedProducts));
  };

  const setFilters = (filters: Partial<ProductState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  const getFilteredProducts = (): Product[] => {
    return state.products.filter(product => {
      // Filtre par catégorie
      if (state.filters.category !== 'all' && product.category !== state.filters.category) {
        return false;
      }

      // Filtre par taille
      if (state.filters.size !== 'all' && !product.sizes.includes(state.filters.size.toUpperCase())) {
        return false;
      }

      // Filtre par couleur
      if (state.filters.color !== 'all' && !product.colors.includes(state.filters.color)) {
        return false;
      }

      // Filtre par prix
      if (product.price < state.filters.priceRange.min || product.price > state.filters.priceRange.max) {
        return false;
      }

      // Filtre par recherche
      if (state.filters.searchQuery && !product.name.toLowerCase().includes(state.filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Seulement les produits actifs
      return product.isActive;
    });
  };

  const getProductById = (id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return state.products.filter(product => product.category === category && product.isActive);
  };

  // Charger les produits au démarrage
  useEffect(() => {
    loadProducts();
  }, []);

  const value: ProductContextType = {
    state,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    clearFilters,
    getFilteredProducts,
    getProductById,
    getProductsByCategory,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
