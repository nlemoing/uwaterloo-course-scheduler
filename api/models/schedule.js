const schedules = require('../../scraping/data/schedules.json');
const semesters = require('../../scraping/data/semesters.json');
const courses = require('../../scraping/data/schedule_courses.json');

const maxSchedule = Math.max(...schedules.map(s => s.id)) + 1;
const maxSemester = Math.max(...semesters.map(s => s.id)) + 1;
const maxCourse = Math.max(...courses.map(c => c.id)) + 1;

class ScheduleModel {

    constructor(courseModel) {
        this.courseModel = courseModel;
        this._counts = {
            schedules: maxSchedule, semesters: maxSemester, courses: maxCourse
        };
        this._schedules = schedules;
        this._semesters = semesters;
        this._courses = courses;
    }

    getSchedules() {
        return this._schedules;
    }

    getSchedule(id) {
        const schedule = this._schedules.find(s => s.id === id);
        if (!schedule) {
            return;
        }
        schedule.courses = this._courses.filter(c => c.scheduleId === id).map(c => this.getCourse(c.id));
        schedule.semesters = this._semesters.filter(s => s.scheduleId === id).map(s => this.getSemester(s.id));
        return schedule;
    }

    getSemester(id) {
        const semester = this._semesters.find(s => s.id === id);
        if (!semester) {
            return;
        }
        semester.courses = this._courses.filter(c => c.semesterId === id);
        return semester;
    }

    getCourse(id) {
        const course = this._courses.find(c => c.id === id);
        if (!course) return;
        course.info = this.courseModel.getCourse(course.courseId);
        return course;
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

    addCourse({ scheduleId, semesterId, courseId, }) {
        const id = this._counts.courses;
        this._courses.push({ id, scheduleId, semesterId, courseId, });
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

    editCourse(id, { semesterId, }) {
        this._courses = this._courses.map((course) => {
            if (course.id === id) {
                course.semesterId = semesterId;
            }
            return course;
        });
        return this.getCourse(id);
    }
}

module.exports = ScheduleModel;