import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalImagesDir = path.join(__dirname, 'public', 'Imagenes Nuevas');
const dataFile = path.join(__dirname, 'src', 'data', 'productos.js');

async function processImages() {
  const files = fs.readdirSync(originalImagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  let namesMap = {};
  
  console.log(`Iniciando OCR en ${files.length} imágenes... esto tomará unos minutos.`);
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    console.log(`[${i+1}/${files.length}] Leyendo ${file}...`);
    
    try {
      const { data: { text } } = await Tesseract.recognize(
        path.join(originalImagesDir, file),
        'spa', // español
        { logger: m => {} } // silenciar logs
      );
      
      // Limpiar texto: tomar las primeras líneas relevantes
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      
      let productName = "Producto (Pendiente)";
      if (lines.length > 0) {
        // Asumimos que el título del producto está en las primeras líneas
        // Evitamos palabras comunes o muy largas. Tomaremos la línea 1 y 2 si son cortas.
        let candidate = lines[0];
        if (candidate.length < 5 && lines.length > 1) {
            candidate += " " + lines[1];
        }
        // Limitar longitud
        candidate = candidate.substring(0, 40).replace(/[^a-zA-Z0-9 ÁÉÍÓÚáéíóúÑñ-]/g, '').trim();
        if (candidate) productName = candidate;
      }
      
      namesMap[file] = productName;
      console.log(` -> Nombre detectado: ${productName}`);
      
    } catch (e) {
      console.log(`Error en OCR para ${file}: ${e.message}`);
    }
  }
  
  // Actualizar productos.js
  let dataContent = fs.readFileSync(dataFile, 'utf-8');
  
  for (const file of files) {
    const newName = namesMap[file];
    if (newName) {
      // Encontrar el bloque del producto buscando la imagen
      // La imagen referenciada en productos.js ahora dice /Imagenes Recortadas/file
      const regex = new RegExp(`nombre:\\s*".*?\\(Pendiente Revisión\\)",\\s*imagen:\\s*"/Imagenes Recortadas/${file.replace(/\./g, '\\.')}"`, 'g');
      dataContent = dataContent.replace(regex, `nombre: "${newName}",\n    imagen: "/Imagenes Recortadas/${file}"`);
    }
  }
  
  fs.writeFileSync(dataFile, dataContent);
  console.log("¡productos.js ha sido actualizado con los nombres detectados!");
}

processImages();
