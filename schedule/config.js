import { EventBus } from './util/eventBus.js';

export default {
    eventBus: new EventBus(),
    containers: {
        mainView: {
            main: document.getElementById('schedule-view'),
            header: document.getElementById('schedule-title'),
        },
        plans: {
            main: document.getElementById('plan-view'),
            body: document.getElementById('plans-container')
        }
    }
}