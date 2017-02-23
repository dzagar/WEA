var express = require('express');
var router = express.Router();
var AdvancedStanding = require('../models/advancedStanding');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new advanced standing
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStandings = new AdvancedStanding(request.body.advancedStanding);
        advancedStandings.save(function(error) {
            if (error)
            {
                response.send(error);
            } 
            else
            {
                response.json({advancedStanding: advancedStandings});                
            }
        });


    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var Student = request.query.student;

        var deleteAll = request.query.deleteAll;

        if (deleteAll){
            AdvancedStanding.remove({}, function(err){
                if (err) response.send(err);
                else
                {
                    AdvancedStanding.find(function (err, advancedStandings){
                        if (err) response.send(err);
                        response.json({advancedStanding: advancedStandings});
                    });
                } console.log('removed advanced standings');
            });
        }
        
        else if (!Student) {
            AdvancedStanding.find(function (err, advancedStandings){
                if (err)
                    response.send(err);
                response.json({advancedStanding: advancedStandings});
            });
        }
        else
        {
            AdvancedStanding.find({"student" : Student}, function(error, advancedStandings){
                if (error) 
                    {
                        response.send(error);
                    }
                else 
                    {
                        //console.log(advancedStandings);
                        response.json({advancedStandings: advancedStandings});
                    }
            });
            // AdvancedStanding.find({"studentNumber" : Student}, function(error, advancedStandings){
            //     if (error) 
            //         {
            //             response.send(error);
            //         }
            //     else 
            //         {
            //             console.log(advancedStandings);
            //             response.json({advancedStandings: advancedStandings});
            //         }
            // });
        }
    });

router.route('/:advancedStanding_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStanding.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error)
                response.send(error);
            response.json({advancedStanding: advancedStanding});
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStanding.findByIdAndRemove(request.params.advancedStanding_id, function(error, advancedStanding) {
            if(error)
                response.send(error);
            response.send({deleted: advancedStanding});
        });
    });

module.exports = router;
