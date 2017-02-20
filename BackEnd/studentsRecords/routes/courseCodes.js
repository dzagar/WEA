var express = require('express');
var router = express.Router();
var CourseCode = require('../models/courseCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var courseCode = new CourseCode(request.body.courseCode);
        courseCode.save(function(error) {
            if (error)
            {
                response.send(error);
                console.log(error);
            }
            else{
                response.json({courseCode: courseCode});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll){
            CourseCode.remove({}, function(err){
                if (err) response.send(err);
                else
                {
                    CourseCode.find(function (err, courseCode){
                        if (err) response.send(err);
                        response.json({courseCode: courseCode});
                    });
                } console.log('removed courseCodes');
            });
        }
        else if (request.query.courseLetter && request.query.courseNumber)
        {
            CourseCode.findOne({courseLetter: request.query.courseLetter, courseNumber: request.query.courseNumber}, function(error, courseCode) {
                if (error)
                {
                    response.send({error: error});
                    console.log("error trying to find a course by number and letter")

                }
                else{
                    response.send({courseCode: courseCode});
                }
            });

        }
        else{
        CourseCode.find(function(error, courseCodes) {
                if (error)
                    response.send(error);
                response.json({courseCodes: courseCodes});
        });

            }
    });

module.exports = router;
    //Expand later.