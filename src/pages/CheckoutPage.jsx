import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Lock, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar Mercado Pago
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-00000000-0000-0000-0000-000000000000', { locale: 'es-MX' });

const CheckoutPage = () => {
  const { cartItems, totalPrice, isWholesale, wholesaleDiscount, shippingCost, finalTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('checkout_form_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error al cargar datos guardados:", e);
      }
    }
    return {
      email: '',
      nombre: '',
      apellidos: '',
      direccion: '',
      ciudad: '',
      estado: '',
      codigoPostal: '',
      telefono: ''
    };
  });

  const [rememberInfo, setRememberInfo] = useState(() => {
    const saved = localStorage.getItem('checkout_remember_info');
    return saved !== 'false'; // Activo por defecto
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    if (rememberInfo) {
      localStorage.setItem('checkout_form_data', JSON.stringify(formData));
      localStorage.setItem('checkout_remember_info', 'true');
    } else {
      localStorage.removeItem('checkout_form_data');
      localStorage.setItem('checkout_remember_info', 'false');
    }
  }, [formData, rememberInfo]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <Link to="/productos" className="bg-accent text-white px-8 py-3 rounded-lg font-bold">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = `PED-${new Date().getTime().toString().slice(-6)}`;

    const payload = {
      orderNumber,
      items: cartItems.map(item => ({
        id: item.id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    try {
      // Enviar datos a la API de Mercado Pago local / Vercel
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al contactar con el servidor de pagos');
      }

      const data = await response.json();

      if (data && data.id) {
        // Enviar datos al Webhook de Make.com de forma asíncrona si está configurado (resiliente)
        const makeWebhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
        if (makeWebhookUrl) {
          const productosResumen = cartItems.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');
          fetch(makeWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pedido_no: orderNumber,
              preferencia_id: data.id,
              estado_pago: 'Pendiente',
              fecha: new Date().toLocaleString('es-MX', {
                timeZone: 'America/Mexico_City',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              }),
              nombre_completo: `${formData.nombre} ${formData.apellidos}`,
              email: formData.email,
              nombre: formData.nombre,
              apellidos: formData.apellidos,
              direccion: formData.direccion,
              ciudad: formData.ciudad,
              estado: formData.estado,
              codigoPostal: formData.codigoPostal,
              telefono: formData.telefono,
              productos: cartItems.map(item => {
                const basePrice = Number(item.precio);
                const finalUnitPrice = isWholesale ? Number((basePrice * 0.9).toFixed(2)) : basePrice;
                return {
                  id: item.id,
                  nombre: item.nombre,
                  cantidad: item.cantidad,
                  precio: finalUnitPrice
                };
              }),
              productos_resumen: productosResumen,
              total: finalTotal
            })
          }).catch(err => console.error("Error al notificar a Make.com:", err));
        }

        setPreferenceId(data.id);
        setStep(2); // Pasamos al paso 2 para mostrar el botón de Mercado Pago seguro
      } else {
        throw new Error('No se recibió el Preference ID de Mercado Pago');
      }
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un problema al generar el enlace de pago. Por favor, intenta de nuevo o contáctanos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row relative">
      {/* Overlay de Carga */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold text-primary animate-pulse">Procesando tu pedido...</p>
          <p className="text-sm text-gray-500">Estamos guardando tu información</p>
        </div>
      )}

      {/* Lado Izquierdo: Formulario (Fondo Blanco) */}
      <div className="flex-1 bg-white p-6 md:p-12 lg:p-20 order-2 lg:order-1">
        <div className="max-w-xl mx-auto">
          {/* Logo y Breadcrumbs */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-accent mb-6">
              <ChevronLeft size={16} className="mr-1" /> Volver a la tienda
            </Link>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-gray-400 font-bold">
              <span className={step >= 1 ? 'text-accent' : ''}>Información</span>
              <span>/</span>
              <span className={step >= 2 ? 'text-accent' : ''}>Pago</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Contacto */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 text-sm">1</span>
                  Información de contacto
                </h3>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Correo electrónico"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Envío */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mr-3 text-sm">2</span>
                  Dirección de envío
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  required
                  type="text"
                  name="direccion"
                  placeholder="Dirección (Calle y número)"
                  className="w-full mt-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                  value={formData.direccion}
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <input
                    required
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    value={formData.ciudad}
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    value={formData.estado}
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="codigoPostal"
                    placeholder="C.P."
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  required
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  className="w-full mt-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
                
                {/* Recordar información para futuras compras */}
                <div className="mt-6 flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-200 transition-all hover:bg-gray-100/50">
                  <label className="relative flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rememberInfo}
                      onChange={(e) => setRememberInfo(e.target.checked)}
                    />
                    <div className="w-5 h-5 bg-white border-2 border-gray-300 rounded-md transition-all peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                  <span className="text-sm text-gray-600 font-medium">
                    Recordar mi información de contacto y envío para futuras compras
                  </span>
                </div>
              </div>

              {/* Botón de acción */}
              {step === 1 ? (
                <>
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent-dark text-white py-5 rounded-xl font-bold text-lg shadow-lg transition-all hover-lift flex items-center justify-center"
                  >
                    Ir a Pagar <Lock size={18} className="ml-2" />
                  </button>
                  
                  <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                    <CheckCircle2 size={14} className="mr-1 text-green-500" /> 
                    Tus datos están protegidos con encriptación de 256 bits
                  </p>
                </>
              ) : (
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 text-center text-primary">Completa tu pago seguro</h3>
                  {preferenceId && (
                    <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'security_safety' } }} />
                  )}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-sm text-gray-500 hover:text-accent font-medium mt-6 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Modificar datos de envío
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Lado Derecho: Resumen del Pedido (Fondo Gris) */}
      <div className="lg:w-[450px] bg-gray-50 p-6 md:p-12 lg:p-20 order-1 lg:order-2 lg:sticky lg:top-0 lg:h-screen">
        <div className="max-w-md mx-auto h-full flex flex-col">
          <h3 className="text-xl font-bold mb-8 flex items-center text-gray-800">
            Resumen del pedido
          </h3>
          
          <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain p-2" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {item.cantidad}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{item.nombre}</h4>
                  <p className="text-xs text-gray-500">{item.categoria}</p>
                </div>
                <div className="text-sm font-bold text-gray-900">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>
            
            {isWholesale && (
              <div className="flex justify-between text-accent font-bold">
                <span>Descuento de Mayoreo (10%)</span>
                <span>-${wholesaleDiscount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center">Envío <Truck size={14} className="ml-1" /></span>
              <span className={isWholesale ? "font-bold text-primary" : "font-bold text-gray-900"}>
                {isWholesale ? "¡Gratis!" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            
            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-gray-900 uppercase">Total</p>
                <p className="text-xs text-gray-400">Impuestos y envío incluidos</p>
              </div>
              <p className="text-3xl font-extrabold text-primary">
                <span className="text-sm text-gray-400 font-normal mr-2">MXN</span>
                ${finalTotal.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-4 opacity-50">
             <CreditCard size={24} />
             <div className="h-6 w-px bg-gray-300"></div>
             <span className="text-xs font-bold uppercase tracking-widest self-center">Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
