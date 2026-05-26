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
    
    // Mapeamos los items del carrito al formato que pide Mercado Pago
    const mpItems = items.map(item => ({
      id: item.id.toString(),
      title: item.nombre,
      unit_price: Number(item.precio),
      quantity: Number(item.cantidad),
      currency_id: 'MXN'
    }));

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
