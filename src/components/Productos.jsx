import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Productos = () => {
  const { products } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  // Función para cerrar el modal
  const closeModal = () => setSelectedProduct(null);

  return (
    <section id="productos" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-serif">Catálogo de Productos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce nuestra selección completa de productos naturales diseñados para integrarse fácilmente a tu rutina de bienestar.
          </p>
        </div>

        {/* ESTRUCTURA: Grid responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.filter(p => !p.hidden).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl flex flex-col overflow-hidden shadow-sm border border-gray-100 hover-lift hover:shadow-xl transition-all group cursor-pointer"
              onClick={() => setSelectedProduct(prod)}
            >
              {/* IMAGEN DEL PRODUCTO */}
              <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-4">
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary font-bold px-3 py-1 rounded-md shadow-sm text-xs">
                  {prod.categoria || '100% Natural'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-primary mb-2 leading-tight font-serif">{prod.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{prod.descripcionCorta}</p>

                {/* Texto de beneficio tipo Badge */}
                {prod.beneficios && prod.beneficios.length > 0 && (
                  <div className="bg-primary/5 p-3 rounded-md mb-6 mt-auto">
                    <p className="text-primary text-xs font-semibold leading-relaxed">
                      {prod.beneficios[0]}
                    </p>
                  </div>
                )}

                <div className="mt-auto">
                  {/* PRECIO ESTRATÉGICO */}
                  <div className="flex items-end justify-between mb-4">
                    <div className="flex flex-col">
                      {prod.descuento && (
                        <span className="text-gray-500 text-xs line-through mb-0.5">
                          ${prod.precio}
                        </span>
                      )}
                      <span className="text-2xl font-black text-primary leading-none">
                        ${prod.descuento ? (prod.precio * (1 - prod.descuento / 100)).toFixed(0) : (prod.precio || '0')}
                      </span>
                    </div>
                    {prod.descuento && (
                      <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        -{prod.descuento}%
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const price = Number(prod.precio) || 0;
                      const discount = Number(prod.descuento) || 0;
                      const finalPrice = discount > 0
                        ? Math.round(price * (1 - discount / 100))
                        : price;
                      addToCart({ ...prod, precio: finalPrice });
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white text-center py-3 rounded-md font-bold transition-all text-sm hover-lift"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL / VENTANA EMERGENTE */}
      {/* COMENTARIO: Aquí puedes modificar el diseño y contenido del modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Overlay de fondo */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          {/* Contenido del modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all">
            {/* Botón de cierre superior (para móviles) */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full text-gray-600 transition-colors md:hidden"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen del producto en el modal */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
              <img
                src={selectedProduct.imagenDetalle || selectedProduct.imagen}
                alt={selectedProduct.nombre}
                className="w-full h-full object-contain max-h-[40vh] md:max-h-[80vh]"
              />
            </div>

            {/* Información del producto en el modal */}
            {/* COMENTARIO: Aquí puedes editar cómo se muestran los textos y descripciones dentro del modal */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md mb-3">
                    {selectedProduct.categoria}
                  </span>
                  <h3 className="text-2xl font-bold text-primary leading-tight">
                    {selectedProduct.nombre}
                  </h3>
                </div>
                {/* Botón de cierre escritorio */}
                <button
                  onClick={closeModal}
                  className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="prose prose-sm text-gray-600 mb-6 flex-grow">
                <p className="text-base mb-4">{selectedProduct.descripcionLarga}</p>

                {selectedProduct.beneficios && selectedProduct.beneficios.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Beneficios Principales</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedProduct.beneficios.map((ben, index) => (
                        <li key={index}>{ben}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProduct.modoDeUso && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">Modo de Uso</h4>
                    <p>{selectedProduct.modoDeUso}</p>
                  </div>
                )}
              </div>

              {/* Advertencia y Botón CTA */}
              <div className="mt-auto pt-6 border-t border-gray-100">
                {selectedProduct.advertencia && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg">
                    <p className="text-xs text-yellow-800">
                      <strong>Aviso importante:</strong> {selectedProduct.advertencia}
                    </p>
                  </div>
                )}

                {/* PRECIO EN MODAL - SECCIÓN DE CIERRE DE VENTA */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 font-medium mb-1">Inversión en tu salud:</span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-primary">
                        ${selectedProduct.descuento ? (selectedProduct.precio * (1 - selectedProduct.descuento / 100)).toFixed(0) : (selectedProduct.precio || '0')}
                      </span>
                      {selectedProduct.descuento && (
                        <span className="text-xl text-gray-400 line-through font-medium">
                          ${selectedProduct.precio}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedProduct.descuento && (
                    <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl border border-accent/20">
                      <span className="text-sm font-bold">Ahorras {selectedProduct.descuento}% hoy</span>
                    </div>
                  )}
                </div>

                {/* Botón CTA - Agregar al carrito */}
                <button
                  onClick={() => {
                    const price = Number(selectedProduct.precio) || 0;
                    const discount = Number(selectedProduct.descuento) || 0;
                    const finalPrice = discount > 0
                      ? Math.round(price * (1 - discount / 100))
                      : price;
                    addToCart({ ...selectedProduct, precio: finalPrice });
                    closeModal();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark text-white py-4 px-8 rounded-md font-black text-lg shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all hover-lift"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Productos;
