import { getCourse } from '../models/course.js';

class Requirement {
    constructor(parent, name) {
        this.container = document.createElement('div');
        this.container.classList.add('plan-item', 'collapsed');
        
        // Title button is collapsable/expandable contained items
        this.title = document.createElement('button');
        this.title.classList.add('base-button');
        this.title.addEventListener('click', () => { this.container.classList.toggle('collapsed'); })
        this.container.appendChild(this.title);

        this.setName(name);

        parent.appendChild(this.container);
    }

    setName(name) {
        this.title.textContent = name;
    }

    updateClass(val) {
        this.container.classList.toggle('satisfied', val);
    }
}

class Unknown extends Requirement {
    constructor(parent) {
        super(parent, 'Unknown');
    }

    satisfy(courses) {
        return { satisfy: false, remainingCourses: courses };
    }
}

class List extends Requirement {
    constructor(parent, items, name) {
        super(parent, name);
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('plan-items');
        this.container.appendChild(itemsContainer);
        this.reqs = items.map(item => createRequirement(itemsContainer, item));
    }
}

class AllOf extends List {
    constructor(parent, items, name = 'All of') {
        super(parent, items, name);
    }

    satisfy(courses) {
        let remainingCourses = courses;
        let satisfied = true;
        let ret;
        for (const req of this.reqs) {
            ret = req.satisfy(remainingCourses);
            remainingCourses = ret.remainingCourses;
            satisfied = satisfied && ret.satisfied;
        }
        this.updateClass(satisfied);
        return { satisfied, remainingCourses };
    }
}

class OneOf extends List {
    constructor(parent, items, name = 'One of') {
        super(parent, items, name);
    }

    satisfy(courses) {
        let remainingCourses = courses;
        let satisfied = false;
        let ret;
        for (const req of this.reqs) {
            ret = req.satisfy(remainingCourses);
            remainingCourses = ret.remainingCourses;
            satisfied = satisfied || ret.satisfied;
        }
        this.updateClass(satisfied);
        return { satisfied, remainingCourses };
    }
}

class Course extends Requirement {
    constructor(parent, courseId) {
        // Later, use courseModel to get display name of course
        let name = `${courseId}`;
        super(parent, name);
        this.courseId = courseId;

        getCourse(courseId).then(course => {
            this.setName(`${course.subject.abbreviation} ${course.number}`);
        });
    }

    satisfy(courses) {
        const idx = courses.findIndex((course) => {
            return this.courseId === course.courseId;
        });
        const satisfied = idx !== -1;
        const remainingCourses = courses;
        if (satisfied) {
            remainingCourses.splice(idx, 1);
        }
        this.updateClass(satisfied);
        return { satisfied, remainingCourses };
    }
}

function createRequirement(parent, item) {
    switch (item.type) {
        case 'allOf': return new AllOf(parent, item.items, item.name);
        case 'oneOf': return new OneOf(parent, item.items, item.name);
        case 'course': return new Course(parent, item.courseId);
        default: return new Unknown(parent);
    }
}

export { createRequirement };

