import { DeleteButton } from './button.js';
import { deleteCourse } from '../models/schedule.js';

class Course {
    constructor(course, eventBus, ) {
        this.course = course;
        this.eventBus = eventBus;

        const { id, scheduleId, info } = this.course;
        const { subject, number } = info;
        const { abbreviation, faculty } = subject;
        // Main container
        this.container = document.createElement('div');
        this.container.id = `course-${id}`;
        this.container.innerText = `${abbreviation} ${number}`;
        this.container.classList.add('course');
        let facultyClass;
        switch (faculty) {
            case 'AHS': facultyClass = 'ahs'; break;
            case 'ART': facultyClass = 'art'; break;
            case 'ENG': facultyClass = 'engineering'; break;
            case 'ENV': facultyClass = 'environment'; break;
            case 'MAT': facultyClass = 'math'; break;
            case 'SCI': facultyClass = 'science'; break;
        }
        this.container.classList.add(facultyClass);

        // Add delete button and attach delete listener
        const deleteButton = new DeleteButton(
            'Delete course',
            this.delete.bind(this),
            ['delete-course']
        )
        this.container.appendChild(deleteButton.container);

        // Make course container draggable
        this.container.addEventListener('mousedown', this.drag.bind(this));
    }

    async delete() {
        let { scheduleId, id } = this.course;
        id = await deleteCourse(scheduleId, id);
        if (!id) {
            this.eventBus.dispatch('error', { message: 'Unable to delete course' });
            return;
        }
        this.eventBus.dispatch('deletecourse', id);
        this.container.remove();
    }

    drag(evt) {
        const { container } = this;
        const x = evt.clientX - container.offsetLeft;
        const y = evt.clientY - container.offsetTop;
        document.onmousemove = (e) => {
            const { clientX, clientY } = e;
            this.eventBus.dispatch('coursedrag', this.course.id, { clientX, clientY });
            container.classList.add('dragging');
            container.style.left = `${clientX - x}px`;
            container.style.top = `${clientY - y}px`;
        }
        document.onmouseup = (e) => {
            if (this.highlightedSemester) {
                this.highlightedSemester.classList.remove('highlighted');
            }
            const { clientX, clientY } = e;
            this.eventBus.dispatch('coursedrop', this.course, { clientX, clientY });
            container.classList.remove('dragging');
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export { Course };