import Redis from 'ioredis';

// Inicializamos el cliente de Redis de forma perezosa para evitar conexiones innecesarias
let redis;
try {
  if (process.env.KV_REDIS_URL) {
    redis = new Redis(process.env.KV_REDIS_URL);
  } else {
    console.warn("Falta la variable de entorno KV_REDIS_URL");
  }
} catch (err) {
  console.error("Error al inicializar cliente de Redis:", err);
}

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
    // Modo de depuración para ver las claves de entorno disponibles (sin exponer valores secretos)
    if (req.query.debug === 'true') {
      const keys = Object.keys(process.env).filter(key => 
        key.includes('KV') || key.includes('REDIS') || key.includes('STORAGE') || key.includes('URL')
      );
      return res.status(200).json({ env_keys: keys });
    }

    try {
      if (!redis) {
        return res.status(500).json({ error: 'Base de datos no configurada' });
      }
      
      const data = await redis.get('productos');
      // Si no existe la clave todavía, devolvemos un arreglo vacío
      const products = data ? JSON.parse(data) : [];
      return res.status(200).json({ products });
    } catch (error) {
      console.error('Error al obtener productos de Redis:', error);
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

      if (!redis) {
        return res.status(500).json({ error: 'Base de datos no configurada' });
      }

      // Guardar el arreglo completo en Redis como JSON
      await redis.set('productos', JSON.stringify(products));
      return res.status(200).json({ success: true, message: 'Productos guardados exitosamente en la base de datos' });
    } catch (error) {
      console.error('Error al guardar productos en Redis:', error);
      return res.status(500).json({ error: 'Error al guardar los productos en la base de datos' });
    }
  }

  return res.status(405).json({ message: 'Método no permitido' });
}
