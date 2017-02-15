var express = require('express');
var router = express.Router();
var HighSchoolCourseInfo = require('../models/highSchoolCourseInfo');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolCourseInfo = new HighSchoolCourseInfo(request.body.highSchoolCourseInfo);
        highSchoolCourseInfo.save(function(error) {
            if (error)
            {
                response.send(error);
            } 
            else
            {
                response.json({highSchoolCourseInfo: highSchoolCourseInfo});                
            }
        });


    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var Student = request.query.student;
        
        if (!Student) {

        }
        else
        {
            HighSchoolCourseInfo.find({"student" : Student}, function(error, highSchoolCourseInfo){
                if (error) 
                    {
                        response.send(error);
                    }
                else 
                    {
                        response.json({highSchoolCourseInfo: highSchoolCourseInfo});
                    }
            });
        }
    });

module.exports = router;