import { ScheduleView } from './views/schedule.js';
import { PlanView } from './views/plan.js';
import { getSchedule } from './models/schedule.js';
import { getPlans } from './models/plan.js';

class App {
    constructor(config) {
        const { eventBus, containers } = config;
        this.eventBus = eventBus;
        
        this.scheduleView = new ScheduleView(eventBus, containers.mainView);
        this.planView = new PlanView(eventBus, containers.plans);
    }

    async initialize() {
        const url = new URL(window.location);
        const params = url.searchParams;
        if (!isNaN(parseInt(params.get('scheduleId')))) {
            const scheduleId = parseInt(params.get('scheduleId'));
            await this.loadSchedule(scheduleId);
        } else {
            this.notFound();
        }
    }

    async loadSchedule(scheduleId) {
        const schedule = await getSchedule(scheduleId);
        if (!schedule) {
            return this.notFound();
        }
        this.schedule = schedule;
        this.scheduleView.render(schedule);
        const plans = await getPlans(schedule.id);
        if (plans) {
            this.planView.render(plans, schedule.courses);
        }
    }

    warning() {
        alert('warning not implemented!');
    }

    notFound() {
        alert('notFound not implemented!');
    }
}

export default App;