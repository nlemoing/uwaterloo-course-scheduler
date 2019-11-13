import { createRequirement } from '../components/requirement.js';

class PlanView {
    constructor(eventBus, containers) {
        this.eventBus = eventBus;
        this.containers = containers;
        this.plans = [];
        this.courses = [];

        this.eventBus.on('addcourse', this.addCourse.bind(this));
        this.eventBus.on('deletecourse', this.deleteCourse.bind(this));
    }

    render(plans, courses) {
        this.courses = courses;
        plans.forEach((plan) => this.addPlan(plan));
        this.satisfy();
    }

    addPlan(plan) {
        this.plans.push(createRequirement(this.containers.body, plan));
    }

    addCourse(course) {
        this.courses.push(course);
        this.satisfy();
    }

    deleteCourse(id) {
        this.courses = this.courses.filter(course => course.id !== id);
        this.satisfy();
    }

    satisfy() {
        this.plans.forEach(plan => plan.satisfy(Array.from(this.courses)));
    }
}

export { PlanView };