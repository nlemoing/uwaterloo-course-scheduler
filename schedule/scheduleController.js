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

    async create(schedule) {
        schedule = await this.model.createSchedule(schedule);
        if (!schedule) {
            this.view.warning({ message: 'There was a problem creating the schedule. Please try again later.' });
        } else {
            this.schedule = schedule;
            this.view.render(schedule);
        }
    }

    async addCourse(course) {
        course = await this.model.addCourse(this.schedule.id, course);
        if (!course) {
            this.view.warning({ message: 'There was a problem adding that course. Please try again later.' });
        } else {
            this.view.addCourse(course);
        }
    }

    async deleteCourse(id) {
        id = await this.model.deleteCourse(this.schedule.id, id);
        if (!id) {
            this.view.warning({ message: 'There was a problem adding that course. Please try again later.' });
        } else {
            this.view.deleteCourse(id);
        }
    }

    async editCourse(id, params) {
        const course = await this.model.editCourse(this.schedule.id, id, params);
        if (!course) {
            this.view.warning({ message: 'There was a problem editing that course. Please try again later.' })
        } else {
            this.view.editCourse(course);
        }
    }

    async addSemester(semester) {
        semester = await this.model.addSemester(this.schedule.id, semester);
        if (!semester) {
            this.view.warning({ message: 'There was a problem adding that semester. Please try again later.' });
        } else {
            this.view.addSemester(semester);
        }
    }

    async deleteSemester(id) {
        id = await this.model.deleteSemester(this.schedule.id, id);
        if (!id) {
            this.view.warning({ message: 'There was a problem deleting that semester. Please try again later.' });
        } else {
            this.view.deleteSemester(id);
        }
    }
}

export { ScheduleController };