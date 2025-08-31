import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.tsx';
import Header from '../components/common/Header.tsx';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              MON <span className="text-red-500">PANIER</span>
            </h1>
            <p className="text-gray-400">
              Gérez vos articles et passez votre commande
            </p>
          </div>

          {/* Cart Content */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
                <p className="text-gray-400 mb-8">
                  Ajoutez des articles à votre panier pour commencer vos achats
                </p>
                <button
                  onClick={() => navigate('/produits')}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-medium text-lg">{item.name}</h3>
                        <p className="text-gray-400 text-sm">{item.size}</p>
                        <p className="text-red-500 font-semibold text-lg">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-white font-medium w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 text-sm mt-1"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold text-xl">Résumé de la commande</h3>
                    <button
                      onClick={clearCart}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      Vider le panier
                    </button>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-400">
                      <span>Sous-total ({state.itemCount} article{state.itemCount > 1 ? 's' : ''})</span>
                      <span>{formatCurrency(state.total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Livraison</span>
                      <span>Gratuite</span>
                    </div>
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex justify-between text-white font-bold text-xl">
                        <span>Total</span>
                        <span>{formatCurrency(state.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => navigate('/produits')}
                      className="bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                      Continuer les achats
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
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
