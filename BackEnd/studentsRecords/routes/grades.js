var express = require('express');
var router = express.Router();
var Grade = require('../models/grade');
var TermCode = require('../models/termCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var grade = new Grade(request.body.grade);

        TermCode.findById(grade.termCode, function (error, termCode) {
            termCode.grades.push(grade._id);

            grade.save(function(error) {
                if (error)
                    response.send(error);

                termCode.save(function(error) {
                    if (error)
                        response.send(error);

                    response.json({grade: grade});
                });
            });
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
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
        else {
            Grade.find(function(error, grades) {
                    if (error)
                        response.send(error);
                    response.json({grades: grades});
            });

        }
    });

router.route('/:grade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Grade.findById(request.params.grade_id, function (error, grade) {
            if (error)
                response.send(error);
            response.json({grade: grade});
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Grade.findByIdAndRemove(request.params.grade_id, function(error, grade) {
            if(error)
                response.send(error);
            response.send({deleted: grade});
        });
    });
    
module.exports = router;
    //Expand later.