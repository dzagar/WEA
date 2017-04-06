var express = require('express');
var router = express.Router();
var HighSchoolSubject = require('../models/highSchoolSubject');
var HighSchoolCourse = require('../models/highSchoolCourse');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        //console.log('entered post');
        var highSchoolSubject = new HighSchoolSubject(request.body.highSchoolSubject);
        highSchoolSubject.save(function(error) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchoolSubject: highSchoolSubject});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var o = parseInt(request.query.offset);
        var l = parseInt(request.query.limit);
        var course = request.query.course;
        if (request.query.deleteAll)
        {
            HighSchoolSubject.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else{
                    HighSchoolSubject.find({}, null, {sort: 'name'}, function (error, highSchoolSubject){
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({highSchoolSubject: highSchoolSubject});
                        }
                        //console.log("removed subjects");
                    });
                }
            });
        } else if (course){
            HighSchoolSubject.findOne({courses: course}, function(err, highSchoolSubject){
                //console.log("entered proper fcn");
                if (err) response.send(err);
                else {
                    response.json({highSchoolSubject: highSchoolSubject});
                }
            });
        }
        else if ((o || o == 0) && l) {
            HighSchoolSubject.paginate({}, {sort:'name', offset: o, limit: l }, function(err, highSchoolSubject){
                if (err) response.send(err);
                else {
                    HighSchoolSubject.count({}, function(err, num){
                        if (err) response.send(err);
                        else {
                            response.json({highSchoolSubject: highSchoolSubject.docs, meta: {total: num}});
                        }
                    });
                }
            });
        }
        else if (request.query.name && request.query.description) {
          
            HighSchoolSubject.find({name: request.query.name, description: request.query.description}, function (error, subjects) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchoolSubjects: subjects});
                }
            });  
        } else {
            HighSchoolSubject.find({}, null, {sort: 'name'},function (error, subjects) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchoolSubjects: subjects});
                }
            });
        }
    });

router.route('/:highSchoolSubject_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolSubject.findById(request.params.highSchoolSubject_id, function(error, highSchoolSubject) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchoolSubject: highSchoolSubject})
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolSubject.findById(request.params.highSchoolSubject_id, function(error, highSchoolSubject) {
            if (error) {
                response.send(error);
            } else {
                highSchoolSubject.name = request.body.highSchoolSubject.name;
                highSchoolSubject.description = request.body.highSchoolSubject.description;
                highSchoolSubject.courses = request.body.highSchoolSubject.courses;

                highSchoolSubject.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({highSchoolSubject: highSchoolSubject});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        HighSchoolSubject.findByIdAndRemove(request.params.highSchoolSubject_id, function(error, highSchoolSubject) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (highSchoolSubject && highSchoolSubject.courses.length > 0) {
                for (let i = 0; i < highSchoolSubject.courses.length && !failed; i++) {
                    HighSchoolCourse.findById(highSchoolSubject.courses[i], function (error, course) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (course) {
                            course.subject = null;

                            course.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === highSchoolSubject.courses.length && !failed) {
                                        response.json({deleted: highSchoolSubject});
                                    }
                                }
                            });
                        } else {
                            completed++;
                            if (completed === highSchoolSubject.courses.length && !failed) {
                                response.json({deleted: highSchoolSubject});
                            }
                        }
                    });
                }
            } else {
                response.json({deleted: highSchoolSubject});
            }
        });
    });

module.exports = router;
