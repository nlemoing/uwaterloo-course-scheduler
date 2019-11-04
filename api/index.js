const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const logger = require('./logger.js');

const CourseController = require('./controllers/course.js');
const CourseModel = require('./models/course.js');

const ScheduleController = require('./controllers/schedule.js');
const ScheduleModel = require('./models/schedule.js');

const course = CourseController(new CourseModel());
const schedule = ScheduleController(new ScheduleModel());

const init = async () => {
    const server = new Server({ 
        port: 3000, 
        host: 'localhost',
        routes: {
            cors: true,
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
                        subject: Joi.string(),
                        number: Joi.string(),
                        semesterId: Joi.number(),
                    })
                },
            },
        },
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();
