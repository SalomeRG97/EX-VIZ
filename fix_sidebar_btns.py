import os, re

files = {
    # Spanish pages
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es\renderingstudio.html": {
        "text": "¿Tienes un proyecto en mente?",
        "href": "/es/contact"
    },
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es\digitalsalestwin.html": {
        "text": "¿Tienes un proyecto en mente?",
        "href": "/es/contact"
    },
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\es\immersivesalesexperience.html": {
        "text": "¿Tienes un proyecto en mente?",
        "href": "/es/contact"
    },
    # English pages
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\renderingstudio.html": {
        "text": "Do you have a project in mind?",
        "href": "/contact"
    },
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\digitalsalestwin.html": {
        "text": "Do you have a project in mind?",
        "href": "/contact"
    },
    r"c:\Users\salom\Documents\EBEDIX\REAL ESTATE\web\immersivesalesexperience.html": {
        "text": "Do you have a project in mind?",
        "href": "/contact"
    },
}

# Pattern: <a target="_blank"\n...\n class="btn btn-dark sidebar-btn">TEXT</a>
pattern = re.compile(
    r'<a\s+target="_blank"\s*\n\s+href="[^"]+"\s*\n\s+class="btn btn-dark sidebar-btn">[^<]+</a>',
    re.MULTILINE
)

for path, cfg in files.items():
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    replacement = f'<a href="{cfg["href"]}" class="btn btn-dark sidebar-btn">{cfg["text"]}</a>'
    new_content, n = pattern.subn(replacement, content)

    if n > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"OK: {os.path.basename(path)}")
    else:
        print(f"NO MATCH: {os.path.basename(path)}")
