class ScheduleModel {

    constructor() {
        this._counts = {
            course: 1, semester: 1,
        };
        this._schedule = {
            name: '',
            semesters: [],
            courses: [],
        };
    }
    
    get schedule() {
        return this._schedule;
    }

    create({ name = '', semesters = [], courses = [], } = {}) {
        this._schedule.name = name;
        semesters.forEach(this.addSemester.bind(this));
        courses.forEach(this.addCourse.bind(this));
    }

    getCourse(id) {
        return this._schedule.courses.find((course) => {
            return course.id === id;
        });
    }

    addCourse({ subject, number, semester, }) {
        const id = this._counts.course;
        this._counts.course += 1;
        this._schedule.courses.push({ id, subject, number, semester});
        return this.getCourse(id);
    }

    deleteCourse(id) {
        this._schedule.courses = this._schedule.courses.filter((course) => {
            return course.id !== id;
        });
        return id;
    }

    editCourse(id, { semester, }) {
        this._schedule.courses = this._schedule.courses.map((course) => {
            if (course.id === id) {
                course.semester = semester;
            }
            return course;
        });
        return this.getCourse(id);
    }

    getSemester(id) {
        return this._schedule.semesters.find((semester) => {
            return semester.id === id;
        });
    }

    addSemester({ name, }) {
        const id = this._counts.semester;
        this._counts.semester += 1;
        this._schedule.semesters.push({ id, name, });
        return this.getSemester(id);
    }

    deleteSemester(id) {
        this._schedule.semesters = this._schedule.semesters.filter((semester) => {
            return semester.id !== id;
        });
        return id;
    }
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class ScheduleView {
    constructor({ container, eventBus, }) {
        this.container = container;
        this.eventBus = eventBus;

        this._reset();
    }

    _reset() {
        this.semesters = {};
        this.courses = {};
        this.container.innerHTML = '';
        this.initialized = false;
    }

    _makeAddCourseForm(semester) {
        const form = document.createElement('form');
        form.classList.add('add-course');
        form.classList.add('hidden');

        const courseDropDown = document.createElement('select');
        courseDropDown.name = 'subject';
        let option;
        for (const subject of ['ECON', 'MATH']) {
            option = document.createElement('option');
            option.value = option.text = subject;
            courseDropDown.appendChild(option);
        }
        form.appendChild(courseDropDown);

        const courseNumberInput = document.createElement('input');
        courseNumberInput.name = 'number';
        courseNumberInput.style.width = '40px';
        form.appendChild(courseNumberInput);
        
        const submit = document.createElement('input');
        submit.type = 'submit';
        form.appendChild(submit);

        const cancel = document.createElement('button');
        cancel.type = 'reset';
        cancel.innerText = 'Cancel';
        form.appendChild(cancel);

        const reset = () => {
            form.classList.add('hidden');
            form.reset();
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const subject = data.get('subject');
            const number = data.get('number');
            this.eventBus.dispatch('addcourse', { subject, number, semester, });
            reset();
        });
        cancel.addEventListener('click', reset);

        return form;
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
            const form = this._makeAddCourseForm(id);
            const addButton = document.createElement('button');
            addButton.innerText = 'add';
            addButton.addEventListener('click', () => { form.classList.remove('hidden') });
            semesterContainer.appendChild(addButton);
            semesterContainer.appendChild(form);
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

    _addCourse(course) {
        const { id, subject, number, semester, } = course;
        
        const courseContainer = document.createElement('div');
        courseContainer.id = `course-${id}`;
        courseContainer.innerText = `${subject} ${number}`;
        courseContainer.classList.add('course');

        // Add delete button and attach listener
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'delete';
        deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletecourse', id); });
        // Prevents clicking delete from triggering the drag event
        deleteButton.addEventListener('mousedown', (e) => { e.stopPropagation() });
        courseContainer.appendChild(deleteButton);

        // Make course container draggable
        courseContainer.addEventListener('mousedown', (evt) => this._dragCourse(id, courseContainer, evt));
        this.courses[id] = courseContainer;

        const semesterContainer = 
            document.getElementById(`semester-${semester}`) ||
            document.getElementById('semester-misc');
        semesterContainer.appendChild(courseContainer);
    }

    _deleteCourse(id) {
        const courseToDelete = document.getElementById(`course-${id}`);
        if (courseToDelete) {
            courseToDelete.remove();
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

class ScheduleController {
    constructor({ view, model, eventBus, }) {
        this.view = view;
        this.model = model;
        this._eventBus = eventBus;

        this._bindEvents();
    }

    _bindEvents() {
        this._eventBus.on('createschedule', this.create.bind(this));
        this._eventBus.on('addcourse', this.addCourse.bind(this));
        this._eventBus.on('editcourse', this.editCourse.bind(this));
        this._eventBus.on('deletecourse', this.deleteCourse.bind(this));
        this._eventBus.on('addsemester', this.addSemester.bind(this));
        this._eventBus.on('deletesemester', this.deleteSemester.bind(this));
    }

    create(schedule) {
        this.model.create(schedule);
        this.view.render(this.model.schedule);
    }

    addCourse(course) {
        course = this.model.addCourse(course);
        this.view.update("addCourse", course);
    }

    deleteCourse(id) {
        id = this.model.deleteCourse(id);
        this.view.update("deleteCourse", id);
    }

    editCourse(id, params) {
        const course = this.model.editCourse(id, params);
        this.view.update("editCourse", course);
    }

    addSemester(semester) {
        semester = this.model.addSemester(semester);
        this.view.update("addSemester", semester);
    }

    deleteSemester(id) {
        id = this.model.deleteSemester(id);
        this.view.update("deleteSemester", id);
    }
}

class EventBus {
    constructor() {
        this._listeners = {};
    }

    on(eventName, listener) {
        if (!(eventName in this._listeners)) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(listener);
    }

    dispatch(eventName, ...args) {
        const listeners = this._listeners[eventName];
        if (!listeners || listeners.length === 0) {
            return;
        }
        listeners.slice(0).forEach((listener) => { 
            listener(...args);
        })
    }
}

const container = document.getElementById('schedule');
const model = new ScheduleModel();
const eventBus = new EventBus();
const view = new ScheduleView({ container, eventBus, });
const controller = new ScheduleController({ view, model, eventBus });

controller.create({
    name: "My schedule"
});