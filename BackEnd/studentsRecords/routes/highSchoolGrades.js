var express = require('express');
var router = express.Router();
var HighSchoolGrade = require('../models/highSchoolGrade');
var HighSchoolCourse = require('../models/highSchoolCourse');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolGrade = new HighSchoolGrade(request.body.highSchoolGrade);

        Student.findById(highSchoolGrade.student, function (error, student) {
            if (error)
                response.send(error);

            student.highSchoolGrades.push(highSchoolGrade._id);

            HighSchoolCourse.findById(highSchoolGrade.source, function (error, course) { 
                if (error)
                    response.send(error);
                    
                course.grades.push(highSchoolGrade._id);

                highSchoolGrade.save(function (error) {
                    if (error)
                        response.send(error);
                    
                    student.save(function (error) {
                        if (error)
                            response.send(error);

                        course.save(function (error) {
                            if (error)
                                respnose.send(error);

                            response.json({highSchoolGrade: highSchoolGrade});
                        });
                    });
                });
            });
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll)
        {
            HighSchoolGrade.remove({}, function(error) {
                if (error)
                {
                    response.send(error);
                }
                else{
                     HighSchoolGrade.find(function (err, highSchoolGrade){
                        if (err) response.send(err);
                        else{
                            response.json({highSchoolGrade: highSchoolGrade});
                        }console.log('removed high school grades');
                    });
                }
            });
        }
    });

router.route('/:highSchoolGrade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolGrade.findById(request.params.highSchoolGrade_id, function(error, highSchoolGrade) {
            if (error)
                response.send(error);
            response.json({highSchoolGrade: highSchoolGrade})
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolGrade.findById(request.params.highSchool_id, function(error, highSchoolGrade) {
            if (error)
                response.send(error);

            highSchoolGrade.level = request.body.highSchoolGrade.level;
            highSchoolGrade.source = request.body.highSchoolGrade.source;
            highSchoolGrade.unit = request.body.highSchoolGrade.unit;
            highSchoolGrade.subject = request.body.highSchoolGrade.subject;
            highSchoolGrade.school = request.body.highSchoolGrade.school;
            highSchoolGrade.grades = request.body.highSchoolGrade.grades;

            highSchoolGrades.save(function(error) {
                if (error)
                    response.send(error);

                response.json({highSchoolGrades: highSchoolGrades});
            });
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolGrade.findByIdAndRemove(request.params.highSchoolGrade_id, function(error, highSchoolGrade) {
            if (error)
                response.send(error);
            response.json({deleted: highSchoolGrade});
        });
    });

module.exports = router;
