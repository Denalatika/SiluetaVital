import os
from PIL import Image
import sys

def optimize_images(source_dir, target_dir, max_width=1200, quality=80):
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    files = [f for f in os.listdir(source_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif'))]
    
    if not files:
        print(f"No se encontraron imágenes en {source_dir}")
        return

    print(f"Optimizando {len(files)} imágenes...")
    
    for filename in files:
        source_path = os.path.join(source_dir, filename)
        name, _ = os.path.splitext(filename)
        target_path = os.path.join(target_dir, f"{name}.webp")
        
        try:
            with Image.open(source_path) as img:
                # Convertir a RGB (necesario para JPEG/WebP)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                # Redimensionar si es muy grande
                if img.width > max_width:
                    ratio = max_width / float(img.width)
                    new_height = int(float(img.height) * float(ratio))
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Guardar como WebP
                img.save(target_path, "WEBP", quality=quality)
                
                old_size = os.path.getsize(source_path) / 1024
                new_size = os.path.getsize(target_path) / 1024
                
                print(f"✅ {filename} -> {name}.webp")
                print(f"   Tamaño: {old_size:.1f}KB -> {new_size:.1f}KB (Reducción: {100 - (new_size/old_size*100):.1f}%)")
                
                # Opcional: Eliminar original
                # os.remove(source_path)
                
        except Exception as e:
            print(f"❌ Error procesando {filename}: {str(e)}")

if __name__ == "__main__":
    base_path = "/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos"
    source = os.path.join(base_path, "public/upload")
    target = os.path.join(base_path, "public/images")
    
    optimize_images(source, target)
