import { EventBus } from './eventBus.js';
import { ScheduleModel } from './models/schedule.js';
import { View } from './view.js';
import { ScheduleController } from './scheduleController.js';

const eventBus = new EventBus();
const container = document.getElementById('root');
const view = new View({ container, eventBus });
const model = new ScheduleModel();
const controller = new ScheduleController({ view, model, eventBus });

controller.create({
    name: "My schedule"
});

for (const key in eventBus._listeners) {
    eventBus.on(key, (...args) => { console.log('Event: ', key, ...args) });
}