import { MercadoPagoConfig, Preference } from 'mercadopago';

// Inicializa el cliente de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.VITE_MP_ACCESS_TOKEN || 'APP_USR-TEST-TU-ACCESS-TOKEN' 
});

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Respuesta al preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { items, orderNumber } = req.body;
    
    // Calcular cantidad total para aplicar promoción de mayoreo en el servidor
    const totalQty = items.reduce((acc, item) => acc + Number(item.cantidad), 0);
    const isWholesale = totalQty >= 5;
    
    // Mapeamos los items del carrito al formato que pide Mercado Pago aplicando el 10% si califica
    const mpItems = items.map(item => {
      const basePrice = Number(item.precio);
      const unitPrice = isWholesale ? Number((basePrice * 0.9).toFixed(2)) : basePrice;
      return {
        id: item.id.toString(),
        title: item.nombre,
        unit_price: unitPrice,
        quantity: Number(item.cantidad),
        currency_id: 'MXN'
      };
    });

    // Agregamos el costo de envío (gratis si califica para mayoreo)
    const shippingPrice = isWholesale ? 0 : 180;
    mpItems.push({
      id: 'envio',
      title: 'Costo de envío',
      unit_price: shippingPrice,
      quantity: 1,
      currency_id: 'MXN'
    });

    const preference = new Preference(client);
    
    const body = {
      items: mpItems,
      back_urls: {
        "success": `${req.headers.origin}/?status=success`,
        "failure": `${req.headers.origin}/checkout?status=failure`,
        "pending": `${req.headers.origin}/checkout?status=pending`
      },
      auto_return: "approved",
      external_reference: orderNumber,
    };

    const response = await preference.create({ body });
    
    // Devolvemos el ID de la preferencia para usar en el frontend
    return res.status(200).json({ id: response.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    return res.status(500).json({ error: 'Failed to create preference' });
  }
}
