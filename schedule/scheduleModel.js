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
        this._subjects = [
            { id: 1, name: "ECON", },
            { id: 2, name: "MATH", },
        ]
        this._courses = [
            { id: 1, subject: 1, number: "101", longName: "Introduction to Microeconomics", },
            { id: 2, subject: 1, number: "102", longName: "Introduction to Macroeconomics", },
            { id: 3, subject: 1, number: "135", longName: "Algebra for Honours Mathematics"},
            { id: 4, subject: 1, number: "137", longName: "Calculus 1 for Honours Mathematics"},
        ]
    }

    get subjects() {
        return this._subjects;
    }

    coursesForSubject(subjectId) {
        const subject = this._subjects.find((subject) => {
            subject.id = subjectId;
        });
        return this._courses.filter((course) => {
            return course.subject === subjectId;
        }).map((course) => {
            course.subject = subject;
            return course;
        })
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

export { ScheduleModel };