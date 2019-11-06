from urllib.request import urlopen
from bs4 import BeautifulSoup


def scrape_subject(calendar, subject):
    url = "http://www.ucalendar.uwaterloo.ca/{}/COURSE/course-{}.html"
    try:
        page = urlopen(url.format(calendar, subject))
    except:
        # HTTP error opening page, return None
        return None
    soup = BeautifulSoup(page, 'html.parser')
    # each course is contained in a center tag
    courses = soup.find_all('center')
    for course in courses:
        # course information is in a table and each component
        # is in a tr tag
        items = course.find_all('tr')
        if len(items) < 3:
            continue
        # The first three items are always the same
        first, second, third, *rest = items
        ## The first item has:
        ### the course code (e.g. MATH 135)
        ### course type (combination of comma-separated LEC/LAB/TST/TUT)
        ### number of credits (e.g 0.50)
        ### Unique Waterloo course ID (e.g. 006878)
        ## The first three components are contained in the same <td> tag,
        ## while the course ID is in a separate <td> tag.
        print([s for s in first.stripped_strings])
        ## The second item is just the course name (e.g. Algebra for Honours Mathematics)
        print(second.string)
        ## The third item is the course description.
        ### The description sometimes ends with [Offered: {terms}],
        ### but sometimes that's in another item
        print(third.string)
        ## The next items are variable, so we'll handle them in a loop
        for i, item in enumerate(rest):
            # There may be some empty items, so skip over those
            s = item.string.strip()
            if not s:
                continue
            # Cases
            ## Note: extra info. sometimes contains the [Offered: {terms}] pattern.

            ## Prereq, antireq, coreq: these describe dependencies on other courses
            ## Remove their prefix and just store the string for now
            ## More parsing will be done on these later

            ## Also/only offered online

            ## Instructor consent required
            print(i, item.string.strip())


scrape_subject("1920", "MATH")