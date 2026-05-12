import os
import glob
from rembg import remove
from PIL import Image
import numpy as np

input_dir = 'public/Imagenes Nuevas'
output_dir = 'public/Imagenes Recortadas'

os.makedirs(output_dir, exist_ok=True)

image_files = glob.glob(os.path.join(input_dir, '*.jpg')) + glob.glob(os.path.join(input_dir, '*.png'))

print(f"Encontradas {len(image_files)} imágenes para procesar.")

for i, img_path in enumerate(image_files):
    try:
        filename = os.path.basename(img_path)
        output_path = os.path.join(output_dir, filename.replace('.jpg', '.png')) # Guardar como PNG por la transparencia
        
        if os.path.exists(output_path):
            print(f"[{i+1}/{len(image_files)}] Saltando {filename}, ya existe.")
            continue
            
        print(f"[{i+1}/{len(image_files)}] Procesando {filename}...")
        
        # Cargar imagen
        input_image = Image.open(img_path)
        
        # Eliminar fondo (esto aísla el producto principal)
        output_image = remove(input_image)
        
        # Convertir a numpy array para encontrar los límites
        img_array = np.array(output_image)
        
        # El canal alpha es el último (índice 3)
        alpha = img_array[:, :, 3]
        
        # Encontrar pixeles no transparentes
        non_empty_columns = np.where(alpha.max(axis=0) > 0)[0]
        non_empty_rows = np.where(alpha.max(axis=1) > 0)[0]
        
        if len(non_empty_columns) > 0 and len(non_empty_rows) > 0:
            left, right = non_empty_columns[0], non_empty_columns[-1]
            top, bottom = non_empty_rows[0], non_empty_rows[-1]
            
            # Recortar la imagen con fondo transparente al bounding box del producto
            # Añadir un pequeño margen de 20px
            margin = 20
            left = max(0, left - margin)
            top = max(0, top - margin)
            right = min(output_image.width, right + margin)
            bottom = min(output_image.height, bottom + margin)
            
            cropped_image = output_image.crop((left, top, right, bottom))
            cropped_image.save(output_path, "PNG")
        else:
            print(f"No se encontró producto principal en {filename}. Guardando original transparente.")
            output_image.save(output_path, "PNG")
            
    except Exception as e:
        print(f"Error procesando {img_path}: {e}")

print("Proceso completado!")
