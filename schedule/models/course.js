class CourseModel {

    async getSubjects() {
        const subjects = await fetch('http://localhost:3000/subjects');
        if (!subjects.ok) {
            return [];
        }
        return await subjects.json();
    }

    async getNumbersForSubject(subjectId) {
        const courses = await fetch(`http://localhost:3000/subjects/${subjectId}/courses`);
        if (!courses.ok) {
            return [];
        }
        return await courses.json();
    }
}

export { CourseModel };