import { SchedulesView } from './views/schedules.js';
import { ScheduleView } from './views/schedule.js';
import { ScheduleModel } from './models/schedule.js';

class App {
    constructor(config) {
        const { eventBus, container } = config;
        this.eventBus = eventBus;
        this.container = container;
        this.schedulesView = new SchedulesView(eventBus);
        this.scheduleView = new ScheduleView(eventBus);
        this.scheduleModel = new ScheduleModel();
    }

    initialize() {
        this.bindEvents();
        const url = new URL(window.location);
        const params = url.searchParams;
        if (!isNaN(parseInt(params.get('scheduleId')))) {
            const scheduleId = parseInt(params.get('scheduleId'));
            this.loadSchedule(scheduleId);
        } else {
            this.loadSchedules();
        }
    }

    login(user) {
        console.log(user.getAuthResponse().id_token);
    }

    bindEvents() {
        this.eventBus.on('addschedule', this.createSchedule.bind(this));
        this.eventBus.on('deleteschedule', this.deleteSchedule.bind(this));
        this.eventBus.on('addcourse', this.addCourse.bind(this));
        this.eventBus.on('editcourse', this.editCourse.bind(this));
        this.eventBus.on('deletecourse', this.deleteCourse.bind(this));
        this.eventBus.on('addsemester', this.addSemester.bind(this));
        this.eventBus.on('deletesemester', this.deleteSemester.bind(this));
    }

    async loadSchedule(scheduleId) {
        const schedule = await this.scheduleModel.getSchedule(scheduleId);
        if (!schedule) {
            return this.notFound();
        }
        this.schedule = schedule;
        this.scheduleView.render(schedule, this.container);
    }

    async loadSchedules() {
        const schedules = await this.scheduleModel.getSchedules();
        if (!schedules) {
            return this.notFound();
        }
        this.schedules = schedules;
        this.schedulesView.render(schedules, this.container);
    }

    async createSchedule(schedule) {
        schedule = await this.scheduleModel.createSchedule(schedule);
        if (!schedule) {
            this.warning({ message: 'There was a problem creating the schedule. Please try again later.' });
        } else {
            this.schedulesView.addSchedule(schedule);
        }
    }

    async deleteSchedule(id) {
        id = await this.scheduleModel.deleteSchedule(id);
        if (!id) {
            this.warning({ message: 'There was a problem deleting the schedule. Please try again later.' });
        } else {
            this.schedulesView.deleteSchedule(id);
        }
    }

    async addCourse(course) {
        course = await this.scheduleModel.addCourse(this.schedule.id, course);
        if (!course) {
            this.warning({ message: 'There was a problem adding that course. Please try again later.' });
        } else {
            this.scheduleView.addCourse(course);
        }
    }

    async deleteCourse(id) {
        id = await this.scheduleModel.deleteCourse(this.schedule.id, id);
        if (!id) {
            this.warning({ message: 'There was a problem adding that course. Please try again later.' });
        } else {
            this.scheduleView.deleteCourse(id);
        }
    }

    async editCourse(id, params) {
        const course = await this.scheduleModel.editCourse(this.schedule.id, id, params);
        if (!course) {
            this.warning({ message: 'There was a problem editing that course. Please try again later.' })
        } else {
            this.scheduleView.editCourse(course);
        }
    }

    async addSemester(semester) {
        semester = await this.scheduleModel.addSemester(this.schedule.id, semester);
        if (!semester) {
            this.warning({ message: 'There was a problem adding that semester. Please try again later.' });
        } else {
            this.scheduleView.addSemester(semester);
        }
    }

    async deleteSemester(id) {
        id = await this.scheduleModel.deleteSemester(this.schedule.id, id);
        if (!id) {
            this.warning({ message: 'There was a problem deleting that semester. Please try again later.' });
        } else {
            this.scheduleView.deleteSemester(id);
        }
    }

    warning() {
        alert('warning not implemented!');
    }

    notFound() {
        alert('notFound not implemented!');
    }
}

export default App;