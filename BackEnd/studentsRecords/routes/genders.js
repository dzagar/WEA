var express = require('express');
var router = express.Router();
var Gender = require('../models/gender');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var gender = new Gender(request.body.gender);
        gender.save(function(error) {
            if (error) {
                response.send(error);
            } else {
                response.json({gender: gender});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            Gender.remove({}, function(err){
                if (err) response.send(err);
                else
                {
                    Gender.find({}, null, {sort: 'name'}, function(error, genders) {
                        if (error)
                            response.send(error)
                        else
                            response.send({gender: genders});
                    });
                    
                }
            });
        }
        else if(request.query.name)
        {
            Gender.find({"name": request.query.name}, function(error, genders) {
                if (error)
                    response.send(error);
                else
                    response.send({gender: genders});
            });
        }
        else if (!Student) {
            Gender.find({}, null, {sort:'name'}, function(error, genders) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({gender: genders});
                }
            });
        } else {
            Gender.find({"student": Student.student}, function (error, students) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({gender: students});
                }
            });
        }
    });

router.route('/:gender_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Gender.findById(request.params.gender_id, function(error, gender) {
            if (error) {
                response.send(error);
            } else {
                response.json({gender: gender});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Gender.findById(request.params.gender_id, function(error, gender) {
            if (error) {
                response.send(error);
            } else {
                gender.name = request.body.gender.name;
                gender.students = request.body.gender.students;

                gender.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({gender: gender});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let failed = false;
        let completed = 0;
        Gender.findByIdAndRemove(request.params.gender_id, function(error, gender) {
            if (error) {
                failed = true;
                response.send(error);
            } else if (gender && gender.students.length > 0) {
                for (let i = 0; i < gender.students.length && !failed; i++) {
                    Student.findById(gender.students[i], function (error, student) {
                        if(error) {
                            failed = true;
                            response.send(error);
                        } else if (student) {
                            student.gender = null;

                            student.save(function (error) {
                                if (error) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completed++;
                                    if (completed === gender.students.length && !failed) {
                                        response.json({deleted: gender});
                                    }
                                }
                            });
                        } else {
                            completed++;
                            if (completed === gender.students.length && !failed) {
                                response.json({deleted: gender});
                            }
                        }
                    });
                }
            } else {
                response.json({deleted: gender});
            }
        });
    });

module.exports = router;