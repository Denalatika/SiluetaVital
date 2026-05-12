// COMENTARIO: Cambia este número por tu WhatsApp (incluyendo código de país, ej. 521 para México)
const PHONE_NUMBER = "526311357128"; 

// COMENTARIO: Si prefieres usar estrictamente el enlace acortado que pasaste, 
// puedes intentar agregarlo a continuación, pero ten en cuenta que wa.link acortado
// no siempre recibe dinámicamente el texto generado.
const WA_LINK_BASE = "https://wa.link/vm7xa4";

export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Formato: PED-20260417-ABCD
  return `PED-${year}${month}${day}-${randomStr}`;
};

export const createWhatsAppLink = (cartItems, orderNumber) => {
  let message = `Hola, quiero realizar el siguiente pedido:\n\n`;
  message += `Número de pedido: ${orderNumber}\n\n`;
  message += `Productos:\n`;
  
  let totalItems = 0;
  cartItems.forEach((item) => {
    message += `- ${item.nombre} x${item.cantidad}\n`;
    totalItems += item.cantidad;
  });
  
  message += `\nTotal de artículos: ${totalItems}\n\n`;
  message += `Quedo pendiente de información. Gracias.`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // COMENTARIO: Para usar el formato universal y dinámico de WhatsApp
  return `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodedMessage}`;
  
  // Si deseas intentar forzar el wa.link original, descomenta la línea de abajo y comenta la de arriba
  // return `${WA_LINK_BASE}?text=${encodedMessage}`;
};
