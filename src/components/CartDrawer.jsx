import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateOrderNumber } from '../utils/whatsapp';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice, isWholesale, wholesaleDiscount, shippingCost, finalTotal } = useCart();
  const [orderNumber, setOrderNumber] = useState('');
  const navigate = useNavigate();

  // Generar un número de pedido cuando se abre el carrito o cambian los items
  useEffect(() => {
    if (isCartOpen && !orderNumber && cartItems.length > 0) {
      setOrderNumber(generateOrderNumber());
    }
    if (cartItems.length === 0) {
      setOrderNumber(''); // Reseteamos si se vacía
    }
  }, [isCartOpen, cartItems.length, orderNumber]);

  const goToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleDownloadPDF = () => {
    if (cartItems.length === 0) return;
    const doc = new jsPDF();
    const currentOrderNumber = orderNumber || generateOrderNumber();
    const primaryColor = [46, 125, 50];
    const secondaryColor = [31, 80, 112];
    const lightBg = [213, 235, 219];
    const textColor = [40, 40, 40];
    doc.setFillColor(...lightBg);
    doc.ellipse(-20, 100, 60, 200, 'F');
    doc.setFillColor(235, 245, 240);
    doc.ellipse(-10, 250, 80, 100, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(...secondaryColor);
    doc.text('PEDIDO', 14, 35);
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text('Silueta Vital', 14, 45);
    doc.setFont("helvetica", "normal");
    doc.text('Productos naturales y bienestar integral', 14, 50);
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const timeStr = today.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    const rightColLabelsX = 130;
    const rightColValuesX = 196;
    doc.text('Nº DE PEDIDO', rightColLabelsX, 45);
    doc.text('FECHA', rightColLabelsX, 52);
    doc.text('HORA', rightColLabelsX, 59);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(currentOrderNumber, rightColValuesX, 45, { align: "right" });
    doc.text(dateStr, rightColValuesX, 52, { align: "right" });
    doc.text(timeStr, rightColValuesX, 59, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text('DATOS DEL CLIENTE', 14, 75);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text('Los datos de envío y facturación se', 14, 82);
    doc.text('coordinarán a través de WhatsApp.', 14, 87);
    const tableColumn = ["CANT.", "DESCRIPCIÓN", "CATEGORÍA"];
    const tableRows = [];
    cartItems.forEach(item => {
      tableRows.push([item.cantidad.toString(), item.nombre, item.categoria || '-']);
    });
    autoTable(doc, {
      startY: 100,
      head: [tableColumn],
      body: tableRows,
      theme: 'plain',
      styles: { font: "helvetica", fontSize: 10, textColor: textColor, cellPadding: { top: 6, bottom: 6, left: 2, right: 2 } },
      headStyles: { textColor: secondaryColor, fontStyle: 'bold', lineWidth: { bottom: 0.5 }, lineColor: [200, 200, 200], fillColor: 255 },
      bodyStyles: { lineWidth: { bottom: 0.1 }, lineColor: [230, 230, 230] },
      columnStyles: { 0: { cellWidth: 20, halign: 'center' }, 1: { cellWidth: 100 }, 2: { cellWidth: 'auto', halign: 'right' } }
    });
    const finalY = doc.lastAutoTable.finalY || 120;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(130, finalY + 10, 196, finalY + 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text('TOTAL ARTÍCULOS', rightColLabelsX, finalY + 20);
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text(totalItems.toString(), rightColValuesX, finalY + 20, { align: "right" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text('CONDICIONES', 14, 250);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text('El pago y entrega se acordarán', 14, 256);
    doc.text('directamente con nuestro asesor.', 14, 261);
    doc.setFont("times", "italic");
    doc.setFontSize(24);
    doc.setTextColor(30, 30, 30);
    doc.text('Silueta Vital', 150, 260, { align: "center", angle: -5 });
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text('¡Gracias por confiar en nosotros!', 105, 285, { align: "center" });
    doc.save(`Pedido_${currentOrderNumber}.pdf`);
  };

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  const itemsNeeded = Math.max(0, 5 - totalItems);
  const progressPercent = Math.min(100, (totalItems / 5) * 100);

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
        
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-white text-gray-800">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Mi Pedido</h2>
            {totalItems > 0 && (
              <span className="bg-primary/10 text-primary-dark text-xs font-bold px-2.5 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium text-gray-500">Tu carrito está vacío</p>
              <button onClick={() => setIsCartOpen(false)} className="mt-6 px-6 py-2 bg-primary/10 text-primary-dark font-medium rounded-full">
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Barra de progreso de Mayoreo */}
              <div className="bg-white p-4 rounded-2xl border border-accent/20 shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-primary uppercase tracking-wider">Descuento de Mayoreo</span>
                  <span className="font-mono bg-accent/10 text-accent px-2 py-0.5 rounded font-extrabold">{totalItems} / 5 piezas</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden p-0.5 border border-gray-200/50">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${isWholesale ? 'bg-gradient-to-r from-primary to-accent animate-pulse' : 'bg-primary'}`} 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {isWholesale ? (
                    <span className="text-primary font-bold flex items-center gap-1">
                      🎉 ¡Felicidades! Se aplicó 10% de descuento y Envío GRATIS.
                    </span>
                  ) : (
                    <span>
                      Agrega <strong className="text-accent font-extrabold">{itemsNeeded} {itemsNeeded === 1 ? 'pieza más' : 'piezas más'}</strong> para activar el precio de mayoreo y envío gratis.
                    </span>
                  )}
                </p>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm relative group">
                  <div className="w-20 h-20 flex-shrink-0 bg-secondary-light rounded-xl overflow-hidden flex items-center justify-center p-2 text-gray-800">
                    <img src={item.imagen} alt={item.nombre} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col flex-1 text-gray-800">
                    <h4 className="font-bold text-sm mb-1 line-clamp-2">{item.nombre}</h4>
                    {item.categoria && <p className="text-xs text-gray-500 mb-3">{item.categoria}</p>}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:text-primary"><Minus className="w-4 h-4" /></button>
                        <span className="text-sm font-bold w-4 text-center">{item.cantidad}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-md hover:text-primary"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-xl space-y-3.5">
            <div className="flex justify-between items-center text-sm text-gray-800">
              <span className="text-gray-500 font-medium">Número de Pedido</span>
              <span className="font-mono font-bold bg-gray-100 px-2.5 py-1 rounded text-gray-600">{orderNumber}</span>
            </div>
            
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
              </div>
              
              {isWholesale && (
                <div className="flex justify-between text-accent font-bold">
                  <span>Descuento de Mayoreo (10%)</span>
                  <span>-${wholesaleDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500">Envío</span>
                <span className={isWholesale ? "text-primary font-bold" : "font-bold text-gray-800"}>
                  {isWholesale ? "¡Gratis!" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-gray-800">
              <span className="text-gray-600 font-extrabold text-base">Total Neto</span>
              <span className="text-2xl font-black text-primary">${finalTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={goToCheckout} className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover-lift transition-all">
                Pagar Ahora
              </button>
              <button onClick={handleDownloadPDF} className="w-full text-center py-2 text-xs text-gray-400 hover:text-gray-600">
                Descargar lista (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
