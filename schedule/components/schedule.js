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
        const scheduleHeader = document.createElement('h2');
        scheduleHeader.textContent = name;
        this.container.appendChild(scheduleHeader);

        // Delete button
        const deleteButton = new DeleteButton(
            'Delete schedule',
            () => { this.eventBus.dispatch('deleteschedule', id); }
        );
        this.container.appendChild(deleteButton.container);

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

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class DraftSchedule {
    constructor(eventBus) {
        this.eventBus = eventBus;

        this.container = document.createElement('div');
        this.container.classList.add('schedule', 'draft');

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.addEventListener('focusout', this.submission.bind(this));
        this.input.addEventListener('keyup', this.escape.bind(this));
        this.container.appendChild(this.input);
    }

    submission() {
        const name = this.input.value;
        if (name) {
            this.eventBus.dispatch('addschedule', { name, });
        }
        this.container.remove();
    }

    escape({ keyCode, }) {
        if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
            this.input.blur();
        }
    }

    focus() {
        this.input.focus();
    }
}

export { DraftSchedule, Schedule }