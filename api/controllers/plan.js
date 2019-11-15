
const Boom = require('@hapi/boom');

module.exports = function(planModel) {
    return {
        getForSchedule: async (request, h) => {
            const { schedule } = request.pre;
            if (!schedule.plans) {
                return [];
            }
            const planReqs = await planModel.getRequirementsForPlans(schedule.plans);
            if (!planReqs) {
                throw Boom.notFound();
            }
            return h.response(planReqs);
        }
    }
}