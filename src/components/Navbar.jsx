import React, { useState } from 'react';
import { Menu, X, Leaf, ShoppingCart, Settings } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createSupportWhatsAppLink } from '../utils/whatsapp';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const WHATSAPP_LINK = createSupportWhatsAppLink();
  const LOGO_TEXT = "Silueta Vital"; // Reemplaza con tu logo o texto

  const closeMenu = () => setIsOpen(false);

  // Clases comunes para los NavLinks
  const navLinkClass = ({ isActive }) =>
    `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md ${isActive ? 'text-primary font-semibold bg-gray-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'}`;

  return (
    <>
      {/* Banner Superior Promocional */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-accent text-white text-center py-2 px-4 text-xs sm:text-sm font-bold tracking-wide shadow-sm relative z-[51] flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center bg-white/20 rounded-full px-2 py-0.5 text-[10px] uppercase font-extrabold animate-pulse">
          Descuento
        </span>
        <span>🔥 Envío GRATIS en todas tus compras</span>
      </div>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <Link to="/" onClick={closeMenu} className="relative h-20 w-72 flex items-center">
              <img
                src="/images/logo_icon_transparent.png"
                alt="Icono Silueta Vital"
                className="h-20 w-auto mr-2"
              />
              <img
                src="/images/logo_3d.png"
                alt="Silueta Vital"
                className="h-28 w-auto absolute -top-4 left-20 z-10 drop-shadow-2xl max-w-none"
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/" className={navLinkClass}>Inicio</NavLink>
            <NavLink to="/productos" className={navLinkClass}>Productos</NavLink>
            <NavLink to="/beneficios" className={navLinkClass}>Beneficios</NavLink>
            <NavLink to="/nosotros" className={navLinkClass}>Nosotros</NavLink>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors flex items-center"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-md transition-colors font-medium hover-lift">
              Soporte
            </a>
          </div>

          {/* Mobile Menu & Cart Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={closeMenu} className={mobileNavLinkClass}>Inicio</NavLink>
            <NavLink to="/productos" onClick={closeMenu} className={mobileNavLinkClass}>Productos</NavLink>
            <NavLink to="/beneficios" onClick={closeMenu} className={mobileNavLinkClass}>Beneficios</NavLink>
            <NavLink to="/nosotros" onClick={closeMenu} className={mobileNavLinkClass}>Nosotros</NavLink>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" onClick={closeMenu} className="block px-3 py-2 text-primary font-medium hover:bg-gray-50 rounded-md">
              Soporte
            </a>
          </div>
        </div>
      )}
    </nav>
  </>
  );
};

export default Navbar;
