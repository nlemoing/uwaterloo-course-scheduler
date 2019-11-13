import API from '../util/api.js';

let subjects = null;
const coursesForSubject = {};

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
    if (!(subjectId in coursesForSubject)) {
        const courses = await API(`/subjects/${subjectId}/courses`);
        if (!courses.ok) {
            return [];
        }
        coursesForSubject[subjectId] = await courses.json();
    }
    return coursesForSubject[subjectId];
}

async function getCourse(courseId) {
    const course = await API(`/courses/${courseId}`);
    if (!course.ok) {
        return null;
    }
    return await course.json();
}

export { getSubjects, getCoursesForSubject, getCourse };