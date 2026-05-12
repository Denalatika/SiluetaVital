import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Lock, Truck, CreditCard, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Datos, 2: Pago
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    apellidos: '',
    direccion: '',
    ciudad: '',
    estado: '',
    codigoPostal: '',
    telefono: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const productosResumen = cartItems.map(item => `${item.cantidad}x ${item.nombre}`).join(', ');

    // 1. Datos para Google Sheets (usando URLSearchParams para máxima compatibilidad)
    const params = new URLSearchParams();
    params.append('pedido_no', orderNumber);
    params.append('email', formData.email);
    params.append('nombre', formData.nombre);
    params.append('apellidos', formData.apellidos);
    params.append('direccion', formData.direccion);
    params.append('ciudad', formData.ciudad);
    params.append('estado', formData.estado);
    params.append('codigoPostal', formData.codigoPostal);
    params.append('telefono', formData.telefono);
    params.append('productos', productosResumen);
    params.append('total', totalPrice.toFixed(2));

    try {
      // 1. Enviar a Google Sheets vía GET (El método más infalible)
      const baseUrl = 'https://script.google.com/macros/s/AKfycbzm5jekCvV04lBkVyMRFhw6lvXH7bXHeAJ5m2A15ta_kC7y61focSgzDe8odvirT8Lo/exec';
      const params = new URLSearchParams({
        pedido_no: orderNumber,
        email: formData.email || '',
        nombre: formData.nombre || '',
        apellidos: formData.apellidos || '',
        direccion: formData.direccion || '',
        ciudad: formData.ciudad || '',
        estado: formData.estado || '',
        codigoPostal: formData.codigoPostal || '',
        telefono: formData.telefono || '',
        productos: productosResumen || '',
        total: totalPrice.toFixed(2)
      });

      // Usamos una etiqueta <img> como truco definitivo si fetch falla (esto siempre funciona)
      const beacon = new Image();
      beacon.src = `${baseUrl}?${params.toString()}`;

      // También intentamos fetch por si acaso
      await fetch(`${baseUrl}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      });

      console.log("Envío completado satisfactoriamente.");

      // 2. Preparar mensaje de WhatsApp como respaldo
      const mensajeWA = `Hola Silueta Vital! 👋%0A%0AHe realizado un nuevo pedido desde el sitio web:%0A%0A*Pedido:* ${orderNumber}%0A*Cliente:* ${formData.nombre} ${formData.apellidos}%0A*Productos:* ${productosResumen}%0A*Total:* $${totalPrice.toFixed(2)}%0A%0A_Los datos de envío ya han sido registrados en el sistema._`;
      
      const whatsappUrl = `https://wa.me/526311357128?text=${mensajeWA}`; 

      // 3. Finalizar
      clearCart();
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        navigate('/');
      }, 800); // Un poco más de tiempo para asegurar el envío
      
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un detalle al procesar tu pedido. Por favor, intenta de nuevo o contáctanos por WhatsApp.");
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
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="apellidos"
                    placeholder="Apellidos"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  required
                  type="text"
                  name="direccion"
                  placeholder="Dirección (Calle y número)"
                  className="w-full mt-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                  onChange={handleInputChange}
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <input
                    required
                    type="text"
                    name="ciudad"
                    placeholder="Ciudad"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    onChange={handleInputChange}
                  />
                  <input
                    required
                    type="text"
                    name="codigoPostal"
                    placeholder="C.P."
                    className="p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  required
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono"
                  className="w-full mt-4 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-accent"
                  onChange={handleInputChange}
                />
              </div>

              {/* Botón de acción */}
              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-dark text-white py-5 rounded-xl font-bold text-lg shadow-lg transition-all hover-lift flex items-center justify-center"
              >
                Finalizar Pedido <Lock size={18} className="ml-2" />
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center">
                <CheckCircle2 size={14} className="mr-1 text-green-500" /> 
                Tus datos están protegidos con encriptación de 256 bits
              </p>
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
            <div className="flex justify-between text-gray-600">
              <span className="flex items-center italic">Envío <Truck size={14} className="ml-1" /></span>
              <span className="text-green-600 font-medium italic">Gratis</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-gray-900 uppercase">Total</p>
                <p className="text-xs text-gray-400">Impuestos incluidos</p>
              </div>
              <p className="text-3xl font-extrabold text-primary">
                <span className="text-sm text-gray-400 font-normal mr-2">MXN</span>
                ${totalPrice.toFixed(2)}
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
