var express = require('express');
var router = express.Router();
var AdvancedStanding = require('../models/advancedStanding');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new advanced standing
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var advancedStanding = new AdvancedStanding(request.body.advancedStanding);

        Student.findById(advancedStanding.student, function (error, student) {
            if (error) {
                response.send(error);
            } else {
                student.advancedStandings.push(advancedStanding._id);

                advancedStanding.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {                    
                        student.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({advancedStanding: advancedStanding});
                            }
                        });   
                    }             
                });
            }
        });
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var Student = request.query.student;

        var deleteAll = request.query.deleteAll;

        if (deleteAll) {
            AdvancedStanding.remove({}, function(error) {
                if (error) {
                    response.send(error);
                } else {
                    AdvancedStanding.find(function (error, advancedStandings) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({advancedStanding: advancedStandings});
                        }
                    });
                } 
                ////console.log('removed advanced standings');
            });
        }
        
        else if (!Student) {
            AdvancedStanding.find(function (error, advancedStandings){
                if (error) {
                    response.send(err);
                } else {
                    response.json({advancedStanding: advancedStandings});
                }
            });
        }
        else
        {
            AdvancedStanding.find({"student" : Student}, function(error, advancedStandings){
                if (error) 
                    {
                        response.send(error);
                    }
                else 
                    {
                        ////console.log(advancedStandings);
                        response.json({advancedStandings: advancedStandings});
                }
            });
            // AdvancedStanding.find({"studentNumber" : Student}, function(error, advancedStandings){
            //     if (error) 
            //         {
            //             response.send(error);
            //         }
            //     else 
            //         {
            //             //console.log(advancedStandings);
            //             response.json({advancedStandings: advancedStandings});
            //         }
            // });
        }
    });

router.route('/:advancedStanding_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStanding.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) {
                response.send(error);
            } else {
                response.json({advancedStanding: advancedStanding});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStanding.findById(request.params.advancedStanding_id, function (error, advancedStanding) {
            if (error) {
                response.send(error);
            } else {
                advancedStanding.student = request.body.advancedStanding.student;
                advancedStanding.course = request.body.advancedStanding.course;
                advancedStanding.description = request.body.advancedStanding.description;
                advancedStanding.units = request.body.advancedStanding.units;
                advancedStanding.grade = request.body.advancedStanding.grade;
                advancedStanding.from = request.body.advancedStanding.from;

                advancedStanding.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({advancedStanding: advancedStanding});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AdvancedStanding.findByIdAndRemove(request.params.advancedStanding_id, function(error, advancedStanding) {
            if (error) {
                response.send(error);
            } else if (advancedStanding) {
                Student.findById(advancedStanding.student, function (error, student) {
                    if (error) {
                        response.send(error);
                    } else if (student) {
                        let index = student.advancedStandings.indexOf(advancedStanding._id);
                        if (index > -1) {
                            student.advancedStandings.splice(index, 1); //removes the item located at index
                        }
                        student.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({advancedStanding: advancedStanding});
                            }
                        });
                    } else {
                        response.json({advancedStanding: advancedStanding});
                    }
                });
            } else {
                response.json({advancedStanding: advancedStanding});
            }
        });
    });

module.exports = router;
