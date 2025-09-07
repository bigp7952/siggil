// Service de validation de paiement pour SIGGIL

export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PaymentData {
  amount: number;
  phoneNumber: string;
  paymentMethod: string;
  userInfo: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
  };
}

// Validation des numéros de téléphone sénégalais
export const validateSenegalesePhone = (phoneNumber: string): boolean => {
  // Formats acceptés : +221 77 123 45 67, 221771234567, 771234567
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Vérifier si c'est un numéro sénégalais
  if (cleanNumber.startsWith('221')) {
    const localNumber = cleanNumber.substring(3);
    return /^(7[0-9]|3[0-9]|8[0-9])[0-9]{7}$/.test(localNumber);
  }
  
  // Numéro local sans indicatif
  return /^(7[0-9]|3[0-9]|8[0-9])[0-9]{7}$/.test(cleanNumber);
};

// Validation des montants
export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000; // Max 1 million XOF
};

// Validation des informations utilisateur
export const validateUserInfo = (userInfo: PaymentData['userInfo']): string[] => {
  const errors: string[] = [];
  
  if (!userInfo.firstName || userInfo.firstName.trim().length < 2) {
    errors.push('Le prénom doit contenir au moins 2 caractères');
  }
  
  if (!userInfo.lastName || userInfo.lastName.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }
  
  if (!userInfo.address || userInfo.address.trim().length < 10) {
    errors.push('L\'adresse doit contenir au moins 10 caractères');
  }
  
  if (!userInfo.city || userInfo.city.trim().length < 2) {
    errors.push('La ville est requise');
  }
  
  return errors;
};

// Validation des méthodes de paiement
export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['wave', 'orange', 'free'];
  return validMethods.includes(method);
};

// Validation complète du paiement
export const validatePayment = (paymentData: PaymentData): PaymentValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validation du montant
  if (!validateAmount(paymentData.amount)) {
    errors.push('Montant invalide. Le montant doit être entre 1 et 1 000 000 XOF');
  }
  
  // Validation du numéro de téléphone
  if (!validateSenegalesePhone(paymentData.phoneNumber)) {
    errors.push('Numéro de téléphone invalide. Veuillez entrer un numéro sénégalais valide');
  }
  
  // Validation de la méthode de paiement
  if (!validatePaymentMethod(paymentData.paymentMethod)) {
    errors.push('Méthode de paiement invalide');
  }
  
  // Validation des informations utilisateur
  const userInfoErrors = validateUserInfo(paymentData.userInfo);
  errors.push(...userInfoErrors);
  
  // Avertissements
  if (paymentData.amount > 500000) {
    warnings.push('Montant élevé détecté. Vérifiez bien les informations avant de confirmer');
  }
  
  if (paymentData.phoneNumber.length < 10) {
    warnings.push('Numéro de téléphone court détecté. Vérifiez le format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Simulation de traitement de paiement
export const processPaymentSimulation = async (
  paymentData: PaymentData,
  onProgress?: (status: string) => void
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  
  try {
    // Étape 1: Validation
    onProgress?.('Validation des données...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const validation = validatePayment(paymentData);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', ')
      };
    }
    
    // Étape 2: Vérification du solde
    onProgress?.('Vérification du solde...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulation de vérification de solde
    const hasSufficientBalance = Math.random() > 0.1; // 90% de chance d'avoir un solde suffisant
    if (!hasSufficientBalance) {
      return {
        success: false,
        error: 'Solde insuffisant sur votre compte'
      };
    }
    
    // Étape 3: Traitement du paiement
    onProgress?.('Traitement du paiement...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulation de succès/échec
    const isSuccess = Math.random() > 0.05; // 95% de chance de succès
    
    if (isSuccess) {
      const transactionId = `SIGGIL-${Date.now().toString().slice(-8)}`;
      
      // Étape 4: Confirmation
      onProgress?.('Confirmation de la transaction...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        transactionId
      };
    } else {
      return {
        success: false,
        error: 'Échec du traitement. Veuillez réessayer'
      };
    }
    
  } catch (error) {
    return {
      success: false,
      error: 'Erreur lors du traitement du paiement'
    };
  }
};

// Formatage du numéro de téléphone
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  if (cleanNumber.startsWith('221')) {
    const localNumber = cleanNumber.substring(3);
    return `+221 ${localNumber.slice(0, 2)} ${localNumber.slice(2, 5)} ${localNumber.slice(5, 7)} ${localNumber.slice(7)}`;
  }
  
  return `+221 ${cleanNumber.slice(0, 2)} ${cleanNumber.slice(2, 5)} ${cleanNumber.slice(5, 7)} ${cleanNumber.slice(7)}`;
};

// Génération de reçu
export const generateReceipt = (paymentData: PaymentData, transactionId: string) => {
  return {
    transactionId,
    amount: paymentData.amount,
    paymentMethod: paymentData.paymentMethod,
    phoneNumber: formatPhoneNumber(paymentData.phoneNumber),
    userInfo: paymentData.userInfo,
    timestamp: new Date().toISOString(),
    status: 'completed'
  };
};





