var express = require('express');
var router = express.Router();
var AssessmentCode = require('../models/assessmentCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var assessmentCode = new AssessmentCode(request.body.assessmentCode);
        assessmentCode.save(function(error) {
            if (error)
            {
                response.send({error:error});
            }
            else{
                response.send({assessmentCode:assessmentCode});
            }

        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.noCategory)
        {
            AssessmentCode.find({adjudicationCategory: null}, function(error, assessmentCodes){
                if (error)
                {
                    response.send({error:error});
                }
                else{
                    response.send({assessmentCodes:assessmentCodes});
                }
            });
        }
        else{
            AssessmentCode.find({}, function(error, assessmentCodes){
                if (error)
                {
                    response.send({error:error});
                }
                else{
                    response.send({assessmentCodes:assessmentCodes});
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
        AssessmentCode.remove({_id: request.params.assessmentCode_id}, function(error, assessmentCode) {
            if (error)
            {
                response.send({error:error});
            }
            else
            {
                response.send({});
            }
        });
    });

module.exports = router;