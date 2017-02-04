var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new scholarship
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStandings = new models.AdvancedStandings(request.body.advancedStandings);
        advancedStandings.save(function(error) {
            if (error)
            {
                response.send(error);
            } 
            else
            {
                response.json({advancedStandings: advancedStandings});                
            }
        });


    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var Student = request.query.student;
        
        if (!Student) {

        }
        else
        {
            models.AdvancedStandings.find({"student" : Student}, function(error, advancedStandings){
                if (error) 
                    {
                        response.send(error);
                    }
                else 
                    {
                        response.json({advancedStandings: advancedStandings});
                    }
            });
        }
    });

module.exports = router;
