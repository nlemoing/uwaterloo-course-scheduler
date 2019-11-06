import json
import concurrent.futures as cf
import threading
from subjects import parse_subjects
from courses import courses_for_subject

THREADS = 10
all_courses = []
lock = threading.Lock()


def scrape_one(subject):
    print('Scraping subject {}'.format(subject['abbreviation']))
    courses = courses_for_subject(subject)
    with lock:
        all_courses.extend(courses)

def scrape_all():
    subjects = parse_subjects()
    with open('./data/subjects.json', 'w') as f:
        json.dump(subjects, f, indent=2)
    with cf.ThreadPoolExecutor(max_workers=THREADS) as executor:
        for subject in subjects:
            executor.submit(scrape_one, subject)
    with open('./data/courses.json', 'w') as f:
        json.dump(all_courses, f, indent=2)

scrape_all()
    