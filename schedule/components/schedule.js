class Schedule {
    constructor(schedule, eventBus) {
        this.schedule = schedule;
        this.eventBus = eventBus;

        // Main container
        const { id, name } = this.schedule;
        this.container = document.createElement('div');
        this.container.id = `schedule-${id}`;
        this.container.classList.add('schedule');

        // Header
        const scheduleHeader = document.createElement('h2');
        scheduleHeader.textContent = name;
        this.container.appendChild(scheduleHeader);

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'delete';
        deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deleteschedule', id); });
        this.container.appendChild(deleteButton);

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