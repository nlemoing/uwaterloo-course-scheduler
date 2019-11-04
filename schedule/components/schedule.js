import { Course } from './course.js';
import { DraftSemester, Semester } from './semester.js';

class Schedule {
    constructor(schedule, eventBus) {
        this.schedule = schedule;
        this.eventBus = eventBus;
        this.semesters = {};
        this.courses = {};

        const { name, semesters, courses, } = schedule;
        // Main container outlines
        this.containers = {
            main: document.createElement('div'),
            header: document.createElement('h1'),
            semesters: document.createElement('div'),
            addSemester: document.createElement('div')
        };
        this.containers.main.id = 'schedule';

        // Header
        this.containers.header.textContent = name;
        this.containers.main.appendChild(this.containers.header);
        
        // Container for all semesters
        this.containers.semesters.id = 'semesters';
        this.containers.main.appendChild(this.containers.semesters);

        // Add miscellaneous courses container
        this.semesters.misc = new Semester({ id: 'misc', name: 'Misc.', }, this.eventBus);
        this.containers.semesters.appendChild(this.semesters.misc.container);

        // Button for adding a semester
        this.containers.addSemester.classList.add('semester', 'add');
        this.containers.addSemester.addEventListener('click', this.addDraftSemester.bind(this));
        this.containers.semesters.appendChild(this.containers.addSemester);

        // Add each semester
        semesters.forEach(this.addSemester.bind(this));
        // Add each course
        courses.forEach(this.addCourse.bind(this));
    }

    get container() {
        return this.containers.main;
    }

    addSemester(semesterInfo) {
        const semester = new Semester(semesterInfo, this.eventBus);
        this.semesters[semesterInfo.id] = semester;
        this.containers.semesters.insertBefore(semester.container, this.containers.addSemester);
    }

    addDraftSemester() {
        const draftSemester = new DraftSemester(this.eventBus);
        this.containers.semesters.insertBefore(draftSemester.container, this.containers.addSemester);
        draftSemester.focus();
    }

    deleteSemester(id) {
        if (id in this.semesters) {
            this.semesters[id].container.remove();
            delete this.semesters[id];
        }
    }

    addCourse(courseInfo) {
        const { id, } = courseInfo;

        const course = new Course(courseInfo, this.eventBus);
        this.courses[id] = course;

        const semester = this.semesters[id] || this.semesters.misc;
        semester.container.appendChild(course.container);
    }

    deleteCourse(id) {
        if (id in this.courses) {
            this.courses[id].container.remove();
            delete this.courses[id];
        }
    }

    editCourse(course) {
        this.deleteCourse(course.id);
        this.addCourse(course);
    }
}

export { Schedule };