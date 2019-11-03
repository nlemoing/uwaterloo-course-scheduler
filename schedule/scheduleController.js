class ScheduleController {
    constructor({ view, model, eventBus, }) {
        this.view = view;
        this.model = model;
        this._eventBus = eventBus;

        view.getSubjects = () => {
            return model.subjects;
        }
        view.getCoursesForSubject = (subjectId) => {
            return model.coursesForSubject(subjectId);
        } 

        this._bindEvents();
    }

    _bindEvents() {
        this._eventBus.on('createschedule', this.create.bind(this));
        this._eventBus.on('addcourse', this.addCourse.bind(this));
        this._eventBus.on('editcourse', this.editCourse.bind(this));
        this._eventBus.on('deletecourse', this.deleteCourse.bind(this));
        this._eventBus.on('addsemester', this.addSemester.bind(this));
        this._eventBus.on('deletesemester', this.deleteSemester.bind(this));
    }

    create(schedule) {
        this.model.create(schedule);
        this.view.render(this.model.schedule);
    }

    addCourse(course) {
        course = this.model.addCourse(course);
        this.view.update("addCourse", course);
    }

    deleteCourse(id) {
        id = this.model.deleteCourse(id);
        this.view.update("deleteCourse", id);
    }

    editCourse(id, params) {
        const course = this.model.editCourse(id, params);
        this.view.update("editCourse", course);
    }

    addSemester(semester) {
        semester = this.model.addSemester(semester);
        this.view.update("addSemester", semester);
    }

    deleteSemester(id) {
        id = this.model.deleteSemester(id);
        this.view.update("deleteSemester", id);
    }
}

export { ScheduleController };