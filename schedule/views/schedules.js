import { Schedule } from '../components/schedule.js';
import { AddableList } from '../components/addableList.js';

class SchedulesView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.schedules = {};

        // Main container
        this.container = document.createElement('div');
        this.container.id = 'schedules-view';

        // Header
        this.header = document.createElement('h1');
        this.header.textContent = 'Schedules';
        this.container.appendChild(this.header);

        this.schedulesList = new AddableList(
            'schedules',
            (name) => { this.eventBus.dispatch('addschedule', { name }) },
            'Add schedule'
        );
        this.container.appendChild(this.schedulesList.container);
    }

    _reset() {
        for (const scheduleId in this.schedules) {
            this.deleteSchedule(scheduleId);
        }
    }

    render(schedules, container) {
        this._reset();
        
        schedules.forEach(this.addSchedule.bind(this));

        if (container) {
            container.appendChild(this.container);
        }
    }

    addSchedule(scheduleInfo) {
        const schedule = new Schedule(scheduleInfo, this.eventBus);
        this.schedules[scheduleInfo.id] = schedule;
        this.schedulesList.add(schedule.container);
    }

    deleteSchedule(id) {
        if (id in this.schedules) {
            this.schedules[id].container.remove();
            delete this.schedules[id];
        }
    }
}

export { SchedulesView }