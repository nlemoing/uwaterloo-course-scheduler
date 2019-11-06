from urllib.request import urlopen
from bs4 import BeautifulSoup
from util import offered_regex, check_ends, remove_ends

def parse_course(course_tree, subject_id):
    # course information is in a table and each component is in a tr tag
    items = course_tree.find_all('tr')
    if len(items) < 3:
        return
    course = { 'subjectId': subject_id }
    # The first three items are always the same
    first, second, third, *rest = items
    ## The first item should have two td components
    first = [s for s in first.stripped_strings]
    if len(first) != 2:
        return
    ## The first component has:
    subject, number, course_type, num_credits = first[0].split(' ')
    ### the course subject and number (e.g. MATH 135)
    course['subject'] = subject
    course['number'] = number
    ### course type (combination of comma-separated LEC/LAB/TST/TUT)
    course['type'] = course_type.split(',')
    ### number of credits (e.g 0.50)
    course['credits'] = float(num_credits)
    ## The second component has a unique Waterloo course code (e.g. 006878)
    course['code'] = remove_ends(first[1], prefix='Course ID: ')
    ## The second item is just the course name (e.g. Algebra for Honours Mathematics)
    course['name'] = second.string.strip()
    ## The third item is the course description.
    ### The description sometimes ends with [Offered: {terms}],
    ### but sometimes that's in another item
    course['description'] = third.string.strip()
    offered_match = offered_regex.search(course['description'])
    if offered_match and offered_match.group(1):
        course['offered'] = offered_match.group(1).split(',')
    ## The next items are variable, so we'll handle them in a loop
    for item in rest:
        # There may be some empty items, so skip over those
        s = item.string
        if not s or not s.strip():
            continue
        s = s.strip()
        # Cases
        ## Note: extra info. sometimes contains the [Offered: {terms}] pattern.
        if check_ends(s, prefix='[Note: ', suffix=']'):
            course['note'] = remove_ends(s, prefix='[Note: ', suffix=']')
            offered_match = offered_regex.search(course['note'])
            if offered_match and offered_match.group(1):
                course['offered'] = offered_match.group(1).split(',')
        ## Prereq, antireq, coreq: these describe dependencies on other courses
        ## Remove their prefix and just store the string for now
        ## More parsing will be done on these later
        elif check_ends(s, prefix='Prereq: '):
            course['prereq'] = remove_ends(s, prefix='Prereq: ')
        elif check_ends(s, prefix='Antireq: '):
            course['antireq'] = remove_ends(s, prefix='Antireq: ')
        elif check_ends(s, prefix='Coreq: '):
            course['coreq'] = remove_ends(s, prefix='Coreq: ')
        ## Also/only offered online
        elif 'online' in s.lower():
            course['online'] = True
        ## Instructor consent required
        elif s.lower() == 'instructor consent required':
            course['instructor_consent'] = True
        elif 'other' in course:
            course['other'].append(s)
        else:
            course['other'] = [s]
    return course

def courses_for_subject(subject, calendar = '1920'):
    url = "http://www.ucalendar.uwaterloo.ca/{}/COURSE/course-{}.html"
    try:
        page = urlopen(url.format(calendar, subject['abbreviation']))
    except:
        # HTTP error opening page, return None
        return None
    soup = BeautifulSoup(page, 'html.parser')
    # each course is contained in a center tag
    course_trees = soup.find_all('center')
    courses = [parse_course(course_tree, subject['id']) for course_tree in course_trees]
    return courses