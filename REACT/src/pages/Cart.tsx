import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';
import Header from '../components/common/Header.tsx';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const { showError } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = () => {
    if (!user) {
      showError('Vous devez être connecté pour passer une commande');
      navigate('/auth', { state: { returnTo: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="py-6 sm:py-12 px-4">
        <div className="container-custom max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-male-red mb-2 block">
              Panier
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 sm:mb-3">
              MON <span className="gradient-text">PANIER</span>
            </h1>
            <p className="text-gray-text text-xs sm:text-sm mb-4">
              Gérez vos articles et passez votre commande
            </p>
            <Link
              to="/suivi-commande"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#ff6c00] hover:text-[#e55a00] font-medium transition-colors"
            >
              <Package className="w-4 h-4" />
              Suivre une commande
            </Link>
          </div>

          {/* Cart Content */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
            {state.items.length === 0 ? (
              <div className="text-center py-8 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-offwhite rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-blacksoft mb-2 sm:mb-3">Votre panier est vide</h2>
                <p className="text-gray-text mb-6 sm:mb-8 text-xs sm:text-sm">
                  Ajoutez des articles à votre panier pour commencer vos achats
                </p>
                <Link
                  to="/produits"
                  className="btn-primary text-xs inline-block"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Cart Items */}
                <div className="space-y-3 sm:space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="bg-offwhite rounded-lg p-3 sm:p-4 border border-gray-200">
                      {/* Version Desktop */}
                      <div className="hidden md:flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-blacksoft font-semibold text-base truncate mb-1">{item.name}</h3>
                          <p className="text-gray-text text-xs mb-1">Taille: {item.size}</p>
                          <p className="text-male-red font-bold text-base">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-blacksoft hover:bg-gray-light transition-colors"
                          >
                            -
                          </button>
                          <span className="text-blacksoft font-medium w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-blacksoft hover:bg-gray-light transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-blacksoft font-bold text-lg">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-text hover:text-male-red text-xs mt-1 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>

                      {/* Version Mobile */}
                      <div className="md:hidden space-y-2.5 sm:space-y-3">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-blacksoft font-semibold text-xs sm:text-sm leading-tight mb-0.5 sm:mb-1">{item.name}</h3>
                            <p className="text-gray-text text-[10px] sm:text-xs mb-0.5 sm:mb-1">Taille: {item.size}</p>
                            <p className="text-male-red font-bold text-xs sm:text-sm">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-blacksoft hover:bg-gray-light transition-colors text-sm sm:text-base"
                            >
                              -
                            </button>
                            <span className="text-blacksoft font-medium w-8 sm:w-10 text-center text-xs sm:text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-blacksoft hover:bg-gray-light transition-colors text-sm sm:text-base"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-blacksoft font-bold text-sm sm:text-base mb-0.5 sm:mb-1">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-male-red hover:text-male-red/80 text-[10px] sm:text-xs transition-colors"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-blacksoft font-display font-bold text-base sm:text-lg">Résumé de la commande</h3>
                    <button
                      onClick={clearCart}
                      className="text-gray-text hover:text-male-red text-[10px] sm:text-xs transition-colors"
                    >
                      Vider le panier
                    </button>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <div className="flex justify-between text-gray-text text-xs sm:text-sm">
                      <span>Sous-total ({state.itemCount} article{state.itemCount > 1 ? 's' : ''})</span>
                      <span>{formatCurrency(state.total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-text text-xs sm:text-sm">
                      <span>Livraison</span>
                      <span className="text-[#ffba00] font-medium">Gratuite</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 sm:pt-3">
                      <div className="flex justify-between text-blacksoft font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>{formatCurrency(state.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                    <Link
                      to="/produits"
                      className="btn-secondary text-xs py-2.5 text-center"
                    >
                      Continuer les achats
                    </Link>
                    <button
                      onClick={handleCheckout}
                      className="btn-primary text-xs py-2.5"
                    >
                      Passer la commande
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
