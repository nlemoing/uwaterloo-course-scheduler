class AddCourseForm {
    constructor(semester, eventBus, courseModel) {
        this.semester = semester;
        this.eventBus = eventBus;
        this.courseModel = courseModel;

        // Form container
        this.form = document.createElement('form');
        this.form.classList.add('add-course');
        // Start the form hidden
        this.hide();

        // Course subject input
        const courseDropDown = document.createElement('select');
        courseDropDown.name = 'subject';
        const subjects = this.courseModel.getSubjects();
        let option;
        for (const subject of subjects) {
            option = document.createElement('option');
            option.value = option.text = subject.name;
            courseDropDown.appendChild(option);
        }
        this.form.appendChild(courseDropDown);

        // Course number input
        const courseNumberInput = document.createElement('input');
        courseNumberInput.name = 'number';
        courseNumberInput.classList.add('course-number-input');
        this.form.appendChild(courseNumberInput);
        
        // Submit button
        const submit = document.createElement('input');
        submit.type = 'submit';
        this.form.appendChild(submit);

        // Cancel button
        const cancel = document.createElement('button');
        cancel.type = 'reset';
        cancel.innerText = 'Cancel';
        this.form.appendChild(cancel);

        this.form.addEventListener('submit', this.submit.bind(this));
        cancel.addEventListener('click', this.reset.bind(this));
    }

    submit(e) {
        e.preventDefault();
        const data = new FormData(this.form);
        const semester = this.semester.id !== 'misc' ?
            this.semester.id : undefined;
        const subject = data.get('subject');
        const number = data.get('number');
        this.eventBus.dispatch('addcourse', { subject, number, semester, });
        this.reset();
    }

    get container() {
        return this.form;
    }

    reset() {
        this.hide();
        this.form.reset();
    }

    show() {
        this.form.classList.remove('hidden');
    }

    hide() {
        this.form.classList.add('hidden');
    }
}

export { AddCourseForm };