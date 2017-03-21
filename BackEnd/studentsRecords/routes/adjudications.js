var express = require('express');
var router = express.Router();
var Adjudication = require('../models/adjudication');
var Student = require('../models/student');
var TermCode = require('../models/termCode');
var AssessmentCode = require('../models/assessmentCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new advanced standing
    .post(parseUrlencoded, parseJSON, function (request, response) {
        let completed = 0;
        let failed = false;
        var adjudication = new Adjudication(request.body.adjudication);

        if (adjudication.student) {
            Student.findById(adjudication.student, function (error, student) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (student) {
                    student.adjudications.push(adjudication._id);

                    student.save(function (error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                adjudication.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({adjudication: adjudication});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        adjudication.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({adjudication: adjudication});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                adjudication.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({adjudication: adjudication});
                    }
                });
            }
        }

        if (adjudication.termCode) {
            TermCode.findById(adjudication.termCode, function (error, termCode) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (termCode) {
                    termCode.adjudications.push(adjudication._id);

                    termCode.save(function (error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                adjudication.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({adjudication: adjudication});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        adjudication.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({adjudication: adjudication});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                adjudication.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({adjudication: adjudication});
                    }
                });
            }
        }

        if (adjudication.assessmentCode) {
            AssessmentCode.findById(adjudication.assessmentCode, function (error, assessmentCode) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (assessmentCode) {
                    assessmentCode.adjudications.push(adjudication._id);

                    assessmentCode.save(function (error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                adjudication.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({adjudication: adjudication});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        adjudication.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({adjudication: adjudication});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                adjudication.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({adjudication: adjudication});
                    }
                });
            }
        }
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        if(request.query.deleteAll) {
            Adjudication.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    Adjudication.find(function (error, adjudications) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({adjudications: adjudications});
                        }
                    });
                }
            });
        } else if (request.query.assessmentCode && request.query.termCode) {
            Adjudication.find({assessmentCode: request.query.assessmentCode, termCode: request.query.termCode}, function(error, adjudications) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({adjudications: adjudications});
                }
            });
        } else {
            Adjudication.find(function(error, adjudications) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({adjudications: adjudications});
                }
            });
        }
    });

router.route('/:adjudication_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Adjudication.findById(request.params.adjudication_id, function(error, adjudication) {
            if (error) {
                response.send(error);
            } else {
                response.json({adjudication: adjudication});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Adjudication.findById(request.params.adjudication_id, function(error, adjudication) {
            if (error) {
                response.send(error);
            } else if (adjudication) {
                adjudication.student = request.body.adjudication.student;
                adjudication.termCode = request.body.adjudication.termCode;
                adjudication.date = request.body.adjudication.date;
                adjudication.note = request.body.adjudication.note;
                adjudication.assessmentCode = request.body.adjudication.assessmentCode;

                adjudication.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({adjudication: adjudication});
                    }
                });
            } else {
                response.json({adjudication: adjudication});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Adjudication.findByIdAndRemove(request.params.adjudication_id, function (error, adjudication) {
            let completed = 0;
            let failed = false;

            if (adjudication.student) {
                Student.findById(adjudication.student, function (error, student) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (student) {
                        let index = student.adjudications.indexOf(adjudication._id);
                        if (index > -1) {
                            student.adjudications.splice(index, 1);
                        }

                        student.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({adjudication: adjudication});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({adjudication: adjudication});
                        }
                    }
                });
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({adjudication: adjudication});
                }
            }

            if (adjudication.termCode) {
                TermCode.findById(adjudication.termCode, function (error, termCode) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (termCode) {
                        let index = termCode.adjudications.indexOf(adjudication._id);
                        if (index > -1) {
                            termCode.adjudications.splice(index, 1);
                        }

                        termCode.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({adjudication: adjudication});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({adjudication: adjudication});
                        }
                    }
                });
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({adjudication: adjudication});
                }
            }

            if (adjudication.assessmentCode) {
                AssessmentCode.findById(adjudication.assessmentCode, function (error, assessmentCode) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (assessmentCode) {
                        let index = assessmentCode.adjudications.indexOf(adjudication._id);
                        if (index > -1) {
                            assessmentCode.adjudications.splice(index, 1);
                        }

                        assessmentCode.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({adjudication: adjudication});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({adjudication: adjudication});
                        }
                    }
                });
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({adjudication: adjudication});
                }
            }
        });
    });

module.exports = router;
