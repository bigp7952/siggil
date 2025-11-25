import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase.ts';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city?: string;
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

      // Normaliser le numéro de téléphone (enlever les caractères non numériques)
      const normalizedPhone = phoneNumber.replace(/\D/g, '');

      // Rechercher l'utilisateur dans Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .single();

      if (error || !data) {
        throw new Error('Aucun compte trouvé avec ce numéro de téléphone');
      }

      // Mapper les données Supabase vers l'interface User
      const foundUser: User = {
        id: data.id,
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phoneNumber: data.phone_number,
        address: data.address || '',
        city: data.city || undefined,
      };

      setUser(foundUser);
      
      // Sauvegarder dans localStorage pour la persistance (session persistante)
      const sessionData = {
        ...foundUser,
        sessionTimestamp: new Date().toISOString(), // Timestamp pour traçabilité
      };
      localStorage.setItem('siggil_user', JSON.stringify(sessionData));
      console.log('Session utilisateur sauvegardée');
      
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

      // Normaliser le numéro de téléphone
      const normalizedPhone = userData.phoneNumber.replace(/\D/g, '');

      // Vérifier si l'utilisateur existe déjà dans Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', normalizedPhone)
        .single();

      if (existingUser) {
        throw new Error('Un compte existe déjà avec ce numéro de téléphone');
      }

      // Créer le nouvel utilisateur dans Supabase
      const { data: newUserData, error } = await supabase
        .from('users')
        .insert({
          phone_number: normalizedPhone,
          first_name: userData.firstName,
          last_name: userData.lastName,
          address: userData.address || null,
          city: userData.city || null,
        })
        .select()
        .single();

      if (error || !newUserData) {
        throw new Error(error?.message || 'Erreur lors de la création du compte');
      }

      // Mapper les données Supabase vers l'interface User
      const newUser: User = {
        id: newUserData.id,
        firstName: newUserData.first_name || '',
        lastName: newUserData.last_name || '',
        phoneNumber: newUserData.phone_number,
        address: newUserData.address || '',
        city: newUserData.city || undefined,
      };

      setUser(newUser);
      
      // Sauvegarder dans localStorage pour la persistance (session persistante)
      const sessionData = {
        ...newUser,
        sessionTimestamp: new Date().toISOString(), // Timestamp pour traçabilité
      };
      localStorage.setItem('siggil_user', JSON.stringify(sessionData));
      console.log('Session utilisateur créée et sauvegardée');
      
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
    // Déconnexion explicite - supprimer la session
    setUser(null);
    setError(null);
    localStorage.removeItem('siggil_user');
    console.log('Session utilisateur déconnectée');
  };

  const clearError = (): void => {
    setError(null);
  };

  const setErrorState = (error: string): void => {
    setError(error);
  };

  // Charger l'utilisateur au démarrage (depuis localStorage - session persistante)
  React.useEffect(() => {
    const loadUser = async () => {
      // Charger depuis localStorage (session persistante jusqu'à déconnexion)
      const savedUser = localStorage.getItem('siggil_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          
          // Extraire les données utilisateur (sans le timestamp de session)
          const { sessionTimestamp, ...userInfo } = userData;
          
          // Restaurer immédiatement la session depuis localStorage
          setUser(userInfo);
          
          // Vérifier en arrière-plan que l'utilisateur existe toujours dans Supabase
          // (sans bloquer la restauration de la session)
          try {
            const { data } = await supabase
              .from('users')
              .select('*')
              .eq('id', userData.id)
              .single();
            
            if (data) {
              // Mettre à jour avec les données Supabase les plus récentes
              const updatedUser: User = {
                id: data.id,
                firstName: data.first_name || '',
                lastName: data.last_name || '',
                phoneNumber: data.phone_number,
                address: data.address || '',
                city: data.city || undefined,
              };
              setUser(updatedUser);
              localStorage.setItem('siggil_user', JSON.stringify(updatedUser));
            } else {
              // L'utilisateur n'existe plus dans Supabase - déconnexion
              console.warn('Utilisateur supprimé de la base de données');
              localStorage.removeItem('siggil_user');
              setUser(null);
            }
          } catch (networkError) {
            // Erreur réseau - garder la session locale (ne pas déconnecter)
            console.warn('Erreur réseau lors de la vérification de la session, session locale conservée:', networkError);
            // La session reste active avec les données locales
          }
        } catch (err) {
          console.error('Erreur lors du chargement de l\'utilisateur:', err);
          // Seulement déconnecter si les données sont corrompues
          localStorage.removeItem('siggil_user');
          setUser(null);
        }
      }
    };

    loadUser();
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
