var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var Gender = require('../models/gender');
var Residency = require('../models/residency');
var Scholarship = require('../models/scholarship');
var Term = require('../models/termCode');
var AdvancedStanding = require('../models/advancedStanding');
var HighSchoolGrade = require('../models/highSchoolGrade');
var Adjudication = require('../models/adjudication');
var AssessmentCode = require('../models/assessmentCode');
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
        var flagged = request.query.flagged;

        if (deleteAll) {
            Student.remove({}, function(err){
                if (err) response.send(err);
                else 
                {
                    Student.find({}, function(error, students) {
                        if (error)
                            response.send(error);
                        else
                            response.send({students:students});
                    });
                }
            });
        }
        else if (request.query.findOneStudent)
        {
            Student.findOne({studentNumber: studentNumber}, function(error, student) {
                if (error)
                    response.send(error);
                else   
                    response.send({student:student});
            });
        }
        else if (!student) {
            if (firstName != null || lastName != null || studentNumber != null)
            {
                if (flagged == "true"){
                    //get all assessment codes that are flagged
                    //get all adjudications that are in assessmentCode
                    AssessmentCode.find({flagForReview: true}, function(error, assessmentCodes){
                        Adjudication.find({assessmentCode: {"$in": assessmentCodes}}, function(error, adjudications){
                            var regexFName = new RegExp(firstName, "img");
                            var regexLName = new RegExp(lastName, "img");
                            var regexStudentNum = new RegExp(studentNumber, "img");
                            var conditions = {};
                            if (firstName != "") conditions["firstName"] = regexFName;
                            if (lastName != "") conditions["lastName"] = regexLName;
                            if (studentNumber != "") conditions["studentNumber"] = regexStudentNum;
                            conditions["adjudications"] = {"$in": adjudications};
                            Student.paginate(conditions, {offset: o, limit: l}, function(error, students) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    Student.count(conditions, function(error, num) {
                                        if (error) {
                                            response.send(error);
                                        } else {
                                            response.json({student: students.docs, meta: {total: num}})
                                        }
                                    });
                                }
                            });
                        });
                    });
                }else{
                    var regexFName = new RegExp(firstName, "img");
                    var regexLName = new RegExp(lastName, "img");
                    var regexStudentNum = new RegExp(studentNumber, "img");
                    var conditions = {};
                    if (firstName != "") conditions["firstName"] = regexFName;
                    if (lastName != "") conditions["lastName"] = regexLName;
                    if (studentNumber != "") conditions["studentNumber"] = regexStudentNum;

                    Student.paginate(conditions, {offset: o, limit: l}, function(error, students) {
                        if (error) {
                            response.send(error);
                        } else {
                            Student.count(conditions, function(error, num) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    response.json({student: students.docs, meta: {total: num}})
                                }
                            });
                        }
                    });
                }                
            }
            else if (l && l != 0)
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
            else{
                //console.log("get all");
                Student.find({}, function(error, students){
                    if (error){
                        response.send(error);
                    }
                    else{
                        response.send({students: students});
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
            }
            else {
                student.studentNumber = request.body.student.studentNumber;                
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;
                student.cumAVG = request.body.student.cumAVG;
                student.cumUnitsTotal = request.body.student.cumUnitsTotal;
                student.cumUnitsPassed = request.body.student.cumUnitsPassed;
                student.registrationComments = request.body.student.registrationComments;
                student.basisOfAdmission = request.body.student.basisOfAdmission;
                student.admissionAverage = request.body.student.admissionAverage;
                student.admissionComments = request.body.student.admissionComments;
                if (request.body.student.scholarships) student.scholarships = request.body.student.scholarships.slice();
                if (request.body.student.terms) student.terms = request.body.student.terms.slice();
                if (request.body.student.adjudications) student.adjudications = request.body.student.adjudications.slice();
                student.advancedStandings = request.body.student.advancedStandings;
                student.highSchoolGrades = request.body.student.highSchoolGrades;
                student.adjudications = request.body.student.adjudications;
                student.cumAVG = request.body.student.cumAVG;
                student.cumUnitsPassed = request.body.student.cumUnitsPassed;
                student.cumUnitsTotal = request.body.student.cumUnitsTotal;

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
                if (student.gender) {
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
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            });

                        } else {
                            completed++;
                            if (completed === 7 && !failed) {
                                response.json({deleted: student});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.residency) {
                    Residency.findById(student.resInfo, function (error, residency) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (residency) {
                            let index = residency.students.indexOf(student._id);
                            if (index > -1) {
                                residency.students.splice(index, 1);
                            }

                            residency.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            });
                        } else {
                            completed++;
                            if (completed === 7 && !failed) {
                                response.json({deleted: student});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.scholarships && student.scholarships.length > 0) {
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
                                        if (completed === 7 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedScholarships++;
                                if (completedScholarships === student.scholarships.length && !failed) {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.terms && student.terms.length > 0) {
                    let completedTerms = 0;
                    for (let i = 0; i < student.terms.length && !failed; i++) {
                        Term.findById(student.terms[i], function (error, term) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (term) {
                                term.student = null;

                                term.save(function (error) {
                                    completedTerms++;
                                    if (completedTerms === student.terms.length && !failed) {
                                        completed++;
                                        if (completed === 7 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedTerms++;
                                if (completedTerms === student.terms.length && !failed) {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.advancedStandings && student.advancedStandings.length > 0) {
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
                                        if (completed === 7 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedAdvancedStandings++;
                                if (completedAdvancedStandings === student.advancedStandings.length && !failed) {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.highSchoolGrades && student.highSchoolGrades.length > 0) {
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
                                        if (completed === 7 && !failed) {
                                            response.json({deleted: student});
                                        }
                                    }
                                });
                            } else {
                                completedHighSchoolGrades++;
                                if (completedHighSchoolGrades === student.highSchoolGrades.length && !failed) {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

                if (student.adjudications && student.adjudications.length > 0) {
                    let completedAdj = 0;
                    for (let i = 0; i < student.adjudications.length && !failed; i++) {
                        Adjudication.findById(student.adjudications[i], function (error, adjudication) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (adjudication) {
                                adjudication.student = null;

                                adjudication.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedAdj++;
                                        if (completedAdj === student.adjudications.length && !failed) {
                                            completed++;
                                            if (completed === 7 && !failed) {
                                                response.json({deleted: student});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedAdj++;
                                if (completedAdj === student.adjudications.length && !failed) {
                                    completed++;
                                    if (completed === 7 && !failed) {
                                        response.json({deleted: student});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 7 && !failed) {
                        response.json({deleted: student});
                    }
                }

            } else {
                response.json({deleted: student});
            }
        });
    });
module.exports = router;
