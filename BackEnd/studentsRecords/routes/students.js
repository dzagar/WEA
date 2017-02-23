var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var Gender = require('../models/gender');
var Residency = require('../models/residency');
var Scholarship = require('../models/scholarship');
var TermCode = require('../models/termCode');
var AdvancedStanding = require('../models/advancedStanding');
var HighSchoolGrade = require('../models/highSchoolGrade');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new Student(request.body.student);

        Gender.findById(student.gender, function(error, gender) {
            if (error) {
                response.send(error);
            } else {
                gender.students.push(student._id);

                Residency.findById(student.resInfo, function (error, residency) {
                    if (error) {
                        response.send(error);
                    } else {
                        residency.students.push(student._id);

                        student.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                gender.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        residency.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({student: student});
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
        var firstName = request.query.firstName;
        var gender = request.query.gender;
        var l = parseInt(request.query.limit);
        var lastName = request.query.lastName;
        var studentNumber = request.query.number;
        var o = parseInt(request.query.offset);
        var residency = request.query.resInfo;
        var student = request.query.student;

        if (deleteAll) {
            Student.remove({}, function(error){
                if (error) {
                    response.send(error);
                } else {
                    console.log('killed all students');
                }
            });
        }

        if (!student) {
            if (firstName != null || lastName != null || studentNumber != null)
            {
                var regexFName = new RegExp(firstName, "img");
                var regexLName = new RegExp(lastName, "img");
                var regexStudentNum = new RegExp(studentNumber, "img");
                var conditions = {};
                if (firstName != "") conditions["firstName"] = regexFName;
                if (lastName != "") conditions["lastName"] = regexLName;
                if (studentNumber != "") conditions["studentNumber"] = regexStudentNum;

                Student.find(conditions, function(error, students){
                    if (error) {
                        response.send(error);
                    } else {
                        console.log(students);
                        response.json({student: students});
                    }
                });
            }
            else
            { 
                Student.paginate({}, { offset: o, limit: l },function (error, students) {
                    if (error) {
                        response.send(error);
                    } else {
                        Student.count({}, function(error, num) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({student: students.docs, meta: {total: num}});
                            }
                        });
                    }
                });

            }
            //models.Students.find(function (error, students) {
            //    if (error) response.send(error);
            //    response.json({student: students});
            //});
        } else {
            //        if (Student == "residency")
            Student.find({"residency": request.query.residency}, function (error, students) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({student: students});
                }
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Student.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send(error);
            } else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Student.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send(error);
            } else {
                student.studentNumber = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;
                student.registrationComments = request.body.student.registrationComments;
                student.basisOfAdmission = request.body.student.basisOfAdmission;
                student.admissionAverage = request.body.student.admissionAverage;
                student.admissionComments = request.body.student.admissionComments;
                student.scholarships = request.body.student.scholarships;
                student.termCodes = request.body.student.termCodes;

                student.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        Student.findByIdAndRemove(request.params.student_id, function (error, student) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (student) {
                Gender.findById(student.gender, function (error, gender) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (gender) {
                        let index = gender.students.indexOf(student._id);
                        if (index > -1) {
                            gender.students.splice(index, 1);
                        }

                        gender.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 6 && !failed) {
                                    response.json({deleted: student});
                                }
                            }
                        });

                    } else {
                        completed++;
                        if (completed === 6 && !failed) {
                            response.json({deleted: student});
                        }
                    }
                });

                Residency.findById(student.resInfo, function (error, residency) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (residency) {
                        let index = residency.students.indexOf(student._id);
                        if (index > -1) {
                            residency.students.splic(index, 1);
                        }

                        residency.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 6 && !failed) {
                                    response.json({deleted: student});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 6 && !failed) {
                            response.json({deleted: student});
                        }
                    }
                });

                if (student.scholarships.length > 0) {
                    let completedScholarships = 0;
                    for (let i = 0; i < student.scholarships.length && !failed; i++) {
                        Scholarship.findById(student.scholarships[i], function (error, scholarship) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (scholarship) {
                                scholarship.student = null;

                                scholarship.save(function (error) {
                                    completedScholarships++;
                                    if (completedScholarships === student.scholarships.length && !failed) {
                                        completed++;
                                        if (completed === 6 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedScholarships++;
                                if (completedScholarships === student.scholarships.length && !failed) {
                                    completed++;
                                    if (completed === 6 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 6 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.termCodes.length > 0) {
                    let completedTermCodes = 0;
                    for (let i = 0; i < student.termCodes.length && !failed; i++) {
                        TermCode.findById(student.termCodes[i], function (error, termCode) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (termCode) {
                                termCode.student = null;

                                termCode.save(function (error) {
                                    completedTermCodes++;
                                    if (completedTermCodes === student.termCodes.length && !failed) {
                                        completed++;
                                        if (completed === 6 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedTermCodes++;
                                if (completedTermCodes === student.termCodes.length && !failed) {
                                    completed++;
                                    if (completed === 6 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 6 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.advancedStandings.length > 0) {
                    let completedAdvancedStandings = 0;
                    for (let i = 0; i < student.advancedStandings.length && !failed; i++) {
                        AdvancedStanding.findById(student.advancedStandings[i], function (error, advancedStanding) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (advancedStanding) {
                                advancedStanding.student = null;

                                advancedStanding.save(function (error) {
                                    completedAdvancedStandings++;
                                    if (completedAdvancedStandings === student.advancedStandings.length && !failed) {
                                        completed++;
                                        if (completed === 6 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedAdvancedStandings++;
                                if (completedAdvancedStandings === student.advancedStandings.length && !failed) {
                                    completed++;
                                    if (completed === 6 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 6 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.highSchoolGrades.length > 0) {
                    let completedHighSchoolGrades = 0;
                    for (let i = 0; i < student.highSchoolGrades.length && !failed; i++) {
                        HighSchoolGrade.findById(student.highSchoolGrades[i], function (error, highSchoolGrade) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (highSchoolGrade) {
                                highSchoolGrade.student = null;

                                highSchoolGrade.save(function (error) {
                                    completedHighSchoolGrades++;
                                    if (completedHighSchoolGrades === student.highSchoolGrades.length && !failed) {
                                        completed++;
                                        if (completed === 6 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedHighSchoolGrades++;
                                if (completedHighSchoolGrades === student.highSchoolGrades.length && !failed) {
                                    completed++;
                                    if (completed === 6 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 6 && !failed) {
                        response.json({deleted: student});
                    }
                }

            } else {
                response.json({deleted: student});
            }
        });
    });
module.exports = router;
