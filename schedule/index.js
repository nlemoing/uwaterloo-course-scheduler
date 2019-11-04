import { EventBus } from './eventBus.js';
import { ScheduleModel } from './models/schedule.js';
import { ScheduleView } from './scheduleView.js';
import { ScheduleController } from './scheduleController.js';
import { CourseModel } from './models/course.js';

const container = document.getElementById('schedule');
const model = new ScheduleModel();
const eventBus = new EventBus();
const courseModel = new CourseModel();
const view = new ScheduleView({ container, eventBus, courseModel, });
const controller = new ScheduleController({ view, model, eventBus });

controller.create({
    name: "My schedule"
});