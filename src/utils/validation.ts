// Validation des numéros de téléphone sénégalais
export const validatePhoneNumber = (phone: string): boolean => {
  // Format sénégalais: 77, 76, 78, 70, 75, 33, 30, 34, 35, 36, 37, 38, 39
  const senegalPhoneRegex = /^(77|76|78|70|75|33|30|34|35|36|37|38|39)\d{7}$/;
  return senegalPhoneRegex.test(phone.replace(/\s/g, ''));
};

// Validation des emails
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation des prix
export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000000; // Max 1 million XOF
};

// Validation des tailles de fichiers
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Validation des types de fichiers images
export const validateImageType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};

// Validation des champs requis
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validation de la longueur minimale
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.trim().length >= minLength;
};

// Validation de la longueur maximale
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.trim().length <= maxLength;
};

// Validation des adresses
export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 10; // Adresse minimale de 10 caractères
};

// Validation des noms
export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Validation des codes postaux sénégalais
export const validatePostalCode = (code: string): boolean => {
  const postalCodeRegex = /^\d{5}$/;
  return postalCodeRegex.test(code);
};

// Validation des quantités
export const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= 1000;
};

// Validation des descriptions de produits
export const validateDescription = (description: string): boolean => {
  return description.trim().length >= 10 && description.trim().length <= 1000;
};

// Validation des catégories
export const validateCategory = (category: string): boolean => {
  const validCategories = [
    'T-shirts', 'Vestes', 'Pantalons', 'Chaussures', 'Accessoires'
  ];
  return validCategories.includes(category);
};

// Validation des tailles
export const validateSize = (size: string): boolean => {
  const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  return validSizes.includes(size);
};

// Validation des couleurs
export const validateColor = (color: string): boolean => {
  const validColors = [
    'noir', 'blanc', 'rouge', 'bleu', 'vert', 'jaune', 
    'orange', 'rose', 'violet', 'gris', 'marron', 'beige'
  ];
  return validColors.includes(color.toLowerCase());
};

// Validation complète d'un produit
export const validateProduct = (product: {
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  sizes: string[];
  colors: string[];
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateRequired(product.name)) {
    errors.push('Le nom du produit est requis');
  }

  if (!validateMinLength(product.name, 3)) {
    errors.push('Le nom du produit doit contenir au moins 3 caractères');
  }

  if (!validateCategory(product.category)) {
    errors.push('Catégorie invalide');
  }

  if (!validatePrice(product.price)) {
    errors.push('Prix invalide');
  }

  if (!validateQuantity(product.stock)) {
    errors.push('Stock invalide');
  }

  if (product.description && !validateDescription(product.description)) {
    errors.push('Description invalide (10-1000 caractères)');
  }

  if (product.sizes.length === 0) {
    errors.push('Au moins une taille doit être sélectionnée');
  }

  product.sizes.forEach(size => {
    if (!validateSize(size)) {
      errors.push(`Taille invalide: ${size}`);
    }
  });

  product.colors.forEach(color => {
    if (!validateColor(color)) {
      errors.push(`Couleur invalide: ${color}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation complète d'une commande
export const validateOrder = (order: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateName(order.firstName)) {
    errors.push('Prénom invalide');
  }

  if (!validateName(order.lastName)) {
    errors.push('Nom invalide');
  }

  if (!validatePhoneNumber(order.phoneNumber)) {
    errors.push('Numéro de téléphone invalide');
  }

  if (!validateAddress(order.address)) {
    errors.push('Adresse invalide (minimum 10 caractères)');
  }

  if (!validateRequired(order.city)) {
    errors.push('Ville requise');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
