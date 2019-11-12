
class Requirement {
    constructor(parent, name) {
        this.container = document.createElement('div');
        this.container.classList.add('plan-item', 'collapsed');
        
        // Title button is collapsable/expandable contained items
        const title = document.createElement('button');
        title.classList.add('base-button');
        title.textContent = name;
        title.addEventListener('click', () => { this.container.classList.toggle('collapsed'); })
        this.container.appendChild(title);

        parent.appendChild(this.container);
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
        let ret = {
            satisfied: true,
            remainingCourses: courses
        }
        for (const req of this.reqs) {
            ret = req.satisfy(ret.remainingCourses);
            if (!ret.satisfied) {
                break;
            }
        }
        this.updateClass(ret.satisfied);
        return ret;
    }
}

class OneOf extends List {
    constructor(parent, items, name = 'One of') {
        super(parent, items, name);
    }

    satisfy(courses) {
        let ret = {
            satisfied: false,
            remainingCourses: courses
        }
        for (const req of this.reqs) {
            ret = req.satisfy(ret.remainingCourses);
            if (ret.satisfied) {
                break;
            }
        }
        this.updateClass(ret.satisfied);
        return ret;
    }
}

class Course extends Requirement {
    constructor(parent, courseId) {
        // Later, use courseModel to get display name of course
        const name = `${courseId}`;
        super(parent, name)
        this.courseId = courseId;
    }

    satisfy(courses) {
        const idx = courses.findIndex((course) => {
            return this._courseId === course.courseId;
        });
        const satisfied = idx === -1;
        const remainingCourses = satisfied ? courses.splice(idx, 1) : courses;
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

