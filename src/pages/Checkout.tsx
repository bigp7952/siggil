import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext.tsx';
import { usePayment } from '../contexts/PaymentContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/common/Header.tsx';
import AnimatedText from '../components/common/AnimatedText.tsx';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const { state: paymentState, paymentMethods, selectPaymentMethod, processPayment, clearError } = usePayment();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    city: '',
    deliveryInstructions: '',
  });

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

  const handlePayment = async () => {
    if (!paymentState.selectedMethod) {
      alert('Veuillez sélectionner un mode de paiement');
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    const success = await processPayment(cartState.total, formData.phoneNumber);
    
    if (success) {
      clearCart();
      navigate('/order-confirmation', { 
        state: { 
          orderId: paymentState.orderId,
          total: cartState.total 
        } 
      });
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Panier <span className="text-red-500">Vide</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Votre panier est vide. Ajoutez des produits pour continuer.
            </p>
            <button
              onClick={() => navigate('/produits')}
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <AnimatedText type="word" className="text-4xl font-bold text-white mb-8 text-center">
            Finaliser votre <span className="text-red-500">Commande</span>
          </AnimatedText>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de livraison */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-900 rounded-xl border border-gray-800 p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Informations de livraison</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ex: 77 123 45 67"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Adresse complète"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Ex: Dakar"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Instructions de livraison
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    placeholder="Instructions spéciales pour la livraison..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Résumé de la commande et paiement */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Résumé de la commande */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Résumé de la commande</h2>
                
                <div className="space-y-4 mb-6">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">Taille: {item.size}</p>
                        <p className="text-gray-400 text-sm">Quantité: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Sous-total</span>
                    <span>{formatCurrency(cartState.total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(cartState.total)}</span>
                  </div>
                </div>
              </div>

              {/* Méthodes de paiement */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Mode de paiement</h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <motion.button
                      key={method.id}
                      onClick={() => selectPaymentMethod(method)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                        paymentState.selectedMethod?.id === method.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h3 className="text-white font-semibold">{method.name}</h3>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {paymentState.error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-400 text-sm">{paymentState.error}</p>
                  </div>
                )}

                <motion.button
                  onClick={handlePayment}
                  disabled={paymentState.isLoading || !paymentState.selectedMethod}
                  className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {paymentState.isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  ) : (
                    `Payer ${formatCurrency(cartState.total)}`
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
