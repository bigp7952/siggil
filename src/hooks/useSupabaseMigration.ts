import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { migrationService } from '../services/supabaseService.ts';

interface MigrationState {
  isConnected: boolean;
  isMigrating: boolean;
  migrationProgress: number;
  error: string | null;
}

export const useSupabaseMigration = () => {
  const [state, setState] = useState<MigrationState>({
    isConnected: false,
    isMigrating: false,
    migrationProgress: 0,
    error: null
  });

  // Vérifier la connexion Supabase
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('products').select('count').limit(1);
      
      if (error) {
        console.warn('Supabase non configuré ou non connecté:', error.message);
        setState(prev => ({ ...prev, isConnected: false, error: error.message }));
        return false;
      }
      
      setState(prev => ({ ...prev, isConnected: true, error: null }));
      return true;
    } catch (error) {
      console.warn('Erreur de connexion Supabase:', error);
      setState(prev => ({ ...prev, isConnected: false, error: 'Erreur de connexion' }));
      return false;
    }
  };

  // Migrer les produits locaux vers Supabase
  const migrateProducts = async (localProducts: any[]) => {
    if (!state.isConnected) {
      throw new Error('Supabase non connecté');
    }

    setState(prev => ({ ...prev, isMigrating: true, migrationProgress: 0 }));

    try {
      const totalProducts = localProducts.length;
      let migratedCount = 0;

      for (const localProduct of localProducts) {
        try {
          const supabaseProduct = migrationService.convertLocalProductToSupabase(localProduct);
          await supabase.from('products').insert(supabaseProduct);
          migratedCount++;
          
          const progress = Math.round((migratedCount / totalProducts) * 100);
          setState(prev => ({ ...prev, migrationProgress: progress }));
        } catch (error) {
          console.warn(`Erreur lors de la migration du produit ${localProduct.name}:`, error);
          // Continue avec le produit suivant
        }
      }

      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        migrationProgress: 100 
      }));

      return migratedCount;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        error: 'Erreur lors de la migration' 
      }));
      throw error;
    }
  };

  // Migrer les commandes locales vers Supabase
  const migrateOrders = async (localOrders: any[]) => {
    if (!state.isConnected) {
      throw new Error('Supabase non connecté');
    }

    setState(prev => ({ ...prev, isMigrating: true, migrationProgress: 0 }));

    try {
      const totalOrders = localOrders.length;
      let migratedCount = 0;

      for (const localOrder of localOrders) {
        try {
          const supabaseOrder = migrationService.convertLocalOrderToSupabase(localOrder);
          await supabase.from('orders').insert(supabaseOrder);
          migratedCount++;
          
          const progress = Math.round((migratedCount / totalOrders) * 100);
          setState(prev => ({ ...prev, migrationProgress: progress }));
        } catch (error) {
          console.warn(`Erreur lors de la migration de la commande ${localOrder.id}:`, error);
          // Continue avec la commande suivante
        }
      }

      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        migrationProgress: 100 
      }));

      return migratedCount;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        error: 'Erreur lors de la migration des commandes' 
      }));
      throw error;
    }
  };

  // Migrer les demandes premium locales vers Supabase
  const migratePremiumRequests = async (localRequests: any[]) => {
    if (!state.isConnected) {
      throw new Error('Supabase non connecté');
    }

    setState(prev => ({ ...prev, isMigrating: true, migrationProgress: 0 }));

    try {
      const totalRequests = localRequests.length;
      let migratedCount = 0;

      for (const localRequest of localRequests) {
        try {
          const supabaseRequest = migrationService.convertLocalPremiumRequestToSupabase(localRequest);
          await supabase.from('premium_requests').insert(supabaseRequest);
          migratedCount++;
          
          const progress = Math.round((migratedCount / totalRequests) * 100);
          setState(prev => ({ ...prev, migrationProgress: progress }));
        } catch (error) {
          console.warn(`Erreur lors de la migration de la demande premium ${localRequest.id}:`, error);
          // Continue avec la demande suivante
        }
      }

      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        migrationProgress: 100 
      }));

      return migratedCount;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        error: 'Erreur lors de la migration des demandes premium' 
      }));
      throw error;
    }
  };

  // Migration complète
  const migrateAll = async (localData: {
    products: any[];
    orders: any[];
    premiumRequests: any[];
  }) => {
    if (!state.isConnected) {
      throw new Error('Supabase non connecté');
    }

    setState(prev => ({ ...prev, isMigrating: true, migrationProgress: 0 }));

    try {
      let totalProgress = 0;
      const totalSteps = 3;

      // Migrer les produits
      if (localData.products.length > 0) {
        await migrateProducts(localData.products);
        totalProgress += 33;
        setState(prev => ({ ...prev, migrationProgress: totalProgress }));
      }

      // Migrer les commandes
      if (localData.orders.length > 0) {
        await migrateOrders(localData.orders);
        totalProgress += 33;
        setState(prev => ({ ...prev, migrationProgress: totalProgress }));
      }

      // Migrer les demandes premium
      if (localData.premiumRequests.length > 0) {
        await migratePremiumRequests(localData.premiumRequests);
        totalProgress += 34;
        setState(prev => ({ ...prev, migrationProgress: totalProgress }));
      }

      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        migrationProgress: 100 
      }));

      return {
        products: localData.products.length,
        orders: localData.orders.length,
        premiumRequests: localData.premiumRequests.length
      };
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isMigrating: false, 
        error: 'Erreur lors de la migration complète' 
      }));
      throw error;
    }
  };

  // Réinitialiser l'état
  const resetMigration = () => {
    setState({
      isConnected: false,
      isMigrating: false,
      migrationProgress: 0,
      error: null
    });
  };

  // Vérifier la connexion au montage
  useEffect(() => {
    checkConnection();
  }, []);

  return {
    ...state,
    checkConnection,
    migrateProducts,
    migrateOrders,
    migratePremiumRequests,
    migrateAll,
    resetMigration
  };
};
