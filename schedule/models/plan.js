import API from '../util/api.js';

async function getPlans(scheduleId) {

    const response = await API(`/schedules/${scheduleId}/plans`);
    if (!response.ok) {
      return;
    }
    return await response.json();
}

export { getPlans }