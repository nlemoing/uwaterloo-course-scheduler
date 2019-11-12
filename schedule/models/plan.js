
class Requirement {

    isSatisfied(courses) {
        return { satisfied: false, remainingCourses: courses }
    }
}

class AllOf extends Requirement {
    constructor(reqs) {
        this.name = 'All Of';
        this._reqs = reqs;
    }

    isSatisfied(courses) {
        return this._reqs.reduce((prev, req) => {
            if (!prev.satisfied) {
                return prev;
            }
            return req.isSatisfied(prev.remainingCourses);
        }, { satisfied: true, remainingCourses: courses })
    }
}

class OneOf extends Requirement {
    constructor(reqs) {
        this.name = 'One of';
        this._reqs = reqs;
    }

    isSatisfied(courses) {
        return this._reqs.reduce((prev, req) => {
            if (prev.satisfied) {
                return prev;
            }
            return req.isSatisfied(prev.remainingCourses);
        }, { satisfied: false, remainingCourses: courses });
    }
}

class Course extends Requirement {
    constructor(courseId) {
        this.name = `${courseId}`;
        this._courseId = courseId;
    }

    isSatisfied(courses) {
        const idx = courses.findIndex((course) => {
            return this._courseId === course.courseId;
        });
        if (idx === -1) {
            return { satisfied: false, remainingCourses: courses };
        }
        return { satisfied: true, remainingCourses: courses.splice(idx, 1) };
    }
}

function getPlans(scheduleId) {

    return [
        {
            type: "allOf",
            name: "Math Base Requirements",
            items: [
                {
                    type: "oneOf",
                    items: [
                        { type: "course", courseId: 2045 },
                        { type: "course", courseId: 2049 }
                    ]
                },
                {
                    type: "oneOf",
                    items: [
                        { type: "course", courseId: 2046 },
                        { type: "course", courseId: 2050 }
                    ]
                },
                {
                    type: "oneOf",
                    items: [
                        { type: "course", courseId: 2047 },
                        { type: "course", courseId: 2051 }
                    ]
                },
                {
                    type: "oneOf",
                    items: [
                        { type: "course", courseId: 2048 },
                        { type: "course", courseId: 2052 }
                    ]
                }
            ]
        }
    ];
}

export { getPlans }