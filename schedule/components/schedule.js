import { DeleteButton } from './button.js';

class Schedule {
    constructor(schedule, eventBus) {
        this.schedule = schedule;
        this.eventBus = eventBus;

        // Main container
        const { id, name } = this.schedule;
        this.container = document.createElement('div');
        this.container.id = `schedule-${id}`;
        this.container.classList.add('schedule', 'clickable');

        // Header
        const header = document.createElement('div');
        header.classList.add('schedule-header');
        const title = document.createElement('h2');
        title.textContent = name;
        header.appendChild(title);
        const separator = document.createElement('div');
        separator.classList.add('separator');
        header.appendChild(separator);
        this.container.appendChild(header);

        // Delete button
        const deleteButton = new DeleteButton(
            'Delete schedule',
            () => { this.eventBus.dispatch('deleteschedule', id); },
            ['delete-schedule'],
        );
        header.appendChild(deleteButton.container);

        // Create link
        const link = document.createElement('a');
        link.href = `/?scheduleId=${id}`;
        const span = document.createElement('span');
        span.classList.add('clickable');
        link.appendChild(span);
        this.container.appendChild(link);

        this.container.addEventListener('click', () => { this.eventBus.dispatch('viewschedule', id); });
    }
}
export { Schedule }