import re

file_path = "/Volumes/Programas/1.- Archivos de IA/1.- Proyectos Personales/1. Antigravity/Suplementos/src/data/productos.js"

with open(file_path, 'r') as f:
    content = f.read()

# Corregir el error del guion bajo intruso: 'imagen:_' -> 'imagen: '
content = content.replace('imagen:_', 'imagen: ')
content = content.replace('imagenDetalle:_', 'imagenDetalle: ')

# Corregir la indentación del ID (opcional pero ayuda)
content = re.sub(r'\n(\s*)id:', r'\n    id:', content)

with open(file_path, 'w') as f:
    f.write(content)

print("productos.js corregido.")
