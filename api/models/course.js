const courses = require('../../scraping/data/courses.json');
const subjects = require('../../scraping/data/subjects.json');

class CourseModel {
    constructor() {
        this._subjects = subjects;
        this._courses = courses;
    }

    getCourse(courseId) {
        return this._courses.find((course) => {
            return course.id === courseId;
        });
    }

    getSubjects() {
        return this._subjects;
    }

    getCoursesForSubject(subjectId) {
        return this._courses.filter((course) => {
            return course.subjectId === subjectId;
        });
    }
}

module.exports = CourseModel;