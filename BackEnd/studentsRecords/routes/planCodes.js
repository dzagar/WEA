var express = require('express');
var router = express.Router();
var PlanCode = require('../models/planCode');
var ProgramRecord = require('../models/programRecord');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var planCode = new PlanCode(request.body.planCode);

        ProgramRecord.findById(planCode.programRecord, function(error, programRecord) {
            if (error) {
                response.send(error);
            } else {
                programRecord.planCodes.push(planCode._id);
                
                planCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        programRecord.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({planCode: planCode});
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
            PlanCode.remove({}, function(error){
                if (error) {
                    response.send(error);
                } else {
                    PlanCode.find({}, function(error, planCodes) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({planCodes: planCodes});
                        }
                    });
                }
            });
        } else {
            PlanCode.find({}, function (error, planCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({planCodes: planCodes});
                }
            });
        }
    });

router.route('/:planCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        PlanCode.findById(request.params.planCode_id, function(error, planCode) {
            if (error) {
                response.send(error);
            } else {
                response.json({planCode: planCode});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        PlanCode.findById(request.params.planCode_id, function(error, planCode) {
            if (error) {
                response.send(error);
            } else {
                planCode.name = request.body.planCode.name;
                planCode.programRecord = request.body.planCode.programRecord;

                planCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({planCode: planCode});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        PlanCode.findByIdAndRemove(request.params.planCode_id, function(error, planCode) {
            if (error) {
                response.send(error);
            } else if (planCode) {
                ProgramRecord.findById(planCode.programRecord, function (error, programRecord) {
                    if (error) {
                        response.send(error);
                    } else if (programRecord) {
                        let index = programRecord.planCodes.indexOf(planCode._id);
                        if (index > -1) {
                            programRecord.planCodes.splice(index, 1);
                        }

                        programRecord.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.send({planCode: planCode});
                            }
                        });
                    } else {
                        response.send({planCode: planCode});
                    }
                });
            } else {
                response.send({planCode: planCode});
            }
        });
    });

module.exports = router;