import API from '../util/api.js';

let subjects = null;
const numbersForSubject = {};

async function getSubjects() {
    if (!subjects) {
        // If nothing is in the cache, fetch from the API
        const response = await API('/subjects');
        // If the request failed, return nothing (with potential to try again)
        if (!response.ok) {
            return [];
        }
        subjects = await response.json();
    }
    return subjects;
}

async function getCoursesForSubject(subjectId) {
    if (!(subjectId in numbersForSubject)) {
        const courses = await API(`/subjects/${subjectId}/courses`);
        if (!courses.ok) {
            return [];
        }
        numbersForSubject[subjectId] = await courses.json();
    }
    return numbersForSubject[subjectId];
}

export { getSubjects, getCoursesForSubject };