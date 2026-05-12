import cv2
import numpy as np
import os
import glob

input_dir = 'public/Imagenes Nuevas'
output_dir = 'public/Imagenes Recortadas'

os.makedirs(output_dir, exist_ok=True)

image_files = glob.glob(os.path.join(input_dir, '*.jpg')) + glob.glob(os.path.join(input_dir, '*.png'))

print(f"Procesando {len(image_files)} imágenes usando OpenCV...")

def crop_product(img_path, out_path):
    img = cv2.imread(img_path)
    if img is None:
        print(f"Error leyendo {img_path}")
        return False
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Suponemos fondo blanco o claro en el catálogo.
    # Aplicar un threshold adaptativo o un Canny edge detection.
    # Canny es más robusto a diferentes fondos.
    edges = cv2.Canny(gray, 50, 150)
    
    # Dilatamos los bordes para conectar partes del mismo objeto
    kernel = np.ones((25,25), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=2)
    
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        print(f"No se encontraron contornos en {img_path}")
        cv2.imwrite(out_path, img) # guardar original
        return True
        
    # Filtrar contornos muy pequeños (ruido)
    valid_contours = [c for c in contours if cv2.contourArea(c) > 5000]
    
    if not valid_contours:
        valid_contours = contours # fallback
        
    # Asumimos que el producto es el contorno más grande
    largest_contour = max(valid_contours, key=cv2.contourArea)
    
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Añadir un pequeño margen de 30px
    margin = 30
    x = max(0, x - margin)
    y = max(0, y - margin)
    w = min(img.shape[1] - x, w + margin*2)
    h = min(img.shape[0] - y, h + margin*2)
    
    # Recortar
    cropped = img[y:y+h, x:x+w]
    
    cv2.imwrite(out_path, cropped)
    return True

for i, file in enumerate(image_files):
    filename = os.path.basename(file)
    out_path = os.path.join(output_dir, filename)
    
    if os.path.exists(out_path):
        continue
        
    print(f"[{i+1}/{len(image_files)}] Recortando {filename}...")
    crop_product(file, out_path)
    
print("Proceso completado.")
