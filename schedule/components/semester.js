import { AddCourseForm } from './addCourseForm.js';

class Semester {
    constructor(semester, eventBus) {
        this.semester = semester;
        this.eventBus = eventBus;

        // Main container
        const { id, name, } = this.semester;
        this.container = document.createElement('div');
        this.container.id = `semester-${id}`;
        this.container.classList.add('semester');
        
        // Header
        const semesterHeader = document.createElement('h2');
        semesterHeader.textContent = name;
        this.container.appendChild(semesterHeader);

        // Delete button with deletion event
        if (id !== 'misc') {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'delete';
            deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletesemester', id); });
            this.container.appendChild(deleteButton);
        }
        
        // Add course form
        const form = new AddCourseForm(semester, this.eventBus);
        const addButton = document.createElement('button');
        addButton.innerText = 'add';
        addButton.addEventListener('click', () => { form.show(); });
        this.container.appendChild(addButton);
        this.container.appendChild(form.container);


        this.eventBus.on('coursedrag', this.courseDrag.bind(this));
        this.eventBus.on('coursedrop', this.courseDrop.bind(this));
    }

    containsCoordinates({ clientX, clientY }) {
        const x = clientX, y = clientY;
        const { left, top, right, bottom } = this.container.getBoundingClientRect();
        return x >= left && x <= right && y >= top && y <= bottom;
    }

    courseDrag(id, coords) {
        if (this.containsCoordinates(coords)) {
            this.container.classList.add('highlighted')
        } else {
            this.container.classList.remove('highlighted');
        }
    }

    courseDrop(id, coords) {
        this.container.classList.remove('highlighted');
        if (this.containsCoordinates(coords)) {
            const semester = this.semester.id;
            this.eventBus.dispatch('editcourse', id, { semester, });
        }
    }
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class DraftSemester {
    constructor(eventBus) {
        this.eventBus = eventBus;

        this.container = document.createElement('div');
        this.container.classList.add('semester', 'draft');

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.addEventListener('focusout', this.submission.bind(this));
        this.input.addEventListener('keyup', this.escape.bind(this));
        this.container.appendChild(this.input);
    }

    submission() {
        const name = this.input.value;
        if (name) {
            this.eventBus.dispatch('addsemester', { name, });
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

export { DraftSemester, Semester };