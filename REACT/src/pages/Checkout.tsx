import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext.tsx';
import { usePayment } from '../contexts/PaymentContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import Header from '../components/common/Header.tsx';
import LocationPicker from '../components/common/LocationPicker.tsx';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const { state: paymentState, processPayment } = usePayment();
  const { user, isLoading } = useAuth();
  const { showWarning, showError } = useToast();

  // Tous les hooks doivent être appelés avant tout return conditionnel
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    city: user?.city || '',
    deliveryInstructions: '',
  });

  const [deliveryLocation, setDeliveryLocation] = useState<{
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  } | null>(null);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      showError('Vous devez être connecté pour passer une commande');
      navigate('/auth', { state: { returnTo: '/checkout' } });
    }
  }, [user, isLoading, navigate, showError]);

  // Mettre à jour le formulaire quand l'utilisateur se connecte
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        city: user.city || '',
        deliveryInstructions: prev.deliveryInstructions,
      }));
    }
  }, [user]);

  // Afficher un message de chargement pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6c00] mx-auto mb-4"></div>
          <p className="text-gray-text">Chargement...</p>
        </div>
      </div>
    );
  }

  // Ne rien afficher si l'utilisateur n'est pas connecté (redirection en cours)
  if (!user) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    coordinates?: { lat: number; lng: number };
  }) => {
    setDeliveryLocation(location);
    setFormData(prev => ({
      ...prev,
      address: location.address,
      city: location.city
    }));
  };

  const handlePayment = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      showWarning('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    const finalAddress = deliveryLocation?.address || formData.address;
    const finalCity = deliveryLocation?.city || formData.city;
    
    if (!finalAddress || !finalCity) {
      showWarning('Veuillez sélectionner ou saisir une adresse de livraison');
      return;
    }

    const success = await processPayment(
      cartState.total, 
      formData.phoneNumber, 
      user, 
      cartState.items,
      finalAddress,
      finalCity
    );
    
    if (success) {
      clearCart();
      
      let attempts = 0;
      const maxAttempts = 50;
      
      const waitForOrderId = () => {
        if (paymentState.orderId) {
          navigate('/order-confirmation', { 
            state: { 
              orderId: paymentState.orderId,
              total: cartState.total,
              cartItems: cartState.items,
              userInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: finalAddress,
                city: finalCity
              },
              deliveryAddress: finalAddress,
              deliveryCity: finalCity,
              paymentMethod: paymentState.selectedMethod?.id
            } 
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(waitForOrderId, 100);
        } else {
          navigate('/order-confirmation', { 
            state: { 
              orderId: null,
              total: cartState.total,
              cartItems: cartState.items,
              userInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                address: finalAddress,
                city: finalCity
              },
              deliveryAddress: finalAddress,
              deliveryCity: finalCity,
              paymentMethod: paymentState.selectedMethod?.id,
              error: 'ID de commande non disponible'
            } 
          });
        }
      };
      
      waitForOrderId();
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="section-padding">
          <div className="container-custom max-w-2xl text-center">
            <h1 className="text-3xl font-display font-bold text-blacksoft mb-4">
              Panier <span className="gradient-text">Vide</span>
            </h1>
            <p className="text-gray-text mb-8 text-sm">
              Votre panier est vide. Ajoutez des produits pour continuer.
            </p>
            <Link
              to="/produits"
              className="btn-primary inline-block"
            >
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="section-padding">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
              Commande
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Finaliser votre <span className="gradient-text">Commande</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de livraison */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="card-modern p-4 md:p-6"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#ff6c00]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-lg md:text-xl font-display font-bold text-blacksoft">Informations de livraison</h2>
              </div>
              
              <div className="space-y-5">
                {/* Prénom et Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-blacksoft text-xs md:text-sm font-semibold mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-blacksoft text-xs md:text-sm font-semibold mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-blacksoft text-xs md:text-sm font-semibold mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-lg pl-12 pr-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm"
                      placeholder="77 123 45 67"
                      required
                    />
                  </div>
                </div>

                {/* Adresse de livraison */}
                <div>
                  <label className="block text-blacksoft text-xs md:text-sm font-semibold mb-3">
                    Adresse de livraison <span className="text-red-500">*</span>
                  </label>
                  
                  <LocationPicker 
                    onLocationSelect={handleLocationSelect}
                    initialAddress={formData.address}
                    initialCity={formData.city}
                  />
                  
                  {deliveryLocation && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-green-800 text-xs font-semibold mb-1">
                            Adresse sélectionnée
                          </p>
                          <p className="text-blacksoft text-sm font-medium">
                            {deliveryLocation.address}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {deliveryLocation.city}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-blue-700 text-xs flex items-start gap-2">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Utilisez la géolocalisation pour une adresse précise, ou saisissez manuellement si vous préférez.</span>
                    </p>
                  </div>
                </div>

                {/* Instructions de livraison */}
                <div>
                  <label className="block text-blacksoft text-xs md:text-sm font-semibold mb-2">
                    Instructions de livraison <span className="text-gray-400 text-xs font-normal">(optionnel)</span>
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-blacksoft focus:outline-none focus:ring-2 focus:ring-[#ff6c00]/20 focus:border-[#ff6c00] transition-all text-sm resize-none"
                    placeholder="Ex: Appeler avant de livrer, laisser à la porte, etc."
                  />
                </div>
              </div>
            </motion.div>

            {/* Résumé de la commande et paiement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Résumé de la commande */}
              <div className="card-modern p-6">
                <h2 className="text-xl font-display font-bold text-blacksoft mb-6">Résumé de la commande</h2>
                
                <div className="space-y-3 mb-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-offwhite rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-blacksoft font-medium text-sm">{item.name}</h3>
                        <p className="text-gray-text text-xs">Taille: {item.size}</p>
                        <p className="text-gray-text text-xs">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-blacksoft font-bold text-sm">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-text text-sm">
                    <span>Sous-total</span>
                    <span>{formatCurrency(cartState.total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-text text-sm">
                    <span>Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                  <div className="flex justify-between text-blacksoft font-bold text-lg border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(cartState.total)}</span>
                  </div>
                </div>
              </div>

              {/* Information de paiement */}
              <div className="card-modern p-6">
                <h2 className="text-xl font-display font-bold text-blacksoft mb-4">Mode de paiement</h2>
                
                <div className="p-4 rounded-lg border border-gray-200 bg-offwhite">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-[#ff6c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <h3 className="text-blacksoft font-semibold text-sm">Paiement à la livraison</h3>
                      <p className="text-gray-text text-xs">Payez à la réception de votre commande</p>
                    </div>
                  </div>
                </div>

                {paymentState.error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-xs">{paymentState.error}</p>
                  </div>
                )}

                <motion.button
                  onClick={handlePayment}
                  disabled={paymentState.isLoading}
                  className="w-full mt-6 btn-primary text-xs py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: paymentState.isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: paymentState.isLoading ? 1 : 0.98 }}
                >
                  {paymentState.isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  ) : (
                    `Confirmer la commande - ${formatCurrency(cartState.total)}`
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
