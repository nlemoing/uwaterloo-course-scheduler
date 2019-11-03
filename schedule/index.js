import { EventBus } from './eventBus.js';
import { ScheduleModel } from './scheduleModel.js';
import { ScheduleView } from './scheduleView.js';
import { ScheduleController } from './scheduleController.js';

const container = document.getElementById('schedule');
const model = new ScheduleModel();
const eventBus = new EventBus();
const view = new ScheduleView({ container, eventBus, });
const controller = new ScheduleController({ view, model, eventBus });

controller.create({
    name: "My schedule"
});