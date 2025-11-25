import { supabase, supabaseAdmin } from '../lib/supabase.ts';

// Utiliser le bucket products pour les preuves premium (ou créer un bucket dédié)
const PREMIUM_BUCKET = 'products'; // À changer si vous créez un bucket dédié 'premium-proofs'

/**
 * Upload une image de preuve vers Supabase Storage
 */
export const uploadPremiumProof = async (
  file: File,
  requestId: string,
  proofIndex: number
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${requestId}/proof-${proofIndex}.${fileExt}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(PREMIUM_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Erreur upload image:', error);
      return null;
    }

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(PREMIUM_BUCKET)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    return null;
  }
};

/**
 * Vérifie si un code premium est valide et non utilisé
 */
/**
 * Normalise un numéro de téléphone (supprime tous les caractères non numériques)
 */
const normalizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const verifyPremiumCode = async (code: string, phone: string): Promise<{
  valid: boolean;
  requestId?: string;
  message?: string;
}> => {
  try {
    // Normaliser le code et le téléphone
    const normalizedCode = code.toUpperCase().trim().replace(/\s+/g, '');
    const normalizedPhone = normalizePhone(phone);
    
    console.log('Vérification du code:', { code: normalizedCode, phone: normalizedPhone });

    // D'abord, chercher toutes les demandes approuvées pour ce numéro
    const { data: userRequests, error: userError } = await supabase
      .from('premium_requests')
      .select('id, phone, code_used, status, code')
      .eq('phone', normalizedPhone)
      .eq('status', 'approved')
      .not('code', 'is', null);

    if (userError) {
      console.error('Erreur Supabase lors de la recherche par téléphone:', userError);
    }

    console.log('Demandes approuvées pour ce numéro:', userRequests?.length || 0);
    if (userRequests && userRequests.length > 0) {
      console.log('Codes trouvés pour ce numéro:', userRequests.map(r => ({ 
        code: r.code, 
        codeNormalized: (r.code || '').toUpperCase().trim().replace(/\s+/g, ''),
        used: r.code_used,
        phone: r.phone 
      })));
    }

    // Rechercher le code exact (normalisé) - essayer plusieurs variantes
    let allCodes = null;
    
    // Essai 1: Recherche exacte
    const { data: exactMatch, error: exactError } = await supabase
      .from('premium_requests')
      .select('id, phone, code_used, status, code')
      .eq('code', normalizedCode)
      .maybeSingle();

    if (exactError) {
      console.error('Erreur Supabase lors de la recherche exacte:', exactError);
    } else if (exactMatch) {
      allCodes = exactMatch;
      console.log('Code trouvé via recherche exacte');
    }

    // Essai 2: Si pas trouvé, chercher tous les codes approuvés et comparer manuellement
    if (!allCodes) {
      const { data: allApproved, error: allError } = await supabase
        .from('premium_requests')
        .select('id, phone, code_used, status, code')
        .eq('status', 'approved')
        .not('code', 'is', null);

      if (allError) {
        console.error('Erreur lors de la recherche de tous les codes:', allError);
      } else if (allApproved) {
        console.log(`Recherche dans ${allApproved.length} codes approuvés...`);
        
        // Normaliser et comparer les codes
        const matching = allApproved.find(req => {
          if (!req.code) return false;
          const reqCode = req.code.toUpperCase().trim().replace(/\s+/g, '');
          const match = reqCode === normalizedCode;
          if (match) {
            console.log('Code correspondant trouvé:', { 
              original: req.code, 
              normalized: reqCode,
              searchCode: normalizedCode 
            });
          }
          return match;
        });
        
        if (matching) {
          allCodes = matching;
          console.log('Code trouvé via recherche flexible:', matching.code);
        } else {
          // Afficher les premiers codes pour débogage
          console.log('Codes disponibles (premiers 5):', allApproved.slice(0, 5).map(r => ({
            code: r.code,
            normalized: (r.code || '').toUpperCase().trim().replace(/\s+/g, ''),
            phone: r.phone
          })));
        }
      }
    }

    if (!allCodes) {
      console.log('Aucun code trouvé avec:', normalizedCode);
      // Afficher tous les codes disponibles pour débogage
      if (userRequests && userRequests.length > 0) {
        console.log('Codes disponibles pour ce numéro:', userRequests.map(r => r.code));
      }
      return {
        valid: false,
        message: 'Code invalide ou non trouvé',
      };
    }

    // Vérifier que le numéro de téléphone correspond
    const storedPhone = normalizePhone(allCodes.phone || '');
    console.log('Comparaison téléphone:', { 
      stored: storedPhone, 
      provided: normalizedPhone,
      match: storedPhone === normalizedPhone
    });
    
    if (storedPhone !== normalizedPhone) {
      console.log('Numéro de téléphone ne correspond pas:', { 
        stored: storedPhone, 
        provided: normalizedPhone,
        storedRaw: allCodes.phone
      });
      return {
        valid: false,
        message: 'Le code ne correspond pas à votre numéro de téléphone',
      };
    }

    if (allCodes.status !== 'approved') {
      console.log('Statut de la demande:', allCodes.status);
      return {
        valid: false,
        message: 'Cette demande n\'a pas été approuvée',
      };
    }

    if (allCodes.code_used) {
      return {
        valid: false,
        message: 'Ce code a déjà été utilisé',
      };
    }

    console.log('Code validé avec succès:', { id: allCodes.id, code: allCodes.code });
    return {
      valid: true,
      requestId: allCodes.id,
    };
  } catch (error) {
    console.error('Erreur lors de la vérification du code:', error);
    return {
      valid: false,
      message: 'Erreur lors de la vérification',
    };
  }
};

/**
 * Marque un code premium comme utilisé
 */
export const markPremiumCodeAsUsed = async (requestId: string): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin
      .from('premium_requests')
      .update({
        code_used: true,
        code_used_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      console.error('Erreur lors de la mise à jour du code:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur:', error);
    return false;
  }
};

/**
 * Vérifie si l'utilisateur a un accès premium actif
 */
export const checkPremiumAccess = async (phone: string): Promise<{
  hasAccess: boolean;
  requestId?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('premium_requests')
      .select('id, code_used, status')
      .eq('phone', phone)
      .eq('status', 'approved')
      .eq('code_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Erreur lors de la vérification:', error);
      return { hasAccess: false };
    }

    if (!data) {
      return { hasAccess: false };
    }

    return {
      hasAccess: true,
      requestId: data.id,
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'accès:', error);
    return { hasAccess: false };
  }
};

