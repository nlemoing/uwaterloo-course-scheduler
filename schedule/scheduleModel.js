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

export { ScheduleModel };