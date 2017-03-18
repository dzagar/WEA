var express = require('express');
var router = express.Router();
var AssessmentCode = require('../models/assessmentCode');
var Adjudication = require('../models/adjudication');
var LogicalExpression = require('../models/logicalExpression');
var Department = require('../models/department');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var assessmentCode = new AssessmentCode(request.body.assessmentCode);
        let completed = 0;
        let failed = false;

        if (assessmentCode.adjudications && assessmentCode.adjudications.length > 0) {
            let completedAdj = 0;
            for (let i = 0; i < assessmentCode.adjudications.length && !failed; i++) {
                Adjudication.findById(assessmentCode.adjudications[i], function (error, adjudication) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (adjudication) {
                        adjudication.assessmentCode = assessmentCode._id;

                        adjudication.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedAdj++;
                                if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        assessmentCode.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({assessmentCode: assessmentCode});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedAdj++;
                        if (completedAdj === assessmentCode.adjudications.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        } else {
            completed++;
            if (completed === 3 && !failed) {
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }

        if (assessmentCode.logicalExpressions && assessmentCode.logicalExpressions.length > 0) {
            let completedLogExp = 0;
            for (let i = 0; i < assessmentCode.logicalExpressions.length && !failed; i++) {
                LogicalExpression.findById(assessmentCode.logicalExpressions[i], function (error, logExp) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (logExp) {
                        logExp.assessmentCode = assessmentCode._id;

                        logExp.save(function(error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedLogExp++;
                                if (completedLogExp === assessmentCode.logicalExpressions.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        assessmentCode.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({assessmentCode: assessmentCode});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedLogExp++;
                        if (completedLogExp === assessmentCode.logicalExpressions.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
                                    }
                                });
                            }
                        }
                    }
                });
            } 
        } else {
            completed++;
            if (completed === 3 && !failed) {
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }

        if (assessmentCode.departments && assessmentCode.departments.length > 0) {
            let completedDept = 0;
            for (let i = 0; i < assessmentCode.departments.length && !failed; i++) {
                Department.findById(assessmentCode.departments[i], function (error, department) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (department) {
                        department.assessmentCodes.push(assessmentCode._id);

                        department.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedDept++;
                                if (completedDept === assessmentCode.departments.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        assessmentCode.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({assessmentCode: assessmentCode});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedDept++;
                        if (completedDept === assessmentCode.departments.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        } else {
            completed++;
            if (completed === 3 && !failed) {
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            AssessmentCode.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    AssessmentCode.find(function(error, assessmentCodes) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({assessmentCodes: assessmentCodes});
                        }
                    });
                }
            });
        } else if (request.query.adjudicationCategory) {
            AssessmentCode.find({adjudicationCategory: request.query.adjudicationCategory}, function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        } else if (request.query.noCategroy) {
            AssessmentCode.find({adjudicationCategory: null}, function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        } else {
            AssessmentCode.find(function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        }
    });

router.route('/:assessmentCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AssessmentCode.findById(request.params.assessmentCode_id, function(error, assessmentCode){
            if (error)
            {
                response.send({error:error});
            }
            else{
                response.send({assessmentCode:assessmentCode});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {

    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AssessmentCode.findByIdAndRemove(request.params.assessmentCode_id, function(error, assessmentCode) {
            let completed = 0;
            let failed = false;

            if (assessmentCode.adjudications && assessmentCode.adjudications.length > 0) {
                let completedAdj = 0;
                for (let i = 0; i < assessmentCode.adjudications.length && !failed; i++) {
                    Adjudication.findById(assessmentCode.adjudications[i], function (error, adjudication) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (adjudication) {
                            adjudication.assessmentCode = null;

                            adjudication.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedAdj++;
                                    if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({assessmentCode: assessmentCode});
                                        }
                                    }
                                }
                            });
                        } else {
                            completedAdj++;
                            if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({assessmentCode: assessmentCode});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }

            if (assessmentCode.logicalExpressions && assessmentCode.logicalExpressions.length > 0) {
                let completedLogExp = 0;
                for (let i = 0; i < assessmentCode.logicalExpressions.length && !failed; i++) {
                    LogicalExpression.findById(assessmentCode.logicalExpressions[i], function (error, logExp) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (logExp) {
                            logExp.assessmentCode = null;

                            logExp.save(function(error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedLogExp++;
                                    if (completedLogExp === assessmentCode.logicalExpressions.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({assessmentCode: assessmentCode});
                                        }
                                    }
                                }
                            });
                        } else {
                            completedLogExp++;
                            if (completedLogExp === assessmentCode.logicalExpressions.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({assessmentCode: assessmentCode});
                                }
                            }
                        }
                    });
                } 
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }

            if (assessmentCode.departments && assessmentCode.departments.length > 0) {
                let completedDept = 0;
                for (let i = 0; i < assessmentCode.departments.length && !failed; i++) {
                    Department.findById(assessmentCode.departments[i], function (error, department) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (department) {
                            let index = department.assessmentCodes.indexOf(assessmentCode._id);
                            if (index > -1) {
                                department.assessmentCodes.splice(index, 1);
                            }

                            department.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedDept++;
                                    if (completedDept === assessmentCode.departments.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({assessmentCode: assessmentCode});
                                        }
                                    }
                                }
                            });
                        } else {
                            completedDept++;
                            if (completedDept === assessmentCode.departments.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({assessmentCode: assessmentCode});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }
        });
    });

module.exports = router;