module.exports = function (model) {
    return {
        getCourse: async (request, h) => {
            const { courseId } = request.params;
            const course = await model.getCourse(courseId);
            return h.response(course);
        },
        getSubjects: async (request, h) => {
            const subjects = await model.getSubjects();
            return h.response(subjects);
        },
        getCoursesForSubject: async (request, h) => {
            const { subjectId } = request.params;
            const courses = await model.getCoursesForSubject(subjectId);
            return h.response(courses);
        }
    }
}