from bs4 import BeautifulSoup

def parse_subjects():
    with open('./subjects.html') as f:
        soup = BeautifulSoup(f, 'html.parser')
    rows = soup.find('tbody').find_all('tr')
    subjects = []
    idx = 1
    for subject in rows:
        name, abbreviation, *rest = subject.stripped_strings
        if abbreviation.lower() == 'back to top':
            continue
        subjects.append({ 'id': idx, 'abbreviation': abbreviation, 'name': name })
        idx += 1
    return subjects