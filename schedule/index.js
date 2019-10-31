class ScheduleModel {
    
    get schedule() {
        return this._schedule;
    }

    create({ name, semesters, courses, }) {
        name = name || '';
        semesters = semesters || [];
        courses = courses || [];
        this._schedule = { name, semesters, courses, }
    }

    addCourse({ subject, number, semester, }) {
        this.courses.push({ subject, number, semester});
    }

    deleteCourse(id) {
        if (id in this.courses) {
            delete this.courses[id];
        }
    }

    editCourse(id, { semester, }) {
        if (id in this.courses) {
            this.courses[id].semester = semester;
        }
    }
}

class ScheduleView {
    constructor({ container, eventBus, }) {
        this.container = container;
        this.eventBus = eventBus;

        this._reset();
    }

    _reset() {
        this.container.innerHTML = '';
        this.initialized = false;
    }

    // Render new schedule in the container
    render({ name, semesters, }) {
        this._reset();
        
        const nameHeader = document.createElement('h1');
        nameHeader.textContent = name;
        this.container.appendChild(nameHeader);

        for (const id in semesters) {
            const { name, } = semesters[id];
            const semesterContainer = document.createElement('div');
            semesterContainer.id = `semester-{id}`;
            semesterContainer.classList.add('semester');
            
            const semesterHeader = document.createElement('h2');
            semesterHeader.textContent = name;
            semesterContainer.appendChild(semesterHeader);
        
            this.container.appendChild(semesterContainer);
        }

        this.initialized = true;
    }

    // When components are created, attach the relevant DOM listeners that dispatch eventBus events

    // Update components of the schedule
    update() {

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
    }

    create(schedule) {
        this.model.create(schedule);
        this.view.render(this.model.schedule);
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
        { name: "1A", },
        { name: "1B", },
        { name: "2A", },
        { name: "2B", },
        { name: "3A", },
        { name: "3B", },
        { name: "4A", },
        { name: "4B", },    
    ],
});