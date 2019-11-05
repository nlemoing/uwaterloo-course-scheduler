import { DraftSchedule, Schedule } from '../components/schedule.js';

class SchedulesView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.schedules = {};

        // Main container outlines
        this.containers = {
            main: document.createElement('div'),
            header: document.createElement('h1'),
            schedules: document.createElement('div'),
            addSchedule: document.createElement('div')
        };
        this.containers.main.id = 'schedules-view';

        // Header
        this.containers.header.textContent = 'Schedules';
        this.containers.main.appendChild(this.containers.header);
        
        // Container for all schedules
        this.containers.schedules.id = 'schedules';
        this.containers.main.appendChild(this.containers.schedules);

        // Button for adding a schedule
        this.containers.addSchedule.classList.add('schedule', 'add');
        this.containers.addSchedule.addEventListener('click', this.addDraftSchedule.bind(this));
        this.containers.schedules.appendChild(this.containers.addSchedule);
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
            container.appendChild(this.containers.main);
        }
    }

    addSchedule(scheduleInfo) {
        const schedule = new Schedule(scheduleInfo, this.eventBus);
        this.schedules[scheduleInfo.id] = schedule;
        this.containers.schedules.insertBefore(schedule.container, this.containers.addSchedule);
    }

    deleteSchedule(id) {
        if (id in this.schedules) {
            this.schedules[id].container.remove();
            delete this.schedules[id];
        }
    }

    addDraftSchedule() {
        const draftSchedule = new DraftSchedule(this.eventBus);
        this.containers.schedules.insertBefore(draftSchedule.container, this.containers.addSchedule);
        draftSchedule.focus();
    }
}

export { SchedulesView }