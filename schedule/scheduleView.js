import { AddCourseForm } from './components/addCourseForm.js';
import { Course } from './components/course.js';

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

    _addSemester(semester) {
        const { id, name } = semester;
        const semesterContainer = document.createElement('div');
        semesterContainer.id = `semester-${id}`;
        semesterContainer.classList.add('semester');
        
        const semesterHeader = document.createElement('h2');
        semesterHeader.textContent = name;
        semesterContainer.appendChild(semesterHeader);

        if (id !== 'misc' && id !== 'draft') {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'delete';
            deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletesemester', id); });
            semesterContainer.appendChild(deleteButton);
        }
        
        if (id !== 'draft') {
            const form = new AddCourseForm(semester, this.eventBus, this.courseModel);
            const addButton = document.createElement('button');
            addButton.innerText = 'add';
            addButton.addEventListener('click', () => { form.show(); });
            semesterContainer.appendChild(addButton);
            semesterContainer.appendChild(form.container);
        }

        this.semesters[id] = semesterContainer;
        const semestersContainer = document.getElementById('semesters');
        semestersContainer.insertBefore(semesterContainer, this.semesterAddContainer);
        return semesterContainer;
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
        const semesterToDelete = document.getElementById(`semester-${id}`);
        if (semesterToDelete) {
            semesterToDelete.remove();
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

    _dragCourse(id, container, evt) {
        const x = evt.clientX - container.offsetLeft;
        const y = evt.clientY - container.offsetTop;
        document.onmousemove = (e) => {
            const { clientX, clientY } = e;
            const semester = this._getSemesterFromCoordinates(clientX, clientY);
            if (semester && this.semesters[semester] !== this.highlightedSemester) {
                if (this.highlightedSemester) {
                    this.highlightedSemester.classList.remove('highlighted');
                }
                this.highlightedSemester = this.semesters[semester];
                this.highlightedSemester.classList.add('highlighted');
            }
            container.style.position = 'absolute';
            container.style.left = `${clientX - x}px`;
            container.style.top = `${clientY - y}px`;
        }
        document.onmouseup = (e) => {
            if (this.highlightedSemester) {
                this.highlightedSemester.classList.remove('highlighted');
            }
            const { clientX, clientY } = e;
            const semester = this._getSemesterFromCoordinates(clientX, clientY);
            if (semester) {
                this.eventBus.dispatch('editcourse', id, { semester, });
            }
            container.style.position = 'static';
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    _getSemesterFromCoordinates(x, y) {
        for (const semester in this.semesters) {
            const { 
                left, top, right, bottom
            } = this.semesters[semester].getBoundingClientRect();
            if (x >= left && x <= right && y >= top && y <= bottom) {
                return semester;
            }
        }
        return null;
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