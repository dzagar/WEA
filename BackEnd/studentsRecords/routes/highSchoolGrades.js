var express = require('express');
var router = express.Router();
var HighSchoolGrade = require('../models/highSchoolGrade');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolGrade = new HighSchoolGrade(request.body.highSchoolGrade);
        highSchoolGrade.save(function(error) {
            if (error)
                response.send(error);
            response.json({highSchoolGrade: highSchoolGrade});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        var Student = request.query.student;
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
        if (Student){
            HighSchoolGrade.find({student: Student}, function(err, highSchoolGrades){
                if (err) response.send(err);
                else {
                    response.json({highSchoolGrade: highSchoolGrades});
                }
            });
        }
    });

router.route('/:highSchoolCourses_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        // HighSchoolSubject.findById(request.params.highSchoolSubjects_id, function(error, highSchoolSubject) {
        //     if (error)
        //         response.send(error);
        //     response.json({highSchoolSubject: highSchoolSubject})
        // });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        //HighSchoolSubject.findById(request.params.highSchool_id, function(error, highSchoolSubject) {
            // if (error) {
            //     response.send({error: error});
            // } else {
            //     highSchoolSubject.name = request.body.highSchool.name;
            //     highSchoolSubject.students = request.body.highSchoolSubject.students;

            //     highSchoolSubject.save(function(error) {
            //         if (error) {
            //             response.send({error: error});
            //         } else {
            //             response.json({highSchool: highSchool});
            //         }
            //     });
            // }
        //});
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        // Student.update({"highSchool": request.params.highSchool_id}, {"$set": {"highSchool": null}}, false, 
        // function(error, success){
        //     if (error){
        //         response.send(error);
        //     } else {
        //         HighSchool.findByIdAndRemove(request.params.highSchool_id, function(error, deleted) {
        //             if (error)
        //                 response.send(error);
        //             response.json({highSchool: deleted});
        //         });
        //     }
        // });
        
    });

module.exports = router;
