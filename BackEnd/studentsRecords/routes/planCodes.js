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
            programRecord.planCodes.push(planCode._id);

            planCode.save(function(error) {
                if (error)
                    response.send(error);
                
                programRecord.save(function(error) {
                    if (error)
                        response.send(error);

                    response.json({planCode: planCode});
                });
            });
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            PlanCode.remove({}, function(err){
                if (err) response.send(err);
                else console.log('all plan Codes removed');
            })
        }
        else {
            PlanCode.find({}, function (error, planCodes) {
                if (error)
                    response.send(error);
                response.json({planCodes: planCodes});
            });
        }
    });

router.route('/:planCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        PlanCode.findById(request.params.planCode_id, function(error, planCode) {
            if (error)
                response.send(error);
            response.json({planCode: planCode});
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
            if (error)
                response.send(error);
            response.json({deleted: planCode});
        });
    });

module.exports = router;