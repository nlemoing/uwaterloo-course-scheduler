

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
          },
          {
            "type": "allOf",
            "name": "Actuarial Science",
            "items": [
              {
                "type": "someOf",
                "number": 1,
                "items": [
                  {
                    "type": "course",
                    "courseId": 2066
                  },
                  {
                    "type": "course",
                    "courseId": 2069
                  }
                ]
              },
              {
                "type": "allOf",
                "items": [
                  {
                    "type": "course",
                    "courseId": 1256
                  },
                  {
                    "type": "course",
                    "courseId": 1784
                  },
                  {
                    "type": "course",
                    "courseId": 1785
                  },
                  {
                    "type": "course",
                    "courseId": 1787
                  },
                  {
                    "type": "course",
                    "courseId": 1788
                  },
                  {
                    "type": "course",
                    "courseId": 1791
                  },
                  {
                    "type": "course",
                    "courseId": 1795
                  },
                  {
                    "type": "course",
                    "courseId": 397
                  },
                  {
                    "type": "course",
                    "courseId": 153
                  },
                  {
                    "type": "course",
                    "courseId": 154
                  },
                  {
                    "type": "someOf",
                    "number": 1,
                    "items": [
                      {
                        "type": "course",
                        "courseId": 1665
                      },
                      {
                        "type": "course",
                        "courseId": 2935
                      }
                    ]
                  },
                  {
                    "type": "course",
                    "courseId": 2931
                  },
                  {
                    "type": "course",
                    "courseId": 3267
                  },
                  {
                    "type": "course",
                    "courseId": 3268
                  },
                  {
                    "type": "course",
                    "courseId": 3270
                  }
                ]
              },
              {
                "type": "someOf",
                "number": 1,
                "items": [
                  {
                    "type": "course",
                    "courseId": 3273
                  },
                  {
                    "type": "course",
                    "courseId": 3274
                  }
                ]
              },
              {
                "type": "someOf",
                "number": 2,
                "items": [
                  {
                    "type": "course",
                    "courseId": 1310
                  },
                  {
                    "type": "course",
                    "courseId": 3279
                  },
                  {
                    "type": "course",
                    "courseId": 3280
                  },
                  {
                    "type": "course",
                    "courseId": 3286
                  },
                  {
                    "type": "course",
                    "courseId": 3288
                  }
                ]
              }
            ]
          }
    ];
}

export { getPlans }