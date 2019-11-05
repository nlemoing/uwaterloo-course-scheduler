import { Schedule } from './components/schedule.js';

class View {
    constructor({ container, eventBus, }) {
        this.container = container;
        this.eventBus = eventBus;

        this._reset();
    }

    _reset() {
        this.container.innerHTML = '';
    }

    addCourse(course) {
        return this.schedule.addCourse(course);
    }

    deleteCourse(id) {
        return this.schedule.deleteCourse(id);
    }

    editCourse(course) {
        return this.schedule.editCourse(course);
    }

    addSemester(semester) {
        return this.schedule.addSemester(semester);
    }

    deleteSemester(id) {
        return this.schedule.deleteSemester(id);
    }

    // Render new schedule in the container
    render(schedule) {
        this._reset();
        this.schedule = new Schedule(schedule, this.eventBus);
        this.container.appendChild(this.schedule.container);
    }

    warning({ message }) {
        alert(message);
    }
}

export { View };