import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';

// Pages
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import NosotrosPage from './pages/NosotrosPage';
import BeneficiosPage from './pages/BeneficiosPage';
import ContactoPage from './pages/ContactoPage';
import CheckoutPage from './pages/CheckoutPage';

import { ProductProvider } from './context/ProductContext';
import AdminPage from './pages/AdminPage';

function App() {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';

  return (
    <ProductProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col font-sans bg-background text-gray-800">
          <ScrollToTop />
          {!isCheckout && <Navbar />}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/beneficios" element={<BeneficiosPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/producto/:id" element={<div className="p-20 text-center text-xl">Página de producto en construcción...</div>} />
            </Routes>
          </main>
          <CartDrawer />
          {!isCheckout && <Footer />}
        </div>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
