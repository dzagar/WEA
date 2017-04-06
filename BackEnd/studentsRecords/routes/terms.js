var express = require('express');
var router = express.Router();
var TermCode = require('../models/termCode');
var Term = require('../models/term');
var Student = require('../models/student');
var Grade = require('../models/grade');
var ProgramRecord = require('../models/programRecord');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var term = new Term(request.body.term);
        TermCode.findById(term.termCode, function(error, termCode){
            if (error) {
                response.send(error);
            } else {
                termCode.terms.push(term._id);
                Student.findById(term.student, function(error, student) {
                    if (error){
                        response.send(error);
                    }
                    else{
                        student.terms.push(term._id);
                        term.save(function (error) {                            
                            if (error) {
                                response.send(error);
                            } else {                                
                                termCode.save(function(error) {
                                    if (error)
                                        response.send(error);
                                    else{                                        
                                        student.save(function(error){
                                            if (error)
                                            {
                                                response.send(error);
                                            }
                                            else{                                                
                                                response.send({term:term});
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
        if (request.query.deleteAll)
        {
            Term.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else {
                    Term.find(function(error, terms) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({terms: terms});
                            //console.log("removed terms");
                        }
                    });
                }
            });
        }
        else if (request.query.studentNumber && request.query.name) {
            Student.find({studentNumber: request.query.studentNumber}, function(error, students) {
                if (error) {
                    response.send(error);
                } else {                    
                    let student = students[0];    //should only return one record anyway
                    if(student) {
                        TermCode.find({name: request.query.name}, function (error, termCodes) {
                            if (error) {
                                response.send(error);
                            } else {
                                let termCode = termCodes[0];
                                if (termCode)
                                {
                                    Term.findOne({student: student, termCode: termCode}, function(error, term) {
                                        if (error){
                                            response.send(error);
                                        }
                                        else{
                                            response.send({term:term});
                                        }
                                    });
                                }
                                else{
                                    response.json({error: "No term code found"});
                                }
                            }
                        });
                    } else {
                        response.json({error: "No student was found"});
                    }
                }
            });
        }
        else if (request.query.student && request.query.termCode)
        {
            Term.findOne({student: request.query.student, termCode: request.query.termCode}, function(error, term) {
                if (error){
                    response.send(error);
                }
                else{
                    response.send({term:term});
                }
            });
        }
        else if (request.query.student){
            Term.find({student: request.query.student}, function(error, terms) {
                if (error){
                    response.send(error);
                }
                else{
                    response.send({terms: terms});
                }
            });
        }
        else {
            Term.find(function(error, term) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({term: term});
                }
            });
        }
    });

router.route('/:term_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Term.findById(request.params.term_id, function (error, term) {
            if (error) {
                response.send(error);
            } else {
                response.json({term: term});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        Term.findByIdAndRemove(request.params.term_id, function(error, term) {
            if (error) {
                failed = true;
                response.send(error);
            } 
            else if (term) {
                Student.findById(term.student, function (error, student) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (student) {
                        let index = student.terms.indexOf(term._id);
                        if (index > -1) {
                            student.terms.splice(index, 1);
                        }

                        student.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 4 && !failed) {
                                    response.json({deleted: term});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 4 && !failed) {
                            response.json({deleted: term});
                        }
                    }
                });

                if (term.grades.length > 0) {
                    let completedGrades = 0;
                    for (let i = 0; i < term.grades.length && !failed; i++) {
                        Grade.findById(term.grades[i], function (error, grade) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (grade) {
                                grade.term = null;

                                grade.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedGrades++;
                                        if (completedGrades === term.grades.length && !failed) {
                                            completed++;
                                            if (completed === 4 && !failed) {
                                                response.json({deleted: term});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedGrades++;
                                if (completedGrades === term.grades.length && !failed) {
                                    completed++;
                                    if (completed === 4 && !failed) {
                                        response.json({deleted: term});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 4 && !failed) {
                        response.json({deleted: term});
                    }
                }

                if (term.programRecords.length > 0) {
                    let completedProgramRecords = 0;
                    for (let i = 0; i < term.programRecords.length && !failed; i++) {
                        ProgramRecord.findById(term.programRecords[i], function(error, programRecord) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (programRecord) {
                                programRecord.term = null;

                                programRecord.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedProgramRecords++;
                                        if (completedProgramRecords === term.programRecords.length && !failed) {
                                            completed++;
                                            if (completed === 4 && !failed) {
                                                response.json({deleted: term});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedProgramRecords++;
                                if (completedProgramRecords === term.programRecords.length && !failed) {
                                    completed++;
                                    if (completed === 4 && !failed) {
                                        response.json({deleted: term});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 4 && !failed) {
                        response.json({deleted: term});
                    }
                }

                TermCode.findById(term.termCode, function (error, termCode) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (termCode) {
                        let index = termCode.term.indexOf(term._id);
                        if (index > -1) {
                            termCode.terms.splice(index, 1);
                        }

                        termCode.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 4 && !failed) {
                                    response.json({deleted: term});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 4 && !failed) {
                            response.json({deleted: term});
                        }
                    }
                });
            } 
            else {
                response.json({deleted: term});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Term.findById(request.params.term_id, function(error, term) {
            if (error)
            {
                response.send(error);
            }
            else{
                term.termAVG = request.body.term.termAVG;
                term.termUnitsPassed = request.body.term.termUnitsPassed;
                term.termUnitsTotal = request.body.term.termUnitsTotal;
                term.termCode = request.body.term.termCode;
                term.student = request.body.term.student;
                if (request.body.term.programRecords) term.programRecords = request.body.term.programRecords.split();
                if (request.body.term.grades) term.grades = request.body.term.grades.split();
                term.save(function(error) {
                    if (error)
                    {
                        response.send(error);
                    }
                    else{
                        response.send({term:term});
                    }
                });
            }

        });
    });
module.exports = router;
