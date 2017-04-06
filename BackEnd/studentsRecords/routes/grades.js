var express = require('express');
var router = express.Router();
var Grade = require('../models/grade');
var Term = require('../models/term');
var CourseCode = require('../models/courseCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var grade = new Grade(request.body.grade);

        Term.findById(grade.term, function (error, term) {
            if (error) {
                response.send(error);
            } else {
                term.grades.push(grade._id);

                CourseCode.findById(grade.courseCode, function (error, course) {
                    if (error) {
                        response.send(error);
                    } else {                        
                        course.grades.push(grade._id);

                        grade.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                term.save(function(error) {
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
                } //console.log('removed grades');
            });
        } 
        else if (request.query.term)
        {
            Grade.find({term: request.query.term}, function(error, grades) {
                if (error)
                {
                    response.send(error);
                }
                else{
                    response.send({grades:grades});
                }

            });
        }
        else {
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
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Grade.findById(request.params.grade_id, function(error, grade) {
            if (error) {
                response.send(error);
            } else {
                grade.mark = request.body.grade.mark;
                grade.note = request.body.grade.note;
                grade.termCode = request.body.grade.termCode;
                grade.courseCode = request.body.grade.courseCode;

                grade.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({grade: grade});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        Grade.findByIdAndRemove(request.params.grade_id, function(error, grade) {
            if(error) {
                failed = true;
                response.send(error);
            } else if (grade) {

                Term.findById(grade.term, function(error, term) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (term) {
                        let index = term.grades.indexOf(grade._id);
                        if (index > -1) {
                            term.grades.splice(index, 1);
                        }

                        term.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 2 && !failed) {
                                    response.json({grade: grade});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 2 && !failed) {
                            response.json({grade: grade});
                        }
                    }
                });

                CourseCode.findById(grade.courseCode, function(error, courseCode) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (courseCode) {
                        let index = courseCode.grades.indexOf(grade._id);
                        if (index > -1) {
                            courseCode.grades.splice(index, 1);
                        }

                        courseCode.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 2 && !failed) {
                                    response.json({grade: grade});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 2 && !failed) {
                            response.json({grade: grade});
                        }
                    }
                });
            } else {
                response.json({grade: grade});
            }
        });
    });
    
module.exports = router;
    //Expand later.