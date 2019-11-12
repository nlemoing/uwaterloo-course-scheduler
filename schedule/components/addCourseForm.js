import { getSubjects, getCoursesForSubject } from '../models/course.js';
import { CancelButton, SubmitButton } from './button.js';
import { addCourse } from '../models/schedule.js';

class AddCourseForm {
    constructor(semester, eventBus) {
        this.semester = semester;
        this.eventBus = eventBus;

        // Subject is changed when the update form's value is changed.
        this._subject = null;
        this._course = null;
        this.numbersBySubject = {};

        // Form container
        this.form = document.createElement('form');
        this.form.classList.add('add-course');
        // Start the form hidden
        this.hide();

        // Course subject input
        this.courseSubjectInput = document.createElement('select');
        this.courseSubjectInput.name = 'subject';
        // Add each subject as an option of the dropdown when loaded
        this._loadSubjects();
        this.courseSubjectInput.addEventListener('input', (evt) => {
            this.subject = evt.target.value;
        });
        this.form.appendChild(this.courseSubjectInput);

        // Course number input
        this.courseNumberInput = document.createElement('select');
        this.courseNumberInput.name = 'number';
        this.courseNumberInput.addEventListener('input', (evt) => { 
            this.course = evt.target.value; 
        });
        this.form.appendChild(this.courseNumberInput);

        // Separator div
        const separator = document.createElement('div');
        separator.classList.add('separator');
        this.form.appendChild(separator);
        
        // Submit button
        const submit = new SubmitButton('Add course');
        this.form.appendChild(submit.container);

        // Cancel button
        const cancel = new CancelButton('Cancel', this.reset.bind(this));
        this.form.appendChild(cancel.container);

        this.form.addEventListener('submit', this.submit.bind(this));
    }

    set subject(value) {
        this._subject = this.subjects.find(subject => subject.abbreviation === value);
        this._loadCourses();
    }

    get subject() {
        return this._subject;
    }

    set course(value) {
        if (!this.subject) {
            this._course = null;
            return;
        }
        const subjectId = this.subject.id;
        const courses = this.numbersBySubject[subjectId];
        if (!courses) {
            this._course = null;
            return;
        }
        this._course = courses.find(course => course.number === value);
    }

    get course() {
        return this._course;
    }

    async _loadSubjects() {
        this.subjects = await getSubjects();
        let option;
        for (const subject of this.subjects) {
            option = document.createElement('option');
            option.value = option.text = subject.abbreviation;
            this.courseSubjectInput.appendChild(option);
        }
        // Set the current subject to whatever value is selected
        this.subject = this.courseSubjectInput.value;
    }

    async _loadCourses() {
        // Remove any existing options
        this.courseNumberInput.innerHTML = '';
        if (!this.subject) return;
        const subjectId = this.subject.id;
        if (!(subjectId in this.numbersBySubject)) {
            this.numbersBySubject[subjectId] = 
                await getCoursesForSubject(subjectId);
        }
        const courses = this.numbersBySubject[subjectId];
        let option;
        for (const course of courses) {
            option = document.createElement('option');
            option.value = option.text = course.number;
            this.courseNumberInput.appendChild(option);
        }
        this.course = this.courseNumberInput.value;
    }

    async submit(e) {
        e.preventDefault();
        const scheduleId = this.semester.scheduleId;
        const semesterId = this.semester.id !== 'misc' ?
            this.semester.id : undefined;
        const courseId = this.course.id;
        const course = await addCourse(scheduleId, { courseId, semesterId });
        if (!course) {
            this.eventBus.dispatch('error', { message: 'Unable to add course' });
            return;
        }
        this.eventBus.dispatch('addcourse', course);
    }

    get container() {
        return this.form;
    }

    reset() {
        this.hide();
        this.form.reset();
        this.subject = this.courseSubjectInput.value;
        this.course = this.courseNumberInput.value;
    }

    show() {
        this.form.classList.remove('hidden');
    }

    hide() {
        this.form.classList.add('hidden');
    }
}

export { AddCourseForm };