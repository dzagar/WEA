var express = require('express');
var router = express.Router();
var AdvancedStanding = require('../models/advancedStanding');
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
                        response.json({advancedStanding: advancedStandings});
                    }
            });
        }
    });

// router.route('/:advancedStanding_id')
//     .delete(parseUrlencoded, parseJSON, function (request, response){
//         AdvancedStanding.findByIdAndRemove(request.params.advancedStanding_id, function(error, deleted) {
//             if (error)
//                 response.send(error);
//             response.json({advancedStanding: deleted});
//         });
//     });

module.exports = router;
