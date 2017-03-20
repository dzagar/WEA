var express = require('express');
var router = express.Router();
var Residency = require('../models/residency');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var residency = new Residency(request.body.residency);
        residency.save(function (error) {
            if (error) {
                response.send(error);
            } else {
                response.json({residency: residency});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            Residency.remove({}, function(err){
                if (err) response.send(err);
                else 
                {
                    Residency.find({}, null, {sort: 'name'}, function(error, residencies){
                        if (error)
                            response.send(error);
                        else
                            response.send({residencies:residencies});
                    });
                }
            });
        }
        else if (request.query.name)
        {
            Residency.find({"name": request.query.name}, function(error, residency) {
                if (error)
                    response.send(error);
                else   
                    response.send({residency: residency});
            });
        }
        else if (!Student) {
            Residency.find(function (error, residencies) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({residency: residencies});   
                }
            });
        } else {
            Residency.find({"student": Student.student}, function (error, students) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({residency: students});
                }
            });
        }
    });

router.route('/:residency_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Residency.findById(request.params.residency_id, function (error, residency) {
            if (error) {
                response.send(error);
            } else {
                response.json({residency: residency});
            }
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Residency.findById(request.params.residency_id, function (error, residency) {
            if (error) {
                response.send(error);
            } else {
                residency.name = request.body.residency.name;
                residency.students = request.body.residency.students;

                residency.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({residency: residency});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        Residency.findByIdAndRemove(request.params.residency_id, function(error, residency) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (residency && residency.students.length > 0) {
                for (let i = 0; i < residency.students.length && !failed; i++) {
                    Student.findById(residency.students[i], function (error, student) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (student) {
                            student.resInfo = null;

                            student.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === residency.students.length && !failed) {
                                        response.json({deleted: residency});
                                    }
                                }
                            });

                        } else {
                            completed++;
                            if (completed === residency.students.length && !failed) {
                                response.json({deleted: residency});
                            }
                        }
                    });
                }
            } else {
                response.json({deleted: residency});
            }
        });
    });

module.exports = router;
