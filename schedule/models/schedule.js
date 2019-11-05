class ScheduleModel {

    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    async createSchedule({ name = '', } = {}) {
        const response = await fetch(`${this.baseUrl}/schedules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name})
        });
        console.log(response);
        if (!response.ok) return;
        for (const [key, value] in response.headers.entries()) {
            console.log(`${key}: ${value}`);
        }
        const location = response.headers.get('location');
        const schedule = await fetch(`${this.baseUrl}${location}`);
        if (!schedule.ok) return;
        return await schedule.json();
    }

    getCourse(id) {
        return this._schedule.courses.find((course) => {
            return course.id === id;
        });
    }

    addCourse({ subject, number, semester, }) {
        const id = this._counts.course;
        this._counts.course += 1;
        this._schedule.courses.push({ id, subject, number, semester});
        return this.getCourse(id);
    }

    deleteCourse(id) {
        this._schedule.courses = this._schedule.courses.filter((course) => {
            return course.id !== id;
        });
        return id;
    }

    editCourse(id, { semester, }) {
        this._schedule.courses = this._schedule.courses.map((course) => {
            if (course.id === id) {
                course.semester = semester;
            }
            return course;
        });
        return this.getCourse(id);
    }

    getSemester(id) {
        return this._schedule.semesters.find((semester) => {
            return semester.id === id;
        });
    }

    addSemester({ name, }) {
        const id = this._counts.semester;
        this._counts.semester += 1;
        this._schedule.semesters.push({ id, name, });
        return this.getSemester(id);
    }

    deleteSemester(id) {
        this._schedule.semesters = this._schedule.semesters.filter((semester) => {
            return semester.id !== id;
        });
        return id;
    }
}

export { ScheduleModel };