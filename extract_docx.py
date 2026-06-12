import zipfile
import xml.etree.ElementTree as ET
import json
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path, 'r') as z:
            xml_content = z.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text = []
        for p in tree.findall('.//w:p', namespaces):
            para_text = []
            for t in p.findall('.//w:t', namespaces):
                if t.text:
                    para_text.append(t.text)
            text.append(''.join(para_text))
            
        return '\n'.join(text)
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    text = extract_text_from_docx("datos.json.docx")
    if text:
        with open("datos_extracted.json", "w") as f:
            f.write(text)
        print("Extraction successful.")
        
        # Verify JSON
        try:
            data = json.loads(text)
            print(f"Parsed {len(data)} items successfully.")
        except json.JSONDecodeError as e:
            print(f"JSON is invalid: {e}")
            # Try to save the exact text to see what's wrong
