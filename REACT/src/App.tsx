import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Premium from './pages/Premium.tsx';
import Contact from './pages/Contact.tsx';
import Help from './pages/Help.tsx';
import Delivery from './pages/Delivery.tsx';
import Returns from './pages/Returns.tsx';
import SizeGuide from './pages/SizeGuide.tsx';
import Auth from './pages/Auth.tsx';
import Cart from './pages/Cart.tsx';
import Checkout from './pages/Checkout.tsx';
import OrderConfirmation from './pages/OrderConfirmation.tsx';
import UserOrders from './pages/UserOrders.tsx';
import OrderTracking from './pages/OrderTracking.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminCategories from './pages/AdminCategories.tsx';
import PageTransition from './components/common/PageTransition.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AdminProvider } from './contexts/AdminContext.tsx';
import { ProductProvider } from './contexts/ProductContext.tsx';
import { PaymentProvider } from './contexts/PaymentContext.tsx';
import { FavoritesProvider } from './contexts/FavoritesContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { ConfirmProvider } from './contexts/ConfirmContext.tsx';

// Wrapper pour forcer le re-render lors du changement de route
function RouteWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  useEffect(() => {
    // Forcer le scroll en haut lors du changement de route
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);
  
  return <>{children}</>;
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location}>
        {/* Routes publiques */}
        <Route path="/" element={<RouteWrapper><Home /></RouteWrapper>} />
        <Route path="/produits" element={<RouteWrapper><Products /></RouteWrapper>} />
        <Route path="/produit/:id" element={<RouteWrapper><ProductDetail /></RouteWrapper>} />
        <Route path="/premium" element={<RouteWrapper><Premium /></RouteWrapper>} />
        <Route path="/contact" element={<RouteWrapper><Contact /></RouteWrapper>} />
        <Route path="/aide" element={<RouteWrapper><Help /></RouteWrapper>} />
        <Route path="/livraison" element={<RouteWrapper><Delivery /></RouteWrapper>} />
        <Route path="/retours" element={<RouteWrapper><Returns /></RouteWrapper>} />
        <Route path="/taille-guide" element={<RouteWrapper><SizeGuide /></RouteWrapper>} />
        <Route path="/auth" element={<RouteWrapper><Auth /></RouteWrapper>} />
        <Route path="/panier" element={<RouteWrapper><Cart /></RouteWrapper>} />
        <Route path="/checkout" element={<RouteWrapper><Checkout /></RouteWrapper>} />
        <Route path="/order-confirmation" element={<RouteWrapper><OrderConfirmation /></RouteWrapper>} />
        <Route path="/mes-commandes" element={<RouteWrapper><UserOrders /></RouteWrapper>} />
        <Route path="/suivi-commande" element={<RouteWrapper><OrderTracking /></RouteWrapper>} />
        
        {/* Routes admin */}
        <Route path="/admin/login" element={<RouteWrapper><AdminLogin /></RouteWrapper>} />
        <Route path="/admin/dashboard" element={<RouteWrapper><AdminDashboard /></RouteWrapper>} />
        <Route path="/admin/products" element={<RouteWrapper><AdminDashboard /></RouteWrapper>} />
        <Route path="/admin/premium-products" element={<RouteWrapper><AdminDashboard /></RouteWrapper>} />
        <Route path="/admin/orders" element={<RouteWrapper><AdminDashboard /></RouteWrapper>} />
        <Route path="/admin/premium" element={<RouteWrapper><AdminDashboard /></RouteWrapper>} />
        <Route path="/admin/categories" element={<RouteWrapper><AdminCategories /></RouteWrapper>} />
      </Routes>
    </PageTransition>
  );
}

function App() {
  return (
    <ConfirmProvider>
      <ToastProvider>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <PaymentProvider>
              <CartProvider>
                <FavoritesProvider>
                <Router>
                  <div className="App">
                    <AppRoutes />
                  </div>
                </Router>
                </FavoritesProvider>
              </CartProvider>
            </PaymentProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </ToastProvider>
    </ConfirmProvider>
  );
}

export default App;
