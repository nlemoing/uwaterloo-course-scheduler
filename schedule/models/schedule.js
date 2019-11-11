import API from '../util/api.js';

async function getSchedules() {
    const response = await API('/schedules');
    if (!response.ok) return;
    return await response.json();
}

async function getSchedule(scheduleId) {
    const response = await API(`/schedules/${scheduleId}`);
    if (!response.ok) return;
    return await response.json();
}

async function createSchedule({ name = '', } = {}) {
    const response = await API('/schedules', {
        method: 'POST',
        body: JSON.stringify({ name })
    });
    if (!response.ok) return;
    const location = response.headers.get('location');
    const schedule = await API(location);
    if (!schedule.ok) return;
    return await schedule.json();
}

async function deleteSchedule(id) {
    const response = await API(`/schedules/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) return;
    return id;
}

async function getCourse(scheduleId, id) {
    const response = await API(`/schedules/${scheduleId}/courses/${id}`);
    if (!response.ok) return;
    return await response.json();
}

async function addCourse(scheduleId, { courseId, semesterId, }) {
    const response = await API(`/schedules/${scheduleId}/courses`, {
        method: 'POST',
        body: JSON.stringify({ courseId, semesterId })
    });
    if (!response.ok) return;
    const location = response.headers.get('location');
    const course = await API(location);
    if (!course.ok) return;
    return await course.json();
}

async function deleteCourse(scheduleId, id) {
    const response = await API(`/schedules/${scheduleId}/courses/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) return;
    return id;
}

async function editCourse(scheduleId, id, { semesterId, }) {
    const response = await API(`/schedules/${scheduleId}/courses/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ semesterId })
    });
    if (!response.ok) return;
    return await response.json();
}

async function getSemester(scheduleId, id) {
    const response = await API(`/schedules/${scheduleId}/semesters/${id}`);
    if (!response.ok) return;
    return await response.json();
}

async function addSemester(scheduleId, { name, }) {
    const response = await API(`/schedules/${scheduleId}/semesters`, {
        method: 'POST',
        body: JSON.stringify({ name })
    });
    if (!response.ok) return;
    const location = response.headers.get('location');
    const semester = await API(location);
    if (!semester.ok) return;
    return await semester.json();
}

async function deleteSemester(scheduleId, id) {
    const response = await API(`/schedules/${scheduleId}/semesters/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) return;
    return id;
}

export {
    getSchedules,
    getSchedule,
    createSchedule,
    deleteSchedule,
    getCourse,
    addCourse,
    deleteCourse,
    editCourse,
    getSemester,
    addSemester,
    deleteSemester
};