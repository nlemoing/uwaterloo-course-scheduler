import { AddCourseForm } from './components/addCourseForm.js';
import { Course } from './components/course.js';
import { Semester } from './components/semester.js';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class ScheduleView {
    constructor({ container, eventBus, courseModel, }) {
        this.container = container;
        this.eventBus = eventBus;
        this.courseModel = courseModel;

        this._reset();
    }

    _reset() {
        this.semesters = {};
        this.courses = {};
        this._coursesBySubject = {};
        this.container.innerHTML = '';
        this.initialized = false;
    }

    _addSemester(semesterInfo) {
        const semester = new Semester(semesterInfo, this.eventBus, this.courseModel);
        this.semesters[semesterInfo.id] = semester;
        const semestersContainer = document.getElementById('semesters');
        semestersContainer.insertBefore(semester.container, this.semesterAddContainer);
        return semester.container;
    }

    _addDraftSemester() {
        const draftSemester = this._addSemester({ id: 'draft' });
        const input = document.createElement('input');
        input.type = 'text';
        draftSemester.appendChild(input);
        input.addEventListener('focusout', () => {
            const name = input.value;
            this._deleteSemester('draft');
            if (name) {
                this.eventBus.dispatch('addsemester', { name, });
            }
        });
        input.addEventListener('keyup', ({ keyCode, }) => {
            if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
                input.blur();
            }
        });
        input.focus();
    }

    _deleteSemester(id) {
        const semesterToDelete = this.semesters[id];
        if (semesterToDelete) {
            semesterToDelete.container.remove();
            delete this.semesters[id];
        }
    }

    _addCourse(courseInfo) {
        const { id, semester, } = courseInfo;
        const course = new Course(courseInfo, this.eventBus);
        
        this.courses[id] = course;

        const semesterContainer = 
            document.getElementById(`semester-${semester}`) ||
            document.getElementById('semester-misc');
        semesterContainer.appendChild(course.container);
    }

    _deleteCourse(id) {
        const courseToDelete = this.courses[id];
        if (courseToDelete) {
            courseToDelete.container.remove();
            delete this.courses[id];
        }
    }

    _editCourse(course) {
        this._deleteCourse(course.id);
        this._addCourse(course);
    }

    // Render new schedule in the container
    render({ name, semesters, courses, }) {
        this._reset();
        
        const nameHeader = document.createElement('h1');
        nameHeader.textContent = name;
        this.container.appendChild(nameHeader);

        const semestersContainer = document.createElement('div');
        semestersContainer.id = 'semesters';
        this.container.appendChild(semestersContainer);

        this._addSemester({ id: 'misc', name: 'Misc.', });
        this.semesterAddContainer = document.createElement('div');
        this.semesterAddContainer.id = 'semester-add';
        this.semesterAddContainer.classList.add('semester', 'add');
        this.semesterAddContainer.addEventListener(
            'click', this._addDraftSemester.bind(this));
        semestersContainer.appendChild(this.semesterAddContainer);
        semesters.forEach(this._addSemester.bind(this));
        courses.forEach(this._addCourse.bind(this));

        this.initialized = true;
    }

    // Update components of the schedule
    update(operation, data) {
        const updateFns = {
            addCourse: this._addCourse,
            deleteCourse: this._deleteCourse,
            editCourse: this._editCourse,
            addSemester: this._addSemester,
            deleteSemester: this._deleteSemester
        }
        const f = updateFns[operation];
        if (!f) {
            return console.error(`Invalid operation: ${operation}`);
        }
        f.call(this, data);
    }
}

export { ScheduleView };