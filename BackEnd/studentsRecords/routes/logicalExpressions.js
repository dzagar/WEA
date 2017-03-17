var express = require('express');
var router = express.Router();
var LogicalExpression = require('../models/logicalExpression');
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
                            if (completed === 2 && !failed) {
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
                    if (completed === 2 && !failed) {
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
            if (completed === 2 && !failed) {
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
                                    if (completed === 2 && !failed) {
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
                            if (completed === 2 && !failed) {
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
            if (completed === 2 && !failed) {
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
        
    });

router.route('/:logicalExpression_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
       
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        
    });
module.exports = router;

    //Expand later.
