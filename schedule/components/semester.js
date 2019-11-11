import { AddCourseForm } from './addCourseForm.js';
import { DeleteButton, AddButton } from './button.js';
import { deleteSemester, editCourse, } from '../models/schedule.js';

class Semester {
    constructor(semester, eventBus) { 
        this.semester = semester;
        this.eventBus = eventBus;

        // Main container
        const { id, scheduleId, name, } = this.semester;
        this.container = document.createElement('div');
        this.container.id = id ? `semester-${id}` : 'semester-misc';
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
        if (id) {
            const deleteButton = new DeleteButton(
                'Delete semester',
                this.delete.bind(this),
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

    async delete() {
        let { scheduleId, id } = this.semester;
        id = await deleteSemester(scheduleId, id);
        if (!id) {
            this.eventBus.dispatch('error', { message: 'Unable to delete semester' });
            return;
        }
        this.eventBus.dispatch('deletesemester', id);
        this.container.remove();
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

    async courseDrop(course, coords) {
        this.container.classList.remove('highlighted');
        const { id, scheduleId } = this.semester;
        // If the drop doesn't affect the current semester, don't do anything
        if (!this.containsCoordinates(coords) || course.semesterId === id) {
            return;
        }
        const semesterId = id !== 'misc' ? id : undefined;
        course = await editCourse(scheduleId, course.id, { semesterId });
        if (!course) {
            this.eventBus.dispatch('error', { message: 'Unable to edit course' });
            return;
        }
        this.eventBus.dispatch('editcourse', course);
    }

    addCourse(course) {
        this.courseContainer.appendChild(course.container);
    }
}

export { Semester };