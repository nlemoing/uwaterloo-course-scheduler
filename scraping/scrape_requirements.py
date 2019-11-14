from requirements import requirements
import json
import concurrent.futures as cf

THREADS = 10

def scrape_one(path):
    req = requirements(path)
    with open(f'data/requirements/{path}.json', 'w') as f:
        json.dump(req, f, indent=2)

def scrape_all():
    with open('data/plans.json') as f:
        faculties = json.load(f)
    paths = []
    for fac in faculties:
        for program in fac['programs']:
            paths.extend(program['plans'])
    with cf.ThreadPoolExecutor(max_workers=THREADS) as executor:
        for path in paths:
            executor.submit(scrape_one, path)


scrape_all()