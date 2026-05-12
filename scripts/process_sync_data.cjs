
const fs = require('fs');
const path = require('path');

const inputPath = '/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos/clean_data.json';
const imagesDir = '/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos/public/images';
const outputJsPath = '/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos/src/data/productos.js';

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

try {
  const data = fs.readFileSync(inputPath, 'utf8');
  const products = JSON.parse(data);

  const processedProducts = products.map(prod => {
    let updatedProd = { ...prod };

    // Función para procesar base64
    const saveBase64 = (base64String, suffix) => {
      if (base64String && base64String.startsWith('data:image')) {
        const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const buffer = Buffer.from(matches[2], 'base64');
          // Limpiar nombre para el archivo
          const cleanName = prod.nombre.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
          const fileName = `uploaded_${cleanName}_${prod.id}_${suffix}.${extension}`;
          const filePath = path.join(imagesDir, fileName);
          
          fs.writeFileSync(filePath, buffer);
          console.log(`Guardada imagen: ${fileName}`);
          return `/images/${fileName}`;
        }
      }
      return base64String;
    };

    updatedProd.imagen = saveBase64(prod.imagen, 'main');
    updatedProd.imagenDetalle = saveBase64(prod.imagenDetalle, 'detail');

    return updatedProd;
  });

  // Generar el contenido del archivo productos.js
  const jsContent = `export const productosData = ${JSON.stringify(processedProducts, null, 2)};`;
  fs.writeFileSync(outputJsPath, jsContent);
  console.log('¡Archivo productos.js actualizado con éxito!');

} catch (err) {
  console.error('Error procesando los datos:', err);
  process.exit(1);
}
