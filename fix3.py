import os, re

dir_path = r'c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es'

for filename in os.listdir(dir_path):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Renders
    content = re.sub(
        r'Servicios del\s+Estudio de Renders y Arquitectura Digital',
        r'Estudio de Renders y Arquitectura Digital',
        content
    )
    # Platforms
    content = re.sub(
        r'Servicios de la\s+Plataforma de Gemelos Digitales\s*Inmobiliarios',
        r'Plataforma de Gemelos Digitales Inmobiliarios',
        content
    )
    # Showrooms
    content = re.sub(
        r'Servicios de\s+Showrooms Digitales Interactivos de Última\s*Generación',
        r'Showrooms Digitales Interactivos de Última Generación',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done 3!')
