var express = require('express');
var router = express.Router();
var LogicalExpression = require('../models/logicalExpression');
var AssessmentCode = require('../models/assessmentCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var logExp = new LogicalExpression(request.body.logicalExpression);
        let completed = 0;
        let failed = false;

        if (logExp.ownerExpression) {
            LogicalExpression.findById(logExp.ownerExpression, function (error, logicalExpression) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (logicalExpression) {
                    logicalExpression.logicalExpressions.push(logExp._id);

                    logicalExpression.save(function (error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                logExp.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({logicalExpression: logExp});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        logExp.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({logicalExpression: logExp});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                logExp.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({logicalExpression: logExp});
                    }
                });
            }
        }

        if (logExp.logicalExpressions && logExp.logicalExpressions.length > 0) {
            let completedLogExp = 0;
            for (let i = 0; i < logExp.logicalExpressions.length && !failed; i++) {
                LogicalExpression.findById(logExp.logicalExpressions[i], function(error, logicalExpression) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (logicalExpression) {
                        logicalExpression.ownerExpression = logExp._id;

                        logicalExpression.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedLogExp++;
                                if (completedLogExp === logExp.logicalExpressions.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        logExp.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({logicalExpression: logExp});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedLogExp++;
                        if (completedLogExp === logExp.logicalExpressions.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                logExp.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({logicalExpression: logExp});
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
                logExp.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({logicalExpression: logExp});
                    }
                });
            }
        }

        if (logExp.assessmentCode) {
            AssessmentCode.findById(logExp.assessmentCode, function (error, assessmentCode) {
                if (error && ! failed) {
                    failed = true;
                    response.send(error);
                } else if (assessmentCode) {
                    assessmentCode.logicalExpressions.push(logExp._id);

                    assessmentCode.save(function(error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                logExp.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({logicalExpression: logExp});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        logExp.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({logicalExpression: logExp});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                logExp.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({logicalExpression: logExp});
                    }
                });
            }
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            LogicalExpression.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    LogicalExpression.find(function (error, logicalExpressions) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({logicalExpressions: logicalExpressions});
                        }
                    });
                }
            });
        } else {
            LogicalExpression.find(function (error, logicalExpressions) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({logicalExpressions: logicalExpressions});
                }
            });
        }
    });

router.route('/:logicalExpression_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        LogicalExpression.findById(request.params.logicalExpression_id, function (error, logicalExpression) {
            if (error) {
                response.send(error);
            } else {
                response.json({logicalExpression: logicalExpression});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        LogicalExpression.findById(request.params.logicalExpression_id, function (error, logicalExpression) {
            if (error) {
                response.send(error);
            } else if (logicalExpression) {
                logicalExpression.booleanExpression = request.body.logicalExpression.booleanExpression;
                logicalExpression.logicalLink = request.body.logicalExpression.logicalLink;
                logicalExpression.logicalExpressions = request.body.logicalExpression.logicalExpressions;
                logicalExpression.ownerExpression = request.body.logicalExpression.ownerExpression;
                logicalExpression.assessmentCode = request.body.logicalExpression.assessmentCode;

                logicalExpression.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({logicalExpression: logicalExpression});
                    }
                });
            } else {
                response.json({logicalExpression: logicalExpression});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        LogicalExpression.findByIdAndRemove(request.params.logicalExpression_id, function (error, logicalExpression) {
            if (logicalExpression) {
                let completed = 0;
                let failed = false;

                if (logicalExpression.ownerExpression) {
                    LogicalExpression.findById(logicalExpression.ownerExpression, function (error, logExp) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (logExp) {
                            let index = logExp.logicalExpressions.indexOf(logExp._id);
                            if (index > -1) {
                                logExp.logicalExpressions.splice(index, 1);
                            }

                            logExp.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        response.json({logicalExpression: logicalExpression});
                                    }
                                }
                            });

                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                response.json({logicalExpression: logicalExpression});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({logicalExpression: logicalExpression});
                    }
                }

                if (logicalExpression.logicalExpressions && logicalExpression.logicalExpressions.length > 0) {
                    let completedLogExp = 0;
                    for (let i = 0; i < logicalExpression.logicalExpressions.length && !failed; i++) {
                        LogicalExpression.findById(logicalExpression.logicalExpressions[i], function (error, logExp) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else if (logExp) {
                                logExp.ownerExpression = null;

                                logExp.save(function (error) {
                                    if (error && !failed) {
                                        failed = true;
                                        response.send(error);
                                    } else {
                                        completedLogExp++;
                                        if (completedLogExp === logicalExpression.logicalExpressions.length && !failed) {
                                            completed++;
                                            if (completed === 3 && !failed) {
                                                response.json({logicalExpression: logicalExpression});
                                            }
                                        }
                                    }
                                });
                            } else {
                                completedLogExp++;
                                if (completedLogExp === logicalExpression.logicalExpressions.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        response.json({logicalExpression: logicalExpression});
                                    }
                                }
                            }
                        });
                    }
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({logicalExpression: logicalExpression});
                    }
                }

                if (logicalExpression.assessmentCode) {
                    AssessmentCode.findById(logicalExpression.assessmentCode, function (error, assessmentCode) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (assessmentCode) {
                            let index = assessmentCode.logicalExpressions.indexOf(logicalExpression._id);
                            if (index > -1) {
                                assessmentCode.logicalExpressions.splice(index, 1);
                            }

                            assessmentCode.save(function (error) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        response.json({logicalExpression: logicalExpression});
                                    }
                                }
                            });
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                response.json({logicalExpression: logicalExpression});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({logicalExpression: logicalExpression});
                    }
                }
            } else {
                response.json({logicalExpression: logicalExpression});
            }
        });
    });
module.exports = router;

    //Expand later.
