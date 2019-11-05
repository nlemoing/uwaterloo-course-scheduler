class Course {
    constructor(course, eventBus, ) {
        this.course = course;
        this.eventBus = eventBus;

        const { id, subject, number, } = this.course;
        // Main container
        this.container = document.createElement('div');
        this.container.id = `course-${id}`;
        this.container.innerText = `${subject} ${number}`;
        this.container.classList.add('course');

        // Add delete button and attach delete listener
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'delete';
        deleteButton.addEventListener('click', () => { this.eventBus.dispatch('deletecourse', id); });
        // Prevents clicking delete from triggering the drag event
        deleteButton.addEventListener('mousedown', (e) => { e.stopPropagation() });
        this.container.appendChild(deleteButton);

        // Make course container draggable
        this.container.addEventListener('mousedown', this.drag.bind(this));
    }

    drag(evt) {
        const { container } = this;
        const x = evt.clientX - container.offsetLeft;
        const y = evt.clientY - container.offsetTop;
        document.onmousemove = (e) => {
            const { clientX, clientY } = e;
            this.eventBus.dispatch('coursedrag', this.course.id, { clientX, clientY });
            container.style.position = 'absolute';
            container.style.left = `${clientX - x}px`;
            container.style.top = `${clientY - y}px`;
        }
        document.onmouseup = (e) => {
            if (this.highlightedSemester) {
                this.highlightedSemester.classList.remove('highlighted');
            }
            const { clientX, clientY } = e;
            this.eventBus.dispatch('coursedrop', this.course.id, { clientX, clientY });
            container.style.position = 'static';
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export { Course };