import re
import os

file_path = "/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos/src/data/productos.js"

with open(file_path, 'r') as f:
    content = f.read()

# 1. Reemplazar espacios por guiones bajos en las rutas de imágenes
def replace_spaces(match):
    return match.group(0).replace(' ', '_')

content = re.sub(r'imagen: "/images/[^"]+"', replace_spaces, content)
content = re.sub(r'imagenDetalle: "/images/[^"]+"', replace_spaces, content)

# 2. Agregar precio si falta
# Buscamos el cierre de cada objeto de producto y añadimos el precio antes del cierre
# Solo si no tiene ya un campo 'precio:'
def add_price(match):
    obj_content = match.group(1)
    if 'precio:' not in obj_content:
        # Añadir precio por defecto
        obj_content = obj_content.rstrip() + ',\n    precio: 250'
    return '  {\n' + obj_content + '\n  }'

content = re.sub(r'  {\s+([^}]+)\s+}', add_price, content)

with open(file_path, 'w') as f:
    f.write(content)

print("productos.js actualizado con rutas limpias y precios base.")
