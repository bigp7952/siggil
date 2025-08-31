import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminLogin from './pages/AdminLogin.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import PageTransition from './components/common/PageTransition.tsx';
import { CartProvider } from './contexts/CartContext.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AdminProvider } from './contexts/AdminContext.tsx';
import { ProductProvider } from './contexts/ProductContext.tsx';
import { PaymentProvider } from './contexts/PaymentContext.tsx';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ProductProvider>
          <PaymentProvider>
            <CartProvider>
              <Router>
                <div className="App">
                  <PageTransition>
                    <Routes>
                      {/* Routes publiques */}
                      <Route path="/" element={<Home />} />
                      <Route path="/produits" element={<Products />} />
                      <Route path="/produit/:id" element={<ProductDetail />} />
                      <Route path="/premium" element={<Premium />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/aide" element={<Help />} />
                      <Route path="/livraison" element={<Delivery />} />
                      <Route path="/retours" element={<Returns />} />
                      <Route path="/taille-guide" element={<SizeGuide />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/panier" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation" element={<OrderConfirmation />} />
                      
                      {/* Routes admin */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Routes>
                  </PageTransition>
                </div>
              </Router>
            </CartProvider>
          </PaymentProvider>
        </ProductProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
