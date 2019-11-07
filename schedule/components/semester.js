import { AddCourseForm } from './addCourseForm.js';
import { DeleteButton, AddButton } from './button.js';

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
        const header = document.createElement('div');
        header.classList.add('semester-header');
        const title = document.createElement('h2');
        title.textContent = name;
        header.appendChild(title);
        const separator = document.createElement('div');
        separator.classList.add('separator');
        header.appendChild(separator);
        this.container.appendChild(header);

        // Small divider element
        const divider = document.createElement('div');
        divider.classList.add('header-divider');
        this.container.appendChild(divider);

        // Add course form
        const form = new AddCourseForm(semester, this.eventBus);
        const addButton = new AddButton(
            'Add a course',
            () => { form.show(); },
            ['add-course']
        );
        header.appendChild(addButton.container);
        this.container.appendChild(form.container);

        // Delete button with deletion event
        if (id !== 'misc') {
            const deleteButton = new DeleteButton(
                'Delete semester',
                () => { this.eventBus.dispatch('deletesemester', id) },
                ['delete-semester']
            );
            header.appendChild(deleteButton.container);
        }

        // Container for courses
        this.courseContainer = document.createElement('div');
        this.courseContainer.classList.add('course-container');
        this.container.appendChild(this.courseContainer);

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
            const semesterId = this.semester.id !== 'misc' ?
                this.semester.id : undefined;
            this.eventBus.dispatch('editcourse', id, { semesterId, });
        }
    }

    addCourse(course) {
        this.courseContainer.appendChild(course.container);
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