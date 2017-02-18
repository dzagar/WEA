var express = require('express');
var router = express.Router();
var HighSchoolCourse = require('../models/highSchoolCourse');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolCourse = new HighSchoolCourse(request.body.highSchoolCourse);
        highSchoolCourse.save(function(error) {
            if (error)
                response.send(error);
            response.json({highSchoolCourse: highSchoolCourse});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll)
        {
            HighSchoolCourse.remove({}, function(error) {
                if (error)
                {
                    response.send(error);
                }
                else{
                    console.log("deleted Courses");
                }
            });
        }
        else{
            HighSchoolCourse.find({level: request.query.level, source: request.query.source, unit: request.query.unit}, function (error, courses) {
                if (error)
                    response.send(error);
                response.json({highSchoolCourses: courses});
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
