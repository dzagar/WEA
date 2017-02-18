var express = require('express');
var router = express.Router();
var HighSchoolCourse = require('../models/highSchoolCourse');
var HighSchoolSubject = require('../models/highSchoolSubject');
var HighSchool = require('../models/highSchool');
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
                     HighSchoolCourse.find(function (err, highSchoolCourse){
                        if (err) response.send(err);
                        else{
                            response.json({highSchoolCourse: highSchoolCourse});
                        }console.log('removed high school courses');
                    });
                }
            });
        } else if (request.query.schoolName && request.query.subjectName && request.query.subjectDescription) {
            HighSchool.find({schoolName: request.query.schoolName}, function(error, schools) {
                if (error)
                    response.send(error);
                let school = schools[0];    //should only return one record anyway
                if(school) {
                    HighSchoolSubject.find({name: request.query.subjectName, description: request.query.subjectDescription}, function (error, subjects) {
                        if (error)
                            response.send(error);
                        let subject = subjects[0];
                        if(subject) {
                            HighSchoolCourse.find({level: request.query.level, source: request.query.source, unit: request.query.unit, subject: subject._id, school: school._id}, function (error, courses) {
                                if (error)
                                    response.send(error);
                                response.json({highSchoolCourses: courses});
                            });
                        } else 
                            response.json({error: "No subject was found"});
                    });
                } else
                    response.json({error: "No highschool was found"});
            });
        } else {
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
