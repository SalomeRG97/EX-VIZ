import os, re

dir_path = r'c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es'

for filename in os.listdir(dir_path):
    if not filename.endswith('.html'): continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Use robust regex for any variations of the typos 
    content = re.sub(
        r'Servicios de Servicios de Showrooms Digitales Interactivos de Última\s*Generación de Última\s*Generación',
        'Servicios de Showrooms Digitales Interactivos de Última Generación',
        content
    )
    content = re.sub(
        r'Servicios de Servicios de Showrooms Digitales Interactivos\s*de Última Generación',
        'Servicios de Showrooms Digitales Interactivos de Última Generación',
        content
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done 2!')
