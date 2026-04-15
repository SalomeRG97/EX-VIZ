import os
import re

root = r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web"

# Match: <a href="#" target="_blank" aria-label="LinkedIn"> or YouTube
pattern = re.compile(
    r'<a\s+href="#"\s+target="_blank"\s+aria-label="(LinkedIn|YouTube)">'
)
replacement = r'<a href="javascript:void(0)" aria-label="\1" style="cursor:default;opacity:0.5;">'

count = 0
for dirpath, _, files in os.walk(root):
    # Skip node_modules and .git
    if any(x in dirpath for x in ['node_modules', '.git', '__pycache__']):
        continue
    for fname in files:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content, n = pattern.subn(replacement, content)
        if n > 0:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {n} link(s) in: {fpath}")
            count += n

print(f"\nDone! Total links updated: {count}")
