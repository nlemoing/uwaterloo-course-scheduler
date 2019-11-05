import API from '../util/api.js';

class CourseModel {

    constructor() {
        this.subjects = null;
        this.numbersForSubject = {};
    }

    async getSubjects() {
        if (!this.subjects) {
            // If nothing is in the cache, fetch from the API
            const subjects = await API('/subjects');
            // If the request failed, return nothing (with potential to try again)
            if (!subjects.ok) {
                return [];
            }
            this.subjects = await subjects.json();
        }
        return this.subjects;
    }

    async getNumbersForSubject(subjectId) {
        if (!(subjectId in this.numbersForSubject)) {
            const courses = await API(`/subjects/${subjectId}/courses`);
            if (!courses.ok) {
                return [];
            }
            this.numbersForSubject[subjectId] = await courses.json();
        }
        return this.numbersForSubject[subjectId];
    }
}

export { CourseModel };