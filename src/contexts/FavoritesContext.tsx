import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface FavoritesState {
  favorites: string[]; // IDs des produits favoris
  isLoading: boolean;
}

type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: string }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'LOAD_FAVORITES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
};

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      if (!state.favorites.includes(action.payload)) {
        return {
          ...state,
          favorites: [...state.favorites, action.payload],
        };
      }
      return state;
    
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
      };
    
    case 'LOAD_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

interface FavoritesContextType {
  state: FavoritesState;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  getFavoritesCount: () => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // Charger les favoris depuis localStorage au démarrage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('siggil_favorites');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        dispatch({ type: 'LOAD_FAVORITES', payload: favorites });
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        localStorage.removeItem('siggil_favorites');
      }
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('siggil_favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  const addFavorite = (productId: string) => {
    dispatch({ type: 'ADD_FAVORITE', payload: productId });
  };

  const removeFavorite = (productId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: productId });
  };

  const toggleFavorite = (productId: string) => {
    if (state.favorites.includes(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  const isFavorite = (productId: string): boolean => {
    return state.favorites.includes(productId);
  };

  const getFavoritesCount = (): number => {
    return state.favorites.length;
  };

  const value: FavoritesContextType = {
    state,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};


