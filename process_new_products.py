import json
import base64
import re
import os
import time

def process_base64_image(b64_str, filename_prefix):
    match = re.match(r'data:image/(jpeg|png|webp|jpg);base64,(.*)', b64_str)
    if not match:
        return None
    ext = match.group(1)
    if ext == 'jpeg':
        ext = 'jpg'
    b64_data = match.group(2)
    img_data = base64.b64decode(b64_data)
    filename = f"{filename_prefix}.{ext}"
    filepath = os.path.join('public/images', filename)
    with open(filepath, 'wb') as f:
        f.write(img_data)
    return f"/images/{filename}"

def main():
    with open('agregue tres productos.txt', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    new_products_processed = 0
    
    for item in data:
        # Check main image
        if 'imagen' in item and isinstance(item['imagen'], str) and item['imagen'].startswith('data:image'):
            new_img_path = process_base64_image(item['imagen'], f"new_prod_{item.get('id', int(time.time()))}_main")
            if new_img_path:
                item['imagen'] = new_img_path
                new_products_processed += 1
                
        # Check detail image
        if 'imagenDetalle' in item and isinstance(item['imagenDetalle'], str) and item['imagenDetalle'].startswith('data:image'):
            new_img_path = process_base64_image(item['imagenDetalle'], f"new_prod_{item.get('id', int(time.time()))}_detail")
            if new_img_path:
                item['imagenDetalle'] = new_img_path

    if new_products_processed > 0:
        # Create a new JS file content
        js_content = "export const productosData = " + json.dumps(data, indent=2, ensure_ascii=False) + ";\n"
        with open('src/data/productos.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Successfully processed and updated {new_products_processed} products.")
    else:
        print("No new base64 images found.")

if __name__ == '__main__':
    main()
