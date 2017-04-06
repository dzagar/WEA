var express = require('express');
var router = express.Router();
var HighSchool = require('../models/highSchool');
var HighSchoolCourse = require('../models/highSchoolCourse');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchool = new HighSchool(request.body.highSchool);
        highSchool.save(function(error) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchool: highSchool});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var o = parseInt(request.query.offset);
        var l = parseInt(request.query.limit);
        if (request.query.deleteAll)
        {
            //console.log("delete All was true");
            HighSchool.remove({}, function(error) {
                    if (error)
                        response.send(error);
                    else{
                        HighSchool.find({}, function(error, highSchool) {
                            if (error)
                                response.send(error);
                                else{
                                    response.json({highSchool: highSchool});
                                }
                        });
                    } //console.log("removed highschools");
                });
         }
        else if (request.query.course){
            var course = request.query.course;
            HighSchool.findOne({courses: course}, function(err, highSchool){
                if (err) response.send(err);
                else {
                    response.json({highSchool: highSchool});
                }
            });
        }

        else if ((o || o == 0) && l) {
            HighSchool.paginate({}, {sort: 'schoolName', offset: o, limit: l }, function(err, highSchool){
                if (err) response.send(err);
                else {
                    HighSchool.count({}, function(err, num){
                        if (err) response.send(err);
                        else {
                            response.json({highSchool: highSchool.docs, meta: {total: num}});
                        }
                    });
                }
            });
        }
        else if (request.query.filter) {
             var Student = request.query.filter;
             HighSchool.find({"student": Student.student}, function (error, highSchool) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchool: highSchool});
                }
            });
        } else if (request.query.schoolName) {
            HighSchool.find({schoolName: request.query.schoolName}, function(error, highSchool) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchool: highSchool});
                }
            });
        } else {
            HighSchool.find( {}, null, {sort: 'schoolName'}, function (error, highSchool) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({highSchool: highSchool});
                }
            });
        }
    });

    router.route('/:highSchool_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchool.findById(request.params.highSchool_id, function(error, highSchool) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchool: highSchool})
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchool.findById(request.params.highSchool_id, function(error, highSchool) {
            if (error) {
                response.send(error);
            } else {

                highSchool.schoolName = request.body.highSchool.schoolName;
                highSchool.courses = request.body.highSchool.courses;

                highSchool.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({highSchool: highSchool});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        HighSchool.findByIdAndRemove(request.params.highSchool_id, function(error, school) {
            //console.log(school);
            if (error) {
                failed = true;
                response.send(error);
            } else if (school && school.courses.length > 0) {
                for (let i = 0; i < school.courses.length && !failed; i++) {
                    HighSchoolCourse.findById(school.courses[i], function (error, course) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (course) {
                            course.school = null;

                            course.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === school.courses.length && !failed) {
                                        response.json({deleted: school});
                                    }
                                }
                            });

                        } else {
                            completed++;
                            if (completed === school.courses.length && !failed) {
                                response.json({deleted: school});
                            }
                        }
                    });
                }
            } else {
                response.json({deleted: school});
            }
        });
    });

module.exports = router;
