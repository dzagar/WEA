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
            if (error) {
                response.send(error);
            } else {
                student.highSchoolGrades.push(highSchoolGrade._id);

                HighSchoolCourse.findById(highSchoolGrade.source, function (error, course) { 
                    if (error) {
                        response.send(error);
                    } else {
                        course.grades.push(highSchoolGrade._id);

                        highSchoolGrade.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                student.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        course.save(function (error) {
                                            if (error) {
                                                respnose.send(error);
                                            } else {
                                                response.json({highSchoolGrade: highSchoolGrade});
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
        var deleteAll = request.query.deleteAll;
        var Student = request.query.student;
        if (deleteAll)
        {
            HighSchoolGrade.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else {
                     HighSchoolGrade.find(function (error, highSchoolGrade){
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({highSchoolGrade: highSchoolGrade});
                        }
                        //console.log('removed high school grades');
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

router.route('/:highSchoolGrade_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolGrade.findById(request.params.highSchoolGrade_id, function(error, highSchoolGrade) {
            if (error) {
                response.send(error);
            } else {
                response.json({highSchoolGrade: highSchoolGrade})
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchoolGrade.findById(request.params.highSchoolGrade_id, function(error, highSchoolGrade) {
            if (error) {
                response.send(error);
            } else {
                highSchoolGrade.mark = request.body.highSchoolGrade.mark;
                highSchoolGrade.source = request.body.highSchoolGrade.source;
                highSchoolGrade.student = request.body.highSchoolGrade.student;

                highSchoolGrade.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({highSchoolGrade: highSchoolGrade});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        HighSchoolGrade.findByIdAndRemove(request.params.highSchoolGrade_id, function(error, highSchoolGrade) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (highSchoolGrade) {

                Student.findById(highSchoolGrade.student, function (error, student) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (student) {
                        let index = student.highSchoolGrades.indexOf(highSchoolGrade._id);
                        if (index > -1) {
                            student.highSchoolGrades.splice(index, 1);
                        }

                        student.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 2 && !failed) {
                                    response.json({deleted: highSchoolGrade});
                                }
                            }
                        });

                    } else {
                        completed++;
                        if (completed === 2 && !failed) {
                            response.json({deleted: highSchoolGrade});
                        }
                    }
                });

                HighSchoolCourse.findById(highSchoolGrade.source, function(error, course) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (course) {
                        let index = course.grades.indexOf(highSchoolGrade._id);
                        if (index > -1) {
                            course.grades.splice(index, 1);
                        }

                        course.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 2 && !failed) {
                                    response.json({deleted: highSchoolGrade});
                                }
                            }
                        });

                    } else {
                        completed++;
                        if (completed === 2 && !failed) {
                            response.json({deleted: highSchoolGrade});
                        }
                    }
                });
            } else {
                response.json({deleted: highSchoolGrade});
            }
        });
    });

module.exports = router;
