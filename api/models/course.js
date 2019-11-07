const courses = require('../../scraping/data/courses.json');
const subjects = require('../../scraping/data/subjects.json');

class CourseModel {
    constructor() {
        this._subjects = subjects;
        this._courses = courses;
    }

    getCourse(courseId) {
        const course = this._courses.find((course) => {
            return course.id === courseId;
        });
        if (!course) return;
        course.subject = this.getSubjects(subjectId);
        return course;
    }

    getSubjects() {
        return this._subjects;
    }

    getSubject(subjectId) {
        return this._subjects.find((subject) => {
            return subject.id === subjectId;
        });
    }

    getCoursesForSubject(subjectId) {
        return this._courses.filter((course) => {
            return course.subjectId === subjectId;
        });
    }
}

module.exports = CourseModel;