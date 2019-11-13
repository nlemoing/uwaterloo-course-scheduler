

function getPlans(scheduleId) {

    return [
        {
            "type": "allOf",
            "name": "Math Base Requirements",
            "items": [
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 3920,
                    "type": "course"
                  },
                  {
                    "courseId": 3922,
                    "type": "course"
                  },
                  {
                    "courseId": 3926,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 3921,
                    "type": "course"
                  },
                  {
                    "courseId": 3923,
                    "type": "course"
                  },
                  {
                    "courseId": 3927,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2045,
                    "type": "course"
                  },
                  {
                    "courseId": 2049,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2035,
                    "type": "course"
                  },
                  {
                    "courseId": 2046,
                    "type": "course"
                  },
                  {
                    "courseId": 2050,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2043,
                    "type": "course"
                  },
                  {
                    "courseId": 2047,
                    "type": "course"
                  },
                  {
                    "courseId": 2051,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2044,
                    "type": "course"
                  },
                  {
                    "courseId": 2048,
                    "type": "course"
                  },
                  {
                    "courseId": 2052,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2065,
                    "type": "course"
                  },
                  {
                    "courseId": 2068,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 2066,
                    "type": "course"
                  },
                  {
                    "courseId": 2067,
                    "type": "course"
                  },
                  {
                    "courseId": 2069,
                    "type": "course"
                  },
                  {
                    "courseId": 2070,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 3260,
                    "type": "course"
                  },
                  {
                    "courseId": 3262,
                    "type": "course"
                  }
                ]
              },
              {
                "type": "oneOf",
                "items": [
                  {
                    "courseId": 3261,
                    "type": "course"
                  },
                  {
                    "courseId": 3263,
                    "type": "course"
                  }
                ]
              }
            ]
          },
          {
              "type": "allOf",
              "name": "Math Communications",
              "items": [
                {
                    "type": "oneOf",
                    "items": [
                      {
                        "type": "course",
                        "courseId": 51
                      },
                      {
                        "type": "course",
                        "courseId": 56
                      },
                      {
                        "type": "course",
                        "courseId": 1565
                      },
                      {
                        "type": "course",
                        "courseId": 1563
                      },
                      {
                        "type": "course",
                        "courseId": 3068
                      },
                      {
                        "type": "course",
                        "courseId": 3077
                      }
                    ]
                  },
                  {
                    "type": "oneOf",
                    "items": [
                      {
                        "type": "course",
                        "courseId": 51
                      },
                      {
                        "type": "course",
                        "courseId": 56
                      },
                      {
                        "type": "course",
                        "courseId": 1565
                      },
                      {
                        "type": "course",
                        "courseId": 1563
                      },
                      {
                        "type": "course",
                        "courseId": 3068
                      },
                      {
                        "type": "course",
                        "courseId": 3077
                      },
                      {
                        "type": "course",
                        "courseId": 52
                      },
                      {
                        "type": "course",
                        "courseId": 53
                      },
                      {
                        "type": "course",
                        "courseId": 55
                      },
                      {
                        "type": "course",
                        "courseId": 1555
                      },
                      {
                        "type": "course",
                        "courseId": 1556
                      },
                      {
                        "type": "course",
                        "courseId": 1564
                      },
                      {
                        "type": "course",
                        "courseId": 1581
                      },
                      {
                        "type": "course",
                        "courseId": 1590
                      },
                      {
                        "type": "course",
                        "courseId": 1592
                      },
                      {
                        "type": "course",
                        "courseId": 1593
                      },
                      {
                        "type": "course",
                        "courseId": 2935
                      },
                      {
                        "type": "course",
                        "courseId": 3078
                      },
                      {
                        "type": "course",
                        "courseId": 3080
                      },
                      {
                        "type": "course",
                        "courseId": 3081
                      }
                    ]
                  }
              ]
          }
    ];
}

export { getPlans }