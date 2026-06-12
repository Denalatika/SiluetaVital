import json
import base64
import re
import os

def save_base64_image(base64_str, filename):
    try:
        # Extract the base64 part
        match = re.match(r'data:image/(.*?);base64,(.*)', base64_str)
        if match:
            ext = match.group(1)
            # handle jpeg -> jpg if desired, but let's just keep the original extension or force webp if needed
            # actually, standardizing to the extracted ext is fine
            if ext == 'jpeg': ext = 'jpg'
            
            b64_data = match.group(2)
            filepath = os.path.join('public', 'images', f"{filename}.{ext}")
            
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(b64_data))
                
            return f"/images/{filename}.{ext}"
    except Exception as e:
        print(f"Failed to save image {filename}: {e}")
    return base64_str

def process_products(json_path):
    with open(json_path, 'r') as f:
        products = json.load(f)
        
    for p in products:
        safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', p.get('nombre', 'unnamed')).lower()
        pid = p.get('id', 'temp')
        
        # Process main image
        if 'imagen' in p and p['imagen'].startswith('data:image'):
            new_path = save_base64_image(p['imagen'], f"synced_{safe_name}_{pid}_main")
            p['imagen'] = new_path
            
        # Process detail image
        if 'imagenDetalle' in p and p['imagenDetalle'].startswith('data:image'):
            new_path = save_base64_image(p['imagenDetalle'], f"synced_{safe_name}_{pid}_detail")
            p['imagenDetalle'] = new_path
            
    # Write to src/data/productos.js
    output_js = f"export const productosData = {json.dumps(products, indent=2, ensure_ascii=False)};\n"
    
    with open('src/data/productos.js', 'w', encoding='utf-8') as f:
        f.write(output_js)
        
    print(f"Successfully processed {len(products)} products and updated src/data/productos.js")

if __name__ == "__main__":
    process_products('datos_extracted.json')
