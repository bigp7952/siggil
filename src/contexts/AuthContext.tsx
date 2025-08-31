import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (phoneNumber: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (phoneNumber: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulation d'une connexion
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérification simple du numéro de téléphone
      if (!phoneNumber || phoneNumber.length < 8) {
        throw new Error('Numéro de téléphone invalide');
      }

      // Créer un utilisateur fictif pour la démo
      const demoUser: User = {
        id: '1',
        firstName: 'Utilisateur',
        lastName: 'Demo',
        phoneNumber,
        address: 'Dakar, Sénégal',
      };

      setUser(demoUser);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('siggil_user', JSON.stringify(demoUser));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulation d'un enregistrement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validation des données
      if (!userData.firstName || !userData.lastName || !userData.phoneNumber) {
        throw new Error('Tous les champs sont obligatoires');
      }

      if (!userData.phoneNumber || userData.phoneNumber.length < 8) {
        throw new Error('Numéro de téléphone invalide');
      }

      // Créer le nouvel utilisateur
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };

      setUser(newUser);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('siggil_user', JSON.stringify(newUser));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    setError(null);
    localStorage.removeItem('siggil_user');
  };

  const clearError = (): void => {
    setError(null);
  };

  // Charger l'utilisateur depuis localStorage au démarrage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('siggil_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Erreur lors du chargement de l\'utilisateur:', err);
        localStorage.removeItem('siggil_user');
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
