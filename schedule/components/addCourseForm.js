import { CourseModel } from '../models/course.js';

class AddCourseForm {
    constructor(semester, eventBus) {
        this.semester = semester;
        this.eventBus = eventBus;
        this.courseModel = new CourseModel();

        // Subject is changed when the update form's value is changed.
        this._subject = null;
        this.numbersBySubject = {};

        // Form container
        this.form = document.createElement('form');
        this.form.classList.add('add-course');
        // Start the form hidden
        this.hide();

        // Course subject input
        this.courseDropDown = document.createElement('select');
        this.courseDropDown.name = 'subject';
        // Add each subject as an option of the dropdown when loaded
        this._loadSubjects();
        this.courseDropDown.addEventListener('input', (evt) => {
            this.subject = evt.target.value;
        });
        this.form.appendChild(this.courseDropDown);

        // Course number input
        const courseNumberInput = document.createElement('input');
        courseNumberInput.name = 'number';
        courseNumberInput.classList.add('course-number-input');
        courseNumberInput.addEventListener('input', (evt) => { this.updateLongName(evt.target.value); });
        this.form.appendChild(courseNumberInput);

        // Course long name (if present)
        this.courseLongName = document.createElement('span');
        this.courseLongName.classList.add('course-long-name');
        this.form.appendChild(this.courseLongName);
        
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

    set subject(value) {
        this._subject = this.subjects.find(subject => subject.name === value);
    }

    get subject() {
        return this._subject;
    }

    async _loadSubjects() {
        this.subjects = await this.courseModel.getSubjects();
        let option;
        for (const subject of this.subjects) {
            option = document.createElement('option');
            option.value = option.text = subject.name;
            this.courseDropDown.appendChild(option);
        }
        // Set the current subject to whatever value is selected
        this.subject = this.courseDropDown.value;
    }

    async updateLongName(number) {
        if (!this.subject) return;
        const subjectId = this.subject.id
        if (!(subjectId in this.numbersBySubject)) {
            this.numbersBySubject[subjectId] = 
                await this.courseModel.getNumbersForSubject(subjectId);
        }
        const numbers = this.numbersBySubject[subjectId];
        const course = numbers.find((n) => {
            return n.number === number;
        });
        const longName = course ? course.longName : '';
        this.courseLongName.innerText = longName;
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
        this.subject = this.courseDropDown.value;
        this.courseLongName.innerText = '';
    }

    show() {
        this.form.classList.remove('hidden');
    }

    hide() {
        this.form.classList.add('hidden');
    }
}

export { AddCourseForm };