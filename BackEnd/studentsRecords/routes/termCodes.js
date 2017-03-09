var express = require('express');
var router = express.Router();
var TermCode = require('../models/termCode');
var Student = require('../models/student');
var Grade = require('../models/grade');
var ProgramRecord = require('../models/programRecord');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var termCode = new TermCode(request.body.termCode);
        termCode.save(function (error) {
            if (error) {
                response.send(error);
            } else {
                response.send();
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll)
        {
            TermCode.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else {
                    TermCode.find(function(error, termCodes) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({termCodes: termCodes});
                            console.log("removed term codes");
                        }
                    });
                }
            });
        }
        // else if (request.query.studentNumber && request.query.name) {
        //     Student.find({studentNumber: request.query.studentNumber}, function(error, students) {
        //         if (error) {
        //             response.send(error);
        //         } else {                    
        //             let student = students[0];    //should only return one record anyway
        //             if(student) {
        //                 TermCode.find({name: request.query.name, student: student.id}, function (error, termCode) {
        //                     if (error) {
        //                         response.send(error);
        //                     } else {
        //                         response.json({termCode: termCode});
        //                     }
        //                 });
        //             } else {
        //                 response.json({error: "No student was found"});
        //             }
        //         }
        //     });
        // }
        else { 
            TermCode.find(function(error, termCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({termCodes: termCodes});
                }
            });
        }
    });

router.route('/:termCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        TermCode.findById(request.params.termCode_id, function (error, termCode) {
            if (error) {
                response.send(error);
            } else {
                response.json({termCode: termCode});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        TermCode.findByIdAndRemove(request.params.termCode_id, function(error, termCode) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (termCode) {
                Student.findById(termCode.student, function (error, student) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (student) {
                        let index = student.termCodes.indexOf(termCode._id);
                        if (index > -1) {
                            student.termCodes.splice(index, 1);
                        }

                        student.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: termCode});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({deleted: termCode});
                        }
                    }
                });

                if (termCode.grades.length > 0) {
                    let completedGrades = 0;
                    for (let i = 0; i < termCode.grades.length && !failed; i++) {
                        Grade.findById(termCode.grades[i], function (error, grade) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (grade) {

                            } else {
                                completedGrades++;
                                if (completedGrades === termCodes.grades.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        response.json({deleted: termCode});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({deleted: termCode});
                    }
                }

                if (termCode.programRecords.length > 0) {
                    let completedProgramRecords = 0;
                    for (let i = 0; i < termCode.programRecords.length && !failed; i++) {
                        ProgramRecord.findById(termCode.programRecords[i], function(error, programRecord) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (programRecord) {
                                programRecord.termCode = null;

                                programRecord.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedProgramRecords++;
                                        if (completedProgramRecords === termCode.programRecords.length && !failed) {
                                            completed++;
                                            if (completed === 3 && !failed) {
                                                response.json({deleted: termCode});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedProgramRecords++;
                                if (completedProgramRecords === termCode.programRecords.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        response.json({deleted: termCode});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({deleted: termCode});
                    }
                }
            } else {
                response.json({deleted: termCode});
            }
        });
    });
module.exports = router;

    //Expand later.
