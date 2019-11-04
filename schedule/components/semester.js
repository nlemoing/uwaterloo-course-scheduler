import { AddCourseForm } from './addCourseForm.js';

class Semester {
    constructor(semester, eventBus, courseModel) {
        this.semester = semester;
        this.eventBus = eventBus;
        this.courseModel = courseModel;

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
        if (id !== 'misc' && id !== 'draft') {
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'delete';
            deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletesemester', id); });
            this.container.appendChild(deleteButton);
        }
        
        // Add course form
        if (id !== 'draft') {
            const form = new AddCourseForm(semester, this.eventBus, this.courseModel);
            const addButton = document.createElement('button');
            addButton.innerText = 'add';
            addButton.addEventListener('click', () => { form.show(); });
            this.container.appendChild(addButton);
            this.container.appendChild(form.container);
        }

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

export { Semester };