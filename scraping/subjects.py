from bs4 import BeautifulSoup

def parse_subjects():
    with open('./data/subjects.html') as f:
        soup = BeautifulSoup(f, 'html.parser')
    rows = soup.find('tbody').find_all('tr')
    subjects = []
    idx = 1
    for subject in rows:

        name, abbreviation, *rest = subject.stripped_strings
        if not len(rest):
            continue
        faculty = rest[0]
        subjects.append({ 'id': idx, 'abbreviation': abbreviation, 'name': name, 'faculty': faculty })
        idx += 1
    return subjects