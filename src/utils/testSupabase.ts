import { supabase } from '../lib/supabase.ts';

export const testSupabaseConnection = async () => {
  console.log('🔍 Test de connexion Supabase...');
  
  try {
    // Test 1: Vérifier la connexion de base
    console.log('1. Test de connexion de base...');
    const { error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    
    // Test 2: Vérifier la structure de la table users
    console.log('2. Test de la table users...');
    const { data: tableData, error: tableError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erreur table users:', tableError);
      return false;
    }
    
    console.log('✅ Table users accessible');
    console.log('📊 Structure de la table:', tableData);
    
    // Test 3: Test d'insertion (avec rollback)
    console.log('3. Test d\'insertion...');
    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      phone_number: '+221 77 999 99 99',
      address: 'Test Address'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.error('❌ Erreur d\'insertion:', insertError);
      console.error('🔍 Code d\'erreur:', insertError.code);
      console.error('🔍 Message:', insertError.message);
      console.error('🔍 Détails:', insertError.details);
      return false;
    }
    
    console.log('✅ Insertion réussie:', insertData);
    
    // Test 4: Supprimer l'utilisateur de test
    if (insertData && insertData[0]) {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.warn('⚠️ Erreur lors de la suppression du test:', deleteError);
      } else {
        console.log('✅ Utilisateur de test supprimé');
      }
    }
    
    console.log('🎉 Tous les tests Supabase sont réussis !');
    return true;
    
  } catch (err) {
    console.error('❌ Erreur générale:', err);
    return false;
  }
};

export const testUserRegistration = async (userData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}) => {
  console.log('🔍 Test d\'inscription utilisateur...');
  console.log('📝 Données:', userData);
  
  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', userData.phoneNumber)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Erreur lors de la vérification:', checkError);
      return { success: false, error: checkError.message };
    }
    
    if (existingUser) {
      console.log('⚠️ Utilisateur existe déjà');
      return { success: false, error: 'Un compte existe déjà avec ce numéro de téléphone' };
    }
    
    // Insérer le nouvel utilisateur
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
      console.error('❌ Erreur d\'insertion:', error);
      console.error('🔍 Code:', error.code);
      console.error('🔍 Message:', error.message);
      console.error('🔍 Détails:', error.details);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Inscription réussie:', data);
    return { success: true, data };
    
  } catch (err) {
    console.error('❌ Erreur générale:', err);
    return { success: false, error: 'Erreur lors de l\'inscription' };
  }
};
