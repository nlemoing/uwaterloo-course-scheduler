

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