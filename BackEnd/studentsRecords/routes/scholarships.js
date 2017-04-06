var express = require('express');
var router = express.Router();
var Scholarship = require('../models/scholarship');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new scholarship
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var scholarship = new Scholarship(request.body.scholarship);
        Student.findById(scholarship.student, function(error, student) {
            if (error) {
                response.send(error);
            } else {
                student.scholarships.push(scholarship._id);

                scholarship.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        student.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({scholarship: scholarship}); 
                            }
                        }); 
                    }              
                });
            }
        });
    })
    //get all scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        var Student = request.query.student;
        if (deleteAll){
            Scholarship.remove({}, function(err){
                if (err) response.send(err);
                //else //console.log('removed scholarships');
            });
        }
        if (!Student) {
            Scholarship.find(function(error, scholarships){
                if (error) {
                    response.send(error);
                } else {
                    response.json({scholarships: scholarships});
                }
            });
        }
        else
        {
            
            Scholarship.find({"student" : Student}, function(error, scholarships){
                if (error) response.send(error);
                else {
                    response.json({scholarship: scholarships});
                }
            });
        }
    });

router.route('/:scholarship_id')
    //get specific scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Scholarship.findById(request.params.scholarship_id, function (error, scholarship) {
            if (error) {
                response.send(error);
            } else {
                response.json({scholarship: scholarship});
            }
        });
    })

    //update scholarship
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Scholarship.findById(request.params.scholarship_id, function (error, scholarship) {
            if (error) {
                response.send(error);
            } else {
                scholarship.student = request.body.scholarship.student;
                scholarship.note = request.body.scholarship.note;

                scholarship.save(function (error){
                    if (error){
                        response.send(error);
                    } else {
                        response.json({scholarship: scholarship});
                    }
                });
            }
        });
    })

    //removes user scholarship
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Scholarship.findByIdAndRemove(request.params.scholarship_id, function(error, scholarship) {
            if (error) {
                response.send(error);
            } else if (scholarship) {
                Student.findById(scholarship.student, function (error, student) {
                    if (error) {
                        response.send(error);
                    } else if (student) {
                        let index = student.scholarships.indexOf(scholarship._id);
                        if (index > -1) {
                            student.scholarships.splice(index, 1);
                        }
                        student.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({scholarship: scholarship});
                            }
                        });
                    } else {
                        response.json({scholarship: scholarship});
                    }
                });
            } else {
                response.json({scholarship: scholarship});
            }
        });
    });
module.exports = router;
