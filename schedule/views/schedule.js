import { Course } from '../components/course.js';
import { DraftSemester, Semester } from '../components/semester.js';
import { AddButton } from '../components/button.js';

class ScheduleView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.semesters = {};
        this.courses = {};

        // Main container outlines
        this.containers = {
            main: document.createElement('div'),
            header: document.createElement('h1'),
            semesters: document.createElement('div'),
            addSemester: new AddButton(
                `add-semester`,
                this.addDraftSemester.bind(this),
                ['semester', 'large']
            ).container
        };
        this.containers.main.id = 'schedule-view';

        // Header
        this.containers.main.appendChild(this.containers.header);
        
        // Container for all semesters
        this.containers.semesters.id = 'semesters';
        this.containers.main.appendChild(this.containers.semesters);

        // Add miscellaneous courses container
        this.semesters.misc = new Semester({ id: 'misc', name: 'Misc.', }, this.eventBus);
        this.containers.semesters.appendChild(this.semesters.misc.container);

        // Button for adding a semester
        this.containers.semesters.appendChild(this.containers.addSemester);
    }

    _reset() {
        this.containers.header.textContent = '';

        for (const courseId in this.courses) {
            this.deleteCourse(courseId);
        }
        for (const semesterId in this.semesters) {
            if (semesterId === 'misc') continue;
            this.deleteSemester(semesterId)
        }
    }

    render(schedule, container) {
        this._reset();

        const { name, semesters, courses, } = schedule;
        // Set header name
        this.containers.header.textContent = name;
        // Add each semester
        semesters.forEach(this.addSemester.bind(this));
        // Add each course
        courses.forEach(this.addCourse.bind(this));

        if (container) {
            container.appendChild(this.containers.main);
        }
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
        const courseId = courseInfo.id;
        const semesterId = courseInfo.semesterId;

        const course = new Course(courseInfo, this.eventBus);
        this.courses[courseId] = course;

        const semester = this.semesters[semesterId] || this.semesters.misc;
        semester.addCourse(course);
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

export { ScheduleView };