
class PlanModel {
    
    getRequirementsForPlans(plans) {
        const reqs = plans.map(plan => require(`../../scraping/data/requirements/${plan}.json`));
        for (const req of reqs) {
            if (!req) return;
        }
        return reqs;
    }
}

module.exports = PlanModel ;