var express = require('express');
var router = express.Router();
var AdjudicationCategory = require('../models/adjudicationCategory');
var AssessmentCode = require('../models/assessmentCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var adjudicationCategory = new AdjudicationCategory(request.body.adjudicationCategory);
        adjudicationCategory.save(function(error) {
            if (error)
            {
                response.send(error);
            }
            else{
                response.send({adjudicationCategory: adjudicationCategory});
            }
        });
        
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll){
            AdjudicationCategory.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    AdjudicationCategory.find(function (error, adjudicationCategories) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({adjudicationCategories: adjudicationCategories});
                        }
                    });
                }
            });
        }
        else if (request.query.name)
        {
            AdjudicationCategory.findOne({name: request.query.name}, function(error, adjudicationCategories) {
                if (error){
                    response.send(error);
                }
                else{
                    response.send({adjudicationCategory: adjudicationCategory});
                }
            });
        }
        else{
            AdjudicationCategory.find(function(error, adjudicationCategories) {
                if (error){
                    response.send(error);
                }
                else{
                    response.send({adjudicationCategories: adjudicationCategories});
                }
            });
        }
    });

router.route('/:adjudicationCategory_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AdjudicationCategory.findById(request.params.adjudicationCategory_id, function(error, adjudicationCategory) {
            if (error)
            {
                response.send(error);
            }
            else{
                response.send({adjudicationCategory: adjudicationCategory});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AdjudicationCategory.findByIdAndRemove(request.params.adjudicationCategory_id, function(error, adjudicationCategory) {
            if (error)
            {
                response.send(error);
            }
            else{
                response.send({adjudicationCategory: adjudicationCategory});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function(request, response) {
        AdjudicationCategory.findById(request.params.adjudicationCategory_id, function(error, adjudicationCategory) {
            adjudicationCategory.name = request.body.adjudicationCategory.name;
            adjudicationCategory.programYear = request.body.adjudicationCategory.programYear;
            if (request.body.adjudicationCategory.assessmentCodes) adjudicationCategory.assessmentCodes = request.body.adjudicationCategory.assessmentCodes.split();
            adjudicationCategory.save(function(error) {
                if (error)
                {
                    response.send(error);
                }
                else{
                    response.send({adjudicationCategory:adjudicationCategory});
                }
            });
        });
    });

module.exports = router;
    //Expand later.