import { Course } from '../components/course.js';
import { Semester } from '../components/semester.js';
import { AddableList } from '../components/addableList.js';
import { addSemester } from '../models/schedule.js';

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
            this.addSemester.bind(this),
            'Add a semester'
        );
        this.container.appendChild(this.semestersList.container);

        // Add miscellaneous courses container
        this.miscSemester = new Semester({ name: 'Other courses', }, this.eventBus);
        this.semestersList.add(this.miscSemester.container);

        this._bindEvents();
    }

    _bindEvents() {
        this.eventBus.on('addcourse', this.createCourseContainer.bind(this));
        this.eventBus.on('deletecourse', this.removeCourseContainer.bind(this));
        this.eventBus.on('editcourse', this.editCourse.bind(this));
        this.eventBus.on('deletesemester', this.removeSemesterContainer.bind(this));
    }

    _reset() {
        this.header.textContent = '';

        for (const courseId in this.courses) {
            this.removeCourseContainer(courseId);
        }
        for (const semesterId in this.semesters) {
            this.removeSemesterContainer(semesterId)
        }
    }

    render(schedule, container) {
        this._reset();

        const { name, semesters, courses, } = this.schedule = schedule;
        // Set header name
        this.header.textContent = name;
        // Add each semester
        semesters.forEach(this.createSemesterContainer.bind(this));
        // Add each course
        courses.forEach(this.createCourseContainer.bind(this));

        if (container) {
            container.appendChild(this.container);
        }
    }

    async addSemester(name) {
        const { id } = this.schedule;
        const semesterInfo = await addSemester(id, { name });
        if (!semesterInfo) {
            this.eventBus.dispatch('error', { message: 'Unable to add semester' });
            return;
        }
        this.createSemesterContainer(semesterInfo);
    }

    createSemesterContainer(semesterInfo) {
        const semester = new Semester(semesterInfo, this.eventBus);
        this.semesters[semesterInfo.id] = semester;
        this.semestersList.add(semester.container);
    }

    removeSemesterContainer(id) {
        if (id in this.semesters) {
            this.semesters[id].container.remove();
            delete this.semesters[id];
        }
    }

    createCourseContainer(courseInfo) {
        const courseId = courseInfo.id;
        const semesterId = courseInfo.semesterId;

        const course = new Course(courseInfo, this.eventBus);
        this.courses[courseId] = course;

        const semester = this.semesters[semesterId] || this.miscSemester;
        semester.addCourse(course);
    }

    removeCourseContainer(id) {
        if (id in this.courses) {
            this.courses[id].container.remove();
            delete this.courses[id];
        }
    }

    editCourse(course) {
        this.removeCourseContainer(course.id);
        this.createCourseContainer(course);
    }
}

export { ScheduleView };