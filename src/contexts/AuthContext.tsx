import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase.ts';

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
  setError: (error: string) => void;
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
      // Vérification simple du numéro de téléphone
      if (!phoneNumber || phoneNumber.length < 8) {
        throw new Error('Numéro de téléphone invalide');
      }

      // Rechercher l'utilisateur dans Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun utilisateur trouvé
          throw new Error('Aucun compte trouvé avec ce numéro de téléphone');
        }
        throw new Error('Erreur lors de la connexion');
      }

      if (!data) {
        throw new Error('Aucun compte trouvé avec ce numéro de téléphone');
      }

      // Convertir les données Supabase en format User
      const user: User = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phoneNumber: data.phone_number,
        address: data.address,
      };

      setUser(user);
      
      // Sauvegarder dans localStorage pour la persistance
      localStorage.setItem('siggil_user', JSON.stringify(user));
      
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
      // Validation des données
      if (!userData.firstName || !userData.lastName || !userData.phoneNumber) {
        throw new Error('Tous les champs sont obligatoires');
      }

      if (!userData.phoneNumber || userData.phoneNumber.length < 8) {
        throw new Error('Numéro de téléphone invalide');
      }

      // Vérifier si l'utilisateur existe déjà
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', userData.phoneNumber)
        .single();

      if (existingUser) {
        throw new Error('Un compte existe déjà avec ce numéro de téléphone');
      }

      // Insérer le nouvel utilisateur dans Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone_number: userData.phoneNumber,
            address: userData.address,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error('Erreur lors de l\'inscription');
      }

      if (!data) {
        throw new Error('Erreur lors de l\'inscription');
      }

      // Convertir les données Supabase en format User
      const newUser: User = {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        phoneNumber: data.phone_number,
        address: data.address,
      };

      setUser(newUser);
      
      // Sauvegarder dans localStorage pour la persistance
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

  const setErrorState = (error: string): void => {
    setError(error);
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
    setError: setErrorState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
