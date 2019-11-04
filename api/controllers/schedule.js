module.exports = function (model) {
    return {
        getSchedule: async (request, h) => {
            const { scheduleId } = request.params;
            const schedule = await model.getSchedule(scheduleId);
            if (!schedule) {
                return h.response('Not found').code(404)
            }
            return h.response(course);
        },
        addSchedule: async (request, h) => {
            const scheduleId = await model.addSchedule(request.body);
            return h.response().location(`/schedules/${scheduleId}`);
        },
        addSemester: async (request, h) => {
            const schedule = request.pre.schedule;
            const semesterId = await model.addSemester(request.body);
            return h.response().location(`/schedules/${schedule.id}/semesters/${semesterId}`);
        },
        addCourse: async (request, h) => {
            const schedule = request.pre.schedule;
            const courseId = await model.addSemester(request.body);
            return h.response().location(`/schedules/${schedule.id}/courses/${courseId}`);
        },
    }
}