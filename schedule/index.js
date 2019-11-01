class ScheduleModel {
    
    get schedule() {
        return this._schedule;
    }

    create({ name = '', semesters = [], courses = [], } = {}) {
        this._schedule = { name, semesters, courses, }
    }

    getCourse(id) {
        return this._schedule.courses.find((course) => {
            return course.id === id;
        });
    }

    addCourse({ id, subject, number, semester, }) {
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

    addSemester({ id, name, }) {
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

    _addSemester(semester) {
        const { id, name } = semester;
        const semesterContainer = document.createElement('div');
        semesterContainer.id = `semester-${id}`;
        semesterContainer.classList.add('semester');
        
        const semesterHeader = document.createElement('h2');
        semesterHeader.textContent = name;
        semesterContainer.appendChild(semesterHeader);

        if (id !== 'misc') {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'delete';
            deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletesemester', id); });
            semesterContainer.appendChild(deleteButton);
        }

        this.semesters[id] = semesterContainer;
        const semestersContainer = document.getElementById('semesters');
        semestersContainer.appendChild(semesterContainer);
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
        courseContainer.appendChild(deleteButton);

        // Make course container draggable
        courseContainer.addEventListener('mousedown', (evt) => this._dragCourse(id, evt));
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
    name: "My schedule",
    semesters: [
        { id: 1, name: "1A", },
        { id: 2, name: "1B", },
        { id: 3, name: "2A", },
        { id: 4, name: "2B", },
        { id: 5, name: "3A", },
        { id: 6, name: "3B", },
        { id: 7, name: "4A", },
        { id: 8, name: "4B", },    
    ],
    courses: [
        { id: 1, subject: 'MATH', number: '135', semester: 1, },
        { id: 2, subject: 'FUTURE', number: 'COURSE' }
    ]
});

controller.addCourse({ id: 3, subject: 'ECON', number: '101' });