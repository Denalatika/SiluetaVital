import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Respuesta al preflight de CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Obtener los productos desde la base de datos
  if (req.method === 'GET') {
    try {
      const products = await kv.get('productos');
      // Si no existe la clave todavía, devolvemos un arreglo vacío para que el frontend
      // use sus datos predeterminados.
      return res.status(200).json({ products: products || [] });
    } catch (error) {
      console.error('Error al obtener productos de KV:', error);
      return res.status(500).json({ error: 'Error al obtener productos de la base de datos' });
    }
  }

  // POST: Guardar todos los productos en la base de datos (con autorización)
  if (req.method === 'POST') {
    try {
      // Validar la contraseña de administrador enviada en los headers
      const authHeader = req.headers.authorization;
      const expectedPassword = process.env.ADMIN_PASSWORD || 'siluetavitaladmin';
      
      if (!authHeader || authHeader !== `Bearer ${expectedPassword}`) {
        return res.status(401).json({ error: 'No autorizado' });
      }

      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Los datos deben contener un arreglo de productos' });
      }

      // Guardar el arreglo completo en KV
      await kv.set('productos', products);
      return res.status(200).json({ success: true, message: 'Productos guardados exitosamente en la base de datos' });
    } catch (error) {
      console.error('Error al guardar productos en KV:', error);
      return res.status(500).json({ error: 'Error al guardar los productos en la base de datos' });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}
