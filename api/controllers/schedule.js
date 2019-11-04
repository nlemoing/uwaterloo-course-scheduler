module.exports = function (model) {
    return {
        getSchedule: async (request, h) => {
            const { scheduleId } = request.params;
            const schedule = await model.getSchedule(scheduleId);
            if (!schedule) {
                return h.response('Not found').code(404)
            }
            return h.response(schedule);
        },
        addSchedule: async (request, h) => {
            const scheduleId = await model.addSchedule(request.payload);
            return h.response().created(`/schedules/${scheduleId}`);
        },
        addSemester: async (request, h) => {
            // Add schedule information to payload
            const scheduleId = request.pre.schedule.id;
            const body = request.payload;
            body.scheduleId = scheduleId;
            // Create course and get id back
            const semesterId = await model.addSemester(request.payload);
            return h.response().created(`/schedules/${scheduleId}/semesters/${semesterId}`);
        },
        addCourse: async (request, h) => {
            // Add schedule information to payload
            const scheduleId = request.pre.schedule.id;
            const body = request.payload;
            body.scheduleId = scheduleId;
            // Create course and get id back
            const courseId = await model.addSemester(body);
            return h.response().created(`/schedules/${scheduleId}/courses/${courseId}`);
        },
    }
}