var express = require('express');
var router = express.Router();
var Adjudication = require('../models/adjudication');
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
        var termCode = new TermCode(request.body.termCode);
        termCode.save(function (error) {
            if (error) {
                response.send(error);
            } else {
                response.send({termCode: termCode});
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
        else if (request.query.name){
            TermCode.findOne({name: request.query.name}, function(error, termCode) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({termCode: termCode});
                }               

            });
        }
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

                if (termCode.terms.length > 0) {
                    let completedTerms = 0;
                    for (let i = 0; i < termCode.terms.length; i++) {
                        Term.findById(termCode.terms[i], function (error, term) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (term) {
                                term.termCode = null;

                                term.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedTerms++;
                                        if (completedTerms === termCode.terms.length && !failed) {
                                            competed++;
                                            if (completed === 2 && !failed) {
                                                response.json({deleted: termCode});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedTerms++;
                                if (completedTerms === termCode.terms.length && !failed) {
                                    competed++;
                                    if (completed === 2 && !failed) {
                                        response.json({deleted: termCode});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 2 && !failed){
                        response.json({deleted: termCode});
                    }
                }

                if (termCode.adjudications.length > 0) {
                    let completedAdjudications = 0;
                    for (let i = 0; i < termCode.adjudications.length; i++)
                    {
                        Adjudication.findById(termCode.adjudications[i], function (error, adjudication) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (adjudication) {
                                adjudication.termCode = null;

                                adjudication.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedAdjudications++;
                                        if (completedAdjudications === termCode.adjudications.length && !failed) {
                                            completed++;
                                            if (completed === 4 && !failed) {
                                                response.json({deleted: termcode});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedAdjudications++;
                                if (completedAdjudications === termCode.adjudications.length && !failed) {
                                    completed++;
                                    if (completed === 4 && !failed) {
                                        response.json({deleted: termCode});
                                    }
                                }
                            }
                        });
                    }
                }
            } else {
                response.json({deleted: termCode});
            }
        });
    });
module.exports = router;

    //Expand later.
