import { Course } from '../components/course.js';
import { Semester } from '../components/semester.js';
import { AddableList } from '../components/addableList.js';

class ScheduleView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.semesters = {};
        this.courses = {};

        // Main container
        this.container = document.createElement('div');
        this.container.id = 'schedule-view';

        // Header
        this.header = document.createElement('h1');
        this.container.appendChild(this.header);

        // Container for all semesters
        this.semestersList = new AddableList(
            'semesters',
            (name) => { this.eventBus.dispatch('addsemester', { name }); },
            'Add a semester'
        );
        this.container.appendChild(this.semestersList.container);

        // Add miscellaneous courses container
        this.miscSemester = new Semester({ name: 'Other courses', }, this.eventBus);
        this.semestersList.add(this.miscSemester.container);
    }

    _reset() {
        this.header.textContent = '';

        for (const courseId in this.courses) {
            this.deleteCourse(courseId);
        }
        for (const semesterId in this.semesters) {
            this.deleteSemester(semesterId)
        }
    }

    render(schedule, container) {
        this._reset();

        const { name, semesters, courses, } = schedule;
        // Set header name
        this.header.textContent = name;
        // Add each semester
        semesters.forEach(this.addSemester.bind(this));
        // Add each course
        courses.forEach(this.addCourse.bind(this));

        if (container) {
            container.appendChild(this.container);
        }
    }

    addSemester(semesterInfo) {
        const semester = new Semester(semesterInfo, this.eventBus);
        this.semesters[semesterInfo.id] = semester;
        this.semestersList.add(semester.container);
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

        const semester = this.semesters[semesterId] || this.miscSemester;
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