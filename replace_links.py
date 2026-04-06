import os
import glob
import re

html_files = glob.glob('*.html')
html_files = [f for f in html_files if f not in ['privacy-policy.html', 'legal.html']]

count = 0
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_links = '''<a href="privacy-policy.html">Privacy Policy & Terms</a>
                    <a href="legal.html">Legal</a>'''
    
    # Try exact replace first
    if '<a href="#">Privacy Policy</a>' in content and '<a href="#">Terms of Service</a>' in content:
        content = re.sub(r'<a href="#">Privacy Policy</a>\s*<a href="#">Terms of Service</a>', new_links, content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1
        continue
        
    print(f"Skipped {f}")

print(f'Updated footer in {count} files')
