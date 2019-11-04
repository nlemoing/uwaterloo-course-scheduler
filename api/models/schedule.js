class ScheduleModel {

    constructor() {
        this._counts = {
            schedules: 1, semesters: 1, courses: 1
        };
        this._schedules = [];
        this._semesters = [];
        this._courses = [];
    }

    getSchedules() {
        return this._schedules;
    }

    getSchedule(id) {
        const schedule = this._schedules.find(s => s.id === id);
        if (!schedule) {
            return;
        }
        schedule.courses = this._courses.filter(c => c.scheduleId === id);
        schedule.semesters = this._semesters.filter(s => s.scheduleId === id);
        return schedule;
    }

    addSchedule({ name, }) {
        const id = this._counts.schedules;
        this._schedules.push({ id, name });
        this._counts.schedules += 1;
        return id;
    }

    addSemester({ name, scheduleId }) {
        const id = this._counts.semesters;
        this._semesters.push({ id, name, scheduleId});
        this._counts.semesters += 1;
        return id;
    }

    addCourse({ subject, number, scheduleId, semesterId, }) {
        const id = this._counts.coures;
        this._courses.push({ id, subject, number, scheduleId, semesterId });
        this._counts.courses += 1;
        return id;
    }

    deleteSchedule(id) {
        this._schedules = this._schedules.filter(s => s.id !== id);
        this._courses = this._courses.filter(c => c.scheduleId !== id);
        this._semesters = this._semesters.filter(s => s.scheduleId !== id);
    }

    deleteSemester(id) {
        this._semesters = this._semesters.filter(s => s.id !== id);
        this._courses = this._courses.filter(c => c.semesterId !== id);
    }

    deleteCourse(id) {
        this._courses = this._courses.filter(c => c.id !== id);
    }
}