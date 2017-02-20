var express = require('express');
var router = express.Router();
var Grade = require('../models/grade');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var grade = new Grade(request.body.grade);
        grade.save(function(error) {
            if (error)
                response.send(error);
            response.json({grade: grade});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll){
            Grade.remove({}, function(err){
                if (err) response.send(err);
                else
                {
                    Grade.find(function (err, grade){
                        if (err) response.send(err);
                        response.json({grade: grade});
                    });
                } console.log('removed grades');
            });
        }
        else{
        Grade.find(function(error, grades) {
                if (error)
                    response.send(error);
                response.json({grades: grades});
        });

            }
    });

module.exports = router;
    //Expand later.