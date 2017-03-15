var express = require('express');
var router = express.Router();
var ProgramRecord = require('../models/programRecord');
var Student = require('../models/student');
var TermCode = require('../models/termCode');
var PlanCode = require('../models/planCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var programRecord = new ProgramRecord(request.body.programRecord);

        TermCode.findById(programRecord.termCode, function (error, termCode) {
            if(error) {
                response.send(error);
            } else {
                termCode.programRecords.push(programRecord._id);

                programRecord.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        termCode.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({programRecord: programRecord});
                            }
                        });
                    }
                });
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll) {
            ProgramRecord.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else {
                    ProgramRecord.find({}, function(error, programRecords) {
                        if (error)
                        {
                            response.send(error);
                        }
                        else{
                            response.send({programRecords: programRecords});
                        }
                    });
                }
            });
        }
        else if (request.query.studentNumber &&request.query.termName &&request.query.programName &&request.query.level &&request.query.load)
        {
            //student.find
            Student.findOne({studentNumber: request.query.studentNumber}, function(error, student) {
                if (!student)
                {
                    console.log("no student found");
                }
                TermCode.findOne({name: request.query.termName, student: student.id}, function(error, term) {
                    if (!term)
                    {
                        console.log("no term found");
                    }
                    ProgramRecord.findOne({termCode: term, name: request.query.programName, level: request.query.level, load: request.query.load}, function(error, programRecord) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.send({programRecord: programRecord});
                        }
                    });
                });
            });
            //then term.find
            //then PR.find

        }
        // studentNumber: planStudentNumber,
        // termName: planTerm,
        // programName: planProgramName,
        // level: planLevel,
        // load: planLoad
        else {
            ProgramRecord.find({}, function (error, programRecords) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({programRecords: programRecords});
                }
            });
        }
    });

router.route('/:programRecord_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        ProgramRecord.findById(request.params.programRecord_id, function(error, programRecord) {
            if (error) {
                response.send(error);
            } else {
                response.json({programRecord: programRecord});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        ProgramRecord.findById(request.params.programRecord_id, function(error, programRecord) {
            if (error) {
                response.send(error);
            } else {
                programRecord.name = request.body.programRecord.name;
                programRecord.level = request.body.programRecord.level;
                programRecord.load = request.body.programRecord.load;
                programRecord.termCode = request.body.programRecord.termCode;
                programRecord.planCodes = request.body.programRecord.planCodes;

                programRecord.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({programRecord: programRecord});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        ProgramRecord.findByIdAndRemove(request.params.programRecord_id, function(error, programRecord) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (programRecord) {
                Term.findById(programRecord.term, function (error, term) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (term) {
                        let index = term.programCodes.indexOf(programRecord._id);
                        if (index > -1) {
                            term.programCodes.splice(index, 1);
                        }

                        term.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 2 && !failed) {
                                    response.json({deleted: programRecord});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 2 && !failed) {
                            response.json({deleted: programRecord});
                        }
                    }
                });

                let completedPlanCodes = 0;
                if (programRecord.planCodes.length > 0) {
                    for (let i = 0; i < programRecord.planCodes.length && !failed; i++) {
                        PlanCodes.findById(programRecord.planCodes[i], function (error, planCode) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (planCode) {
                                planCode.programRecord = null;

                                planCode.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedPlanCodes++;
                                        if (completedPlanCodes === programRecord.planCodes.length && !failed) {
                                            completed++;
                                            if (completed === 2 && !failed) {
                                                response.json({deleted: programRecord});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedPlanCodes++;
                                if (completedPlanCodes === programRecord.planCodes.length && !failed) {
                                    completed++;
                                    if (completed === 2 && !failed) {
                                        response.json({deleted: programRecord});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 2 && !failed) {
                        response.json({deleted: programRecord});
                    }
                }
            } else {
                response.json({deleted: programRecord});
            }
        });        
    });

module.exports = router;