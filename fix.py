import os, re

dir_path = r'c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es'

for filename in os.listdir(dir_path):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Dropdown desktop & mobile replacements
    content = re.sub(r'Servicios del Servicios del Estudio de Renders y Arquitectura\s*Digital', r'Servicios del Estudio de Renders y Arquitectura Digital', content)
    content = re.sub(r'Servicios de la Servicios de la Plataforma de Gemelos Digitales\s*Inmobiliarios', r'Servicios de la Plataforma de Gemelos Digitales Inmobiliarios', content)
    content = re.sub(r'Servicios de Servicios de Showrooms Digitales\s*Interactivos de Última Generación de Última\s*Generación', r'Servicios de Showrooms Digitales Interactivos de Última Generación', content)
    
    # Another variant
    content = re.sub(r'Servicios de Servicios de Showrooms Digitales Interactivos de\s*Última Generación de Última\s*Generación', r'Servicios de Showrooms Digitales Interactivos de Última Generación', content)
    
    
    # Specific H1 and H3 duplicates
    content = content.replace('Servicios del Servicios del Estudio de Renders y Arquitectura Digital', 'Servicios del Estudio de Renders y Arquitectura Digital')
    content = content.replace('Servicios de la Servicios de la Plataforma de Gemelos Digitales Inmobiliarios', 'Servicios de la Plataforma de Gemelos Digitales Inmobiliarios')
    content = content.replace('Servicios de Servicios de Showrooms Digitales Interactivos de Última Generación de Última Generación', 'Servicios de Showrooms Digitales Interactivos de Última Generación')
    content = content.replace('Servicios de la Servicios de la Plataforma de Gemelos Digitales\n                            Inmobiliarios', 'Servicios de la Plataforma de Gemelos Digitales Inmobiliarios')
    content = content.replace('Servicios de Servicios de Showrooms Digitales Interactivos de\n                    Última Generación de Última\n                    Generación', 'Servicios de Showrooms Digitales Interactivos de Última Generación')
    content = content.replace('Servicios de Servicios de Showrooms Digitales\n                            Interactivos de Última Generación de Última\n                            Generación', 'Servicios de Showrooms Digitales Interactivos de Última Generación')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done!')
