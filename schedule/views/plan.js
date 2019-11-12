import { createRequirement } from '../components/requirement.js';

class PlanView {
    constructor(eventBus, containers) {
        this.eventBus = eventBus;
        this.containers = containers;
        this.plans = [];
        this.courses = [];
    }

    render(plans, courses) {
        this.courses = courses;
        plans.forEach((plan) => this.addPlan(plan));
        this.satisfy();
    }

    addPlan(plan) {
        this.plans.push(createRequirement(this.containers.body, plan));
    }

    satisfy() {
        this.plans.forEach(plan => plan.satisfy(this.courses));
    }
}

export { PlanView };