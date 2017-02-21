var express = require('express');
var router = express.Router();
var Grade = require('../models/grade');
var TermCode = require('../models/termCode');
var CourseCode = require('../models/courseCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var grade = new Grade(request.body.grade);

        TermCode.findById(grade.termCode, function (error, termCode) {
            if (error) {
                response.send(error);
            } else {
                termCode.grades.push(grade._id);

                CourseCode.findById(grade.courseCode, function (error, course) {
                    if (error) {
                        response.send(error);
                    } else {                        
                        course.grades.push(grade._id);

                        grade.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                termCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        course.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({grade: grade});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            Grade.remove({}, function(error){
                if (error) {
                    response.send(error);
                } else {
                    Grade.find(function (error, grade){
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({grade: grade});
                        }
                    });
                } console.log('removed grades');
            });
        } else {
            Grade.find(function(error, grades) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({grades: grades});
                }
            });
        }
    });

router.route('/:grade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Grade.findById(request.params.grade_id, function (error, grade) {
            if (error) {
                response.send(error);
            } else {
                response.json({grade: grade});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Grade.findByIdAndRemove(request.params.grade_id, function(error, grade) {
            if(error) {
                response.send(error);
            } else {

                TermCode.findById(grade.termCode, function(error, termCode) {
                    if (error) {
                        response.send(error);
                    } else {
                        termCode.grades.splice(termCodes.grades.indexOf(grade.termCode), 1);

                        CourseCode.findById(grade.courseCode, function(error, courseCode) {
                            if (error) {
                                response.send(error);
                            } else {
                                courseCode.grades.splice(courseCodes.grades.indexOf(grade.termCode), 1);

                                termCode.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {

                                        courseCode.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({deleted: grade});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    
module.exports = router;
    //Expand later.