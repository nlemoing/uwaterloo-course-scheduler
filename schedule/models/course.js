class CourseModel {
    constructor() {
        this._subjects = [
            { id: 1, name: "ECON", },
            { id: 2, name: "MATH", },
        ]
        this._courses = [
            { id: 1, subject: 1, number: "101", longName: "Introduction to Microeconomics", },
            { id: 2, subject: 1, number: "102", longName: "Introduction to Macroeconomics", },
            { id: 3, subject: 2, number: "135", longName: "Algebra for Honours Mathematics"},
            { id: 4, subject: 2, number: "137", longName: "Calculus 1 for Honours Mathematics"},
        ]
    }

    getSubjects() {
        return this._subjects;
    }

    getNumbersForSubject(subjectId) {
        return this._courses.filter((course) => {
            return course.subject === subjectId;
        });
    }
}

export { CourseModel };