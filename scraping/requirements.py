from urllib.request import urlopen
from bs4 import BeautifulSoup
import json
import re

courses = json.load(open('data/courses.json'))
def idFromCourse(subject, number):
    for course in courses:
        if course['subject'] == subject and course['number'] == number:
            return course['id']

def requirements(path):
    url = "http://ugradcalendar.uwaterloo.ca/page/{}"
    try:
        page = urlopen(url.format(path))
    except:
        # HTTP error opening page, return None
        return None
    soup = BeautifulSoup(page, 'html.parser')
    name = soup.find(id='ctl00_contentMain_lblPageTitle').string
    reqs = [c for c in soup.find(id='ctl00_contentMain_lblContent').contents if c.name]
    planReq = {
        'type': 'allOf',
        'name': name,
        'items': []
    }
    i = 0
    while i < len(reqs):
        req = None
        if reqs[i].name != 'p':
            i += 1
            continue
        elif i + 1 < len(reqs) and reqs[i+1].name == 'blockquote':
            # parse two
            p, quote = reqs[i:i+2]
            req = parse_two(p, quote)
            i += 2
        else:
            # parse one
            req = parse_one(reqs[i])
            i += 1
            
        if req is not None:
            planReq['items'].append(req)
    
    return planReq

NUMBER_MAP = {
    'One': 1,
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5,
    'Six': 6
}

def parse_type(item):
    req = {}
    
    if 'all' in item.string.lower():
        req['type'] = 'allOf'
    elif any(x.lower() in item.string.lower() for x in NUMBER_MAP):
        req['type'] = 'someOf'
        for number in NUMBER_MAP:
            if number.lower() in item.string.lower():
                req['number'] = NUMBER_MAP[number]
                break
    else:
        print('parse_type', 'Unable to parse', item)
        return
    return req

def parse_course(link):
    subject, number = link.string.strip().split(' ')
    courseId = idFromCourse(subject, number)
    if courseId is None:
        print('parse_course', 'No course id found for', subject, number)
        return
    return {
        'type': 'course',
        'courseId': courseId
    }

def parse_section(section):
    req = {}
    # Cross-listed course: treat as one of
    if len(section) > 3:
        a1, mid, a2, *rest = section
        if (mid.string.strip() == '/' or ' or ' in mid.string) and a1.name == 'a' and a2.name == 'a':
            return {
                'type': 'someOf',
                'number': 1,
                'items': [parse_course(a) for a in (section[0], section[2])]
            }
        if ' to ' in mid.string and a1.name == 'a' and a2.name == 'a':
            subject, low = a1.string.split(' ')
            _, high = a2.string.split(' ')
            return create_group(course_range=[{ 'subject': subject, 'low': low, 'high': high }])

    if section[0].name == 'a':
        return parse_course(section[0])
    if len(section) == 1:
        return parse_one(section[0])
    print('parse_section', section)

amount = "|".join(NUMBER_MAP)
subject = "[A-Z]{2,6}"
number = "[0-9]{3}"
single_level = f"({number})-level"
double_level = f"({number})-(level | |)or ({number})-level"
course_range = f"({subject}) ({number})-{subject} ({number})"
single_level_regex = re.compile(f"({amount}|).*({single_level}) ({subject})")
double_level_regex = re.compile(f"({amount}|).*({double_level}) ({subject})")
alt_double_level_regex = re.compile(f"({subject}) ({amount}|).*({double_level})")
amount_regex = re.compile(amount)
course_range_regex = re.compile(course_range)

def create_group(number=None, subject=None, levels=None, course_range=None):
    group = { 'type': 'group' }
    if number in NUMBER_MAP:
        group['number'] = NUMBER_MAP[number]
    else:
        group['number'] = 1
    if subject:
        group['subject'] = subject
    if levels:
        group['levels'] = [int(level[0]) for level in levels]
    if course_range:
        group['range'] = course_range
    return group
        
def parse_single_level(inp):
    match = single_level_regex.search(inp)
    if not match:
        return
    number = match.group(1)
    level = match.group(3)
    subject = match.group(4)
    return create_group(number=number, levels=[level], subject=subject)

def parse_double_level(inp):
    match = double_level_regex.search(inp)
    if match is not None:
        number = match.group(1)
        levels = match.group(3, 5)
        subject = match.group(6)
        return create_group(number=number, levels=levels, subject=subject)
    match = alt_double_level_regex.search(inp)
    if match is not None:
        subject = match.group(1)
        number = match.group(2)
        levels = match.group(4, 6)
        return create_group(number=number, levels=levels, subject=subject)

def parse_range(inp):
    ranges = course_range_regex.findall(inp)
    if len(ranges) == 0:
        return
    amount = amount_regex.match(inp)
    number = None
    if amount:
        number = amount.group()
    course_range = [{ 'subject': subject, 'low': low, 'high': high } \
                        for subject, low, high in ranges ]
    return create_group(number=number, course_range=course_range)

def parse_one(p):
    if not p.string:
        return
    input_text = p.string.strip()
    
    for f in [
        parse_double_level,
        parse_single_level,
        parse_range
    ]:
        match = f(input_text)
        if match:
            return match
    print('parse_one', p)
        

def parse_two(p, quote):
    req = parse_type(p)
    if req is None:
        return
    
    # Split each section up by whitespace (br or empty string tags)
    sections = []
    current_section = []
    for x in quote.contents:
        if x.name == 'br' or (x.name is None and not x.string.strip()):
            if len(current_section):
                sections.append(current_section)
                current_section = []
        else:
            current_section.append(x)
    if len(current_section):
        sections.append(current_section)
    
    items = []
    for section in sections:
        item = parse_section(section)
        if item is not None:
            items.append(item)
    req['items'] = items
    return req