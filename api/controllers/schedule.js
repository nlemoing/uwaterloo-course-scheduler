const Boom = require('@hapi/boom');

module.exports = function (model) {
    return {
        getSchedule: async (request, h) => {
            const { scheduleId } = request.params;
            const schedule = await model.getSchedule(scheduleId);
            if (!schedule) {
                throw Boom.notFound();
            }
            return h.response(schedule);
        },
        getSemester: async (request, h) => {
            const { scheduleId, semesterId } = request.params;
            const semester = await model.getSemester(semesterId);
            if (!semester || semester.scheduleId !== scheduleId) {
                throw Boom.notFound();
            }
            return h.response(semester);
        },
        getCourse: async (request, h) => {
            const { scheduleId, courseId } = request.params;
            const course = await model.getCourse(courseId);
            if (!course || course.scheduleId !== scheduleId) {
                throw Boom.notFound();
            }
            return h.response(course);
        },
        addSchedule: async (request, h) => {
            const scheduleId = await model.addSchedule(request.payload);
            return h.response().created(`/schedules/${scheduleId}`);
        },
        addSemester: async (request, h) => {
            // Add schedule information to payload
            const scheduleId = request.params.scheduleId;
            const body = request.payload;
            body.scheduleId = scheduleId;
            // Create course and get id back
            const semesterId = await model.addSemester(body);
            return h.response().created(`/schedules/${scheduleId}/semesters/${semesterId}`);
        },
        addCourse: async (request, h) => {
            // Add schedule information to payload
            const scheduleId = request.params.scheduleId;
            const body = request.payload;
            body.scheduleId = scheduleId;
            // Create course and get id back
            const courseId = await model.addCourse(body);
            return h.response().created(`/schedules/${scheduleId}/courses/${courseId}`);
        },
        deleteSchedule: async (request, h) => {
            const scheduleId = request.params.scheduleId;
            await model.deleteSchedule(scheduleId);
            return h.response();
        },
        deleteSemester: async (request, h) => {
            const semesterId = request.params.semesterId;
            await model.deleteSemester(semesterId);
            return h.response();
        },
        deleteCourse: async (request, h) => {
            const courseId = request.params.courseId;
            await model.deleteCourse(courseId);
            return h.response();
        },
        editCourse: async (request, h) => {
            const courseId = request.params.courseId;
            const semesterId = request.payload.semesterId;
            const course = await model.editCourse(courseId, { semesterId });
            return h.response(course);
        }
    }
}