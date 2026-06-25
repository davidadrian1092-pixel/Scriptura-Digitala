import xml.etree.ElementTree as ET
import json

def convert_xml_to_json(xml_file, json_output):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    bible_data = {"carti": []}
    
    # Parcurgem fiecare carte (<book>)
    for book_elem in root.findall('book'):
        book_name = book_elem.find('h').text if book_elem.find('h') is not None else book_elem.get('id')
        current_book = {"nume": book_name, "capitole": []}
        
        current_chapter = None
        
        # USFX are o structură plată, parcurgem elementele din <p>
        for p in book_elem.findall('p'):
            # Iterăm prin tot ce e în interiorul paragrafului (text și tag-uri)
            for node in p.iter():
                if node.tag == 'c': # Capitol nou
                    chapter_id = node.get('id')
                    current_chapter = {"numar": chapter_id, "versete": []}
                    current_book["capitole"].append(current_chapter)
                
                elif node.tag == 'v': # Verset nou
                    if current_chapter is not None:
                        verse_id = node.get('id')
                        # Luăm textul de după tag-ul <v>
                        verse_text = node.tail.strip() if node.tail else ""
                        current_chapter["versete"].append({"n": verse_id, "text": verse_text})
        
        bible_data["carti"].append(current_book)

    with open(json_output, 'w', encoding='utf-8') as f:
        json.dump(bible_data, f, ensure_ascii=False, indent=2)
    print(f"Gata! Fișierul {json_output} a fost creat.")

# Rulează conversia
convert_xml_to_json("ron-rccv.usfx.xml", "data/biblie.json")