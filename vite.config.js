import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/create-preference')) {
        // Cargar variables de entorno locales al process.env
        const env = loadEnv('', process.cwd(), '');
        Object.assign(process.env, env);

        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          if (body) {
            try { req.body = JSON.parse(body); } catch (e) { req.body = {}; }
          }
          try {
            // Importación dinámica limpia
            const handler = await import('./api/create-preference.js?update=' + Date.now());
            
            // Mock de res.status() y res.json() para Vercel API
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };

            await handler.default(req, res);
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        });
        return;
      }
      next();
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
})
