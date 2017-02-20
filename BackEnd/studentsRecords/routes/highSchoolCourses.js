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

        HighSchool.findById(highSchoolCourse.school, function (error, highSchool) {
            highSchool.courses.push(highSchoolCourse._id);

            HighSchoolSubject.findById(highSchoolCourse.subject, function (error, subject) {
                subject.courses.push(highSchoolCourses._id);

                highSchoolCourse.save(function(error) {
                    if (error)
                        response.send(error);

                    highSchool.save(function (error) {
                        if (error)
                            response.send(error);

                        subject.save(function (error) {
                            if (error)
                                response.send(error);
                            
                            response.json({highSchoolCourse: highSchoolCourse});
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
            HighSchool.findOne({schoolName: request.query.schoolName}, function(error, school) {
                if (error)
                    response.send(error);   //should only return one record anyway
                if(school) {
                    HighSchoolSubject.findOne({name: request.query.subjectName, description: request.query.subjectDescription}, function (error, subject) {
                        if (error)
                            response.send(error);
                        if(subject) {
                            HighSchoolCourse.findOne({level: request.query.level, source: request.query.source, unit: request.query.unit, school: school.id, subject: subject.id}, function (error, course) {
                                if (error)
                                    response.send(error);
                                response.json({highSchoolCourse: course});
                            });
                        } else 
                            response.json({error: "No subject was found"});
                    });
                } else
                    response.json({error: "No highschool was found"});
            });

            /*
            HighSchoolCourse.find({level: request.query.level, source: request.query.source, unit: request.query.unit}, function (error, courses) {
                if (error)
                    response.send(error);
                
                HighSchool.find({schoolName: request.query.schoolName}, function(error, schools) {
                    if(error)
                        response.send(error);
                    
                    let hsCourses = [];
                    for (let c = 0; c < courses.length; c++) {
                        var keep = false;
                        for (let hs = 0; hs < schools.length; hs++) {
                            if (courses[c].school == schools[hs]._id) {
                                keep = true;
                                break;
                            }
                        }
                        if (keep) {
                            hsCourses.push(courses[c]);
                        }
                    }

                    HighSchoolSubject.find({name: request.query.subjectName, description: request.query.subjectDescription}, function (error, subjects) {
                        if (error)
                            response.send(error);
                        
                        let hsSubCourses = [];
                        for (let c = 0; c < hsCourses.length; c++) {
                            keep = false;
                            for (let s = 0; s < subjects.length; s++) {
                                if (hsCourses[c].subject == subjects[s]._id) {
                                    keep = true;
                                    break;
                                }
                            }
                            if (keep) {
                                hsSubCourses.push(hsCourses[c]);
                            }
                        }

                        response.json({highSchoolCourses: hsSubCourses});
                    });
                });
            });*/
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
