const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const logger = require('./logger.js');

const CourseController = require('./controllers/course.js');
const CourseModel = require('./models/course.js');

const ScheduleController = require('./controllers/schedule.js');
const ScheduleModel = require('./models/schedule.js');

const courseModel = new CourseModel();
const course = CourseController(courseModel);
const schedule = ScheduleController(new ScheduleModel(courseModel));

const init = async () => {
    const server = new Server({ 
        port: 3000, 
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                exposedHeaders: ['location'],
            },
        },
    });

    await server.register(logger);

    server.route([
        {
            method: 'GET',
            path: '/courses/{courseId}',
            handler: course.getCourse,
            options: {
                validate: {
                    params: Joi.object({
                        courseId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'GET',
            path: '/subjects',
            handler: course.getSubjects,
        },
        {
            method: 'GET',
            path: '/subjects/{subjectId}/courses',
            handler: course.getCoursesForSubject,
            options: {
                validate: {
                    params: Joi.object({
                        subjectId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'GET',
            path: '/schedules',
            handler: schedule.getSchedules,
        },
        {
            method: 'POST',
            path: '/schedules',
            handler: schedule.addSchedule,
            options: {
                validate: {
                    payload: Joi.object({
                        name: Joi.string()
                    })
                }
            }
        },
        {
            method: 'GET',
            path: '/schedules/{scheduleId}',
            handler: schedule.getSchedule,
            options: {
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'DELETE',
            path: '/schedules/{scheduleId}',
            handler: schedule.deleteSchedule,
            options: {
                pre: [
                    {
                        method: schedule.getSchedule,
                        assign: 'schedule'
                    }
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'POST',
            path: '/schedules/{scheduleId}/semesters',
            handler: schedule.addSemester,
            options: {
                pre: [
                    {
                        method: schedule.getSchedule,
                        assign: 'schedule',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number()
                    }),
                    payload: Joi.object({
                        name: Joi.string()
                    })
                },
            },
        },
        {
            method: 'GET',
            path: '/schedules/{scheduleId}/semesters/{semesterId}',
            handler: schedule.getSemester,
            options: {
                pre: [
                    {
                        method: schedule.getSchedule,
                        assign: 'schedule',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number(),
                        semesterId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'DELETE',
            path: '/schedules/{scheduleId}/semesters/{semesterId}',
            handler: schedule.deleteSemester,
            options: {
                pre: [
                    {
                        method: schedule.getSemester,
                        assign: 'semester',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number(),
                        semesterId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'POST',
            path: '/schedules/{scheduleId}/courses',
            handler: schedule.addCourse,
            options: {
                pre: [
                    {
                        method: schedule.getSchedule,
                        assign: 'schedule',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number()
                    }),
                    payload: Joi.object({
                        courseId: Joi.number(),
                        semesterId: Joi.number(),
                    })
                },
            },
        },
        {
            method: 'GET',
            path: '/schedules/{scheduleId}/courses/{courseId}',
            handler: schedule.getCourse,
            options: {
                pre: [
                    {
                        method: schedule.getSchedule,
                        assign: 'schedule',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number(),
                        courseId: Joi.number()
                    })
                },
            },
        },
        {
            method: 'PATCH',
            path: '/schedules/{scheduleId}/courses/{courseId}',
            handler: schedule.editCourse,
            options: {
                pre: [
                    {
                        method: schedule.getCourse,
                        assign: 'course',
                    },
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number(),
                        courseId: Joi.number()
                    }),
                    payload: Joi.object({
                        semesterId: Joi.number(),
                    })
                },
            },
        },
        {
            method: 'DELETE',
            path: '/schedules/{scheduleId}/courses/{courseId}',
            handler: schedule.deleteCourse,
            options: {
                pre: [
                    {
                        method: schedule.getCourse,
                        assign: 'course'
                    }
                ],
                validate: {
                    params: Joi.object({
                        scheduleId: Joi.number(),
                        courseId: Joi.number()
                    })
                },
            },
        },
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();
