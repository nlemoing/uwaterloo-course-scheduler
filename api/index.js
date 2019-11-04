const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const logger = require('./logger.js');

const CourseController = require('./controllers/course.js');
const CourseModel = require('./models/course.js');

const course = CourseController(new CourseModel);

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
        }
    ]);

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();
