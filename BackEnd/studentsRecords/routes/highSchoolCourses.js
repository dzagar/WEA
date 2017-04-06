var express = require('express');
var router = express.Router();
var HighSchoolCourse = require('../models/highSchoolCourse');
var HighSchoolSubject = require('../models/highSchoolSubject');
var HighSchool = require('../models/highSchool');
var HighSchoolGrade = require('../models/highSchoolGrade');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolCourse = new HighSchoolCourse(request.body.highSchoolCourse);

        HighSchool.findById(highSchoolCourse.school, function (error, highSchool) {
            if (error) {
                response.send(error);
            } else {
                highSchool.courses.push(highSchoolCourse._id);

                HighSchoolSubject.findById(highSchoolCourse.subject, function (error, subject) {
                    if (error) {
                        response.send(error);
                    } else {    
                        subject.courses.push(highSchoolCourse._id);

                        highSchoolCourse.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                highSchool.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        subject.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({highSchoolCourse: highSchoolCourse});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        var Grade = request.query.grades;
        if (deleteAll)
        {
            HighSchoolCourse.remove({}, function(error) {
                if (error) {
                    response.send(error);
                }
                else {
                     HighSchoolCourse.find(function (error, highSchoolCourse){
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({highSchoolCourse: highSchoolCourse});
                        }
                        //console.log('removed high school courses');
                    });
                }
            });
        } else if (request.query.schoolName && request.query.subjectName && request.query.subjectDescription) {
            HighSchool.findOne({schoolName: request.query.schoolName}, function(error, school) {
                if (error) {
                    response.send(error);   //should only return one record anyway
                } else if(school) {
                    HighSchoolSubject.findOne({name: request.query.subjectName, description: request.query.subjectDescription}, function (error, subject) {
                        if (error) {
                            response.send(error);
                        } else if(subject) {
                            HighSchoolCourse.findOne({level: request.query.level, source: request.query.source, unit: request.query.unit, school: school.id, subject: subject.id}, function (error, course) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    response.json({highSchoolCourse: course});
                                }
                            });
                        } else {
                            response.json({error: "No subject was found"});
                        }
                    });
                } else {
                    response.json({error: "No highschool was found"});
                }
            });

            /*
            HighSchoolCourse.find({level: request.query.level, source: request.query.source, unit: request.query.unit}, function (error, courses) {
                if (error)
                    response.send(error);
                
                HighSchool.find({schoolName: request.query.schoolName}, function(error, schools) {
                    if(error)
                        response.send(error);
                    
                    let hsCourses = [];
                    for (let c = 0; c < courses.length; c++) {
                        var keep = false;
                        for (let hs = 0; hs < schools.length; hs++) {
                            if (courses[c].school == schools[hs]._id) {
                                keep = true;
                                break;
                            }
                        }
                        if (keep) {
                            hsCourses.push(courses[c]);
                        }
                    }

                    HighSchoolCourses.find({name: request.query.subjectName, description: request.query.subjectDescription}, function (error, subjects) {
                        if (error)
                            response.send(error);
                        
                        let hsSubCourses = [];
                        for (let c = 0; c < hsCourses.length; c++) {
                            keep = false;
                            for (let s = 0; s < subjects.length; s++) {
                                if (hsCourses[c].subject == subjects[s]._id) {
                                    keep = true;
                                    break;
                                }
                            }
                            if (keep) {
                                hsSubCourses.push(hsCourses[c]);
                            }
                        }

                        response.json({highSchoolCourses: hsSubCourses});
                    });
                });
            });*/
        } else if (Grade){
            HighSchoolCourse.findOne({grades: Grade}, function(err, course){
                if (err) response.send(err);
                else {
                    response.json({highSchoolCourse: course});
                }
            });

        } else if (request.query.level && request.query.source && request.query.unit) {
            HighSchoolCourse.find({level: request.query.level, source: request.query.source, unit: request.query.unit}, function (error, courses) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchoolCourses: courses});
                }
            });
        } 
        else if(request.query.subject)
        {
            //console.log("Entered this clause!");
            HighSchoolCourse.find({subject: request.query.subject}, function (error, courses) {
                if(error)
                {
                    response.send(error);
                }
                else {
                    response.json({highSchoolCourses: courses});
                }
            });
        }
        
        else {
            HighSchoolCourse.find(function (error, courses) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchoolCourses: courses});
                }
            });
        }
    });

router.route('/:highSchoolCourses_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolCourse.findById(request.params.highSchoolCourses_id, function(error, highSchoolCourse) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchoolCourse: highSchoolCourse});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolCourse.findById(request.params.highSchoolCourses_id, function(error, highSchoolCourse) {
            if (error) {
                response.send(error);
            } else {
                highSchoolCourse.level = request.body.highSchoolCourse.level;
                highSchoolCourse.source = request.body.highSchoolCourse.source;
                highSchoolCourse.unit = request.body.highSchoolCourse.unit;
                highSchoolCourse.subject = request.body.highSchoolCourse.subject;
                highSchoolCourse.school = request.body.highSchoolCourse.school;
                highSchoolCourse.grades = request.body.highSchoolCourse.grades;

                highSchoolCourses.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({highSchoolCourse: highSchoolCourse});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        HighSchoolCourse.findByIdAndRemove(request.params.highSchoolCourses_id, function(error, highSchoolCourse) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (highSchoolCourse) {

                HighSchool.findById(highSchoolCourse.school, function (error, school) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (school) {
                        let index = school.courses.indexOf(highSchoolCourse._id);
                        if (index > -1) {
                            school.courses.splice(index, 1);
                        }

                        school.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: highSchoolCourse});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({deleted: highSchoolCourse});
                        }
                    }
                });

                HighSchoolSubject.findById(highSchoolCourse.subject, function (error, subject) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (subject) {
                        let index = subject.courses.indexOf(highSchoolCourse._id);
                        if (index > -1) {
                            subject.courses.splice(index, 1);
                        }

                        subject.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: highSchoolCourse});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({deleted: highSchoolCourse});
                        }
                    }
                });

                let completedGrades = 0;
                for (let i = 0; i < highSchoolCourse.grades.length && !failed; i++) {
                    HighSchoolGrade.findById(highSchoolCourse.grades[i], function (error, grade) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (grade) {
                            grade.source = null;
                            grade.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedGrades++;
                                    if (completedGrades === highSchoolCourse.grades.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({deleted: highSchoolCourse});
                                        }
                                    }
                                }
                            });
                        }
                    });
                }

            } else {
                response.json({deleted: highSchoolCourse});
            }
        });
    });

module.exports = router;
