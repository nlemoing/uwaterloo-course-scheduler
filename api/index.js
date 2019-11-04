const { Server } = require('@hapi/hapi');
const Joi = require('@hapi/joi');

const CourseController = require('./controllers/course.js');
const CourseModel = require('./models/course.js');

const course = CourseController(new CourseModel);

const init = async () => {
    const server = new Server({ port: 3000, host: 'localhost' });

    server.route([
        {
            method: 'GET',
            path: '/course/{courseId}',
            handler: course.getCourse,
            options: {
                validate: {
                    params: Joi.object({
                        courseId: Joi.number()
                    })
                }
            }
        },
        {
            method: 'GET',
            path: '/subject',
            handler: course.getSubjects
        },
        {
            method: 'GET',
            path: '/subject/{subjectId}/courses',
            handler: course.getCoursesForSubject,
            options: {
                validate: {
                    params: Joi.object({
                        subjectId: Joi.number()
                    })
                }
            }
        }
    ])

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

init();
