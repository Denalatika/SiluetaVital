// COMENTARIO: Cambia este número por tu WhatsApp (incluyendo código de país, ej. 521 para México)
const PHONE_NUMBER = "526311357128";

export const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  // Formato: PED-20260417-ABCD
  return `PED-${year}${month}${day}-${randomStr}`;
};

export const createSupportWhatsAppLink = (message = "Hola, necesito información o soporte con mi pedido.") => {
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodedMessage}`;
};
