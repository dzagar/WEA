var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var gender = new models.Genders(request.body.gender);
        gender.save(function(error) {
            if (error)
                response.send(error);
            response.json({gender: gender});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        if (!Student) {
            models.Genders.find(function(error, genders) {
                if (error)
                    response.send(error);
                response.json({gender: genders});
            });
        } else {
            models.Genders.find({"student": Student.student}, function (error, students) {
                if (error)
                    response.send(error);
                response.json({gender: students});
            });
        }
    });

router.route('/:gender_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Genders.findById(request.params.gender_id, function(error, gender) {
            if (error)
                response.send(error);
            response.json({gender: gender})
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Genders.findById(request.params.gender_id, function(error, gender) {
            if (error) {
                response.send({error: error});
            } else {
                gender.name = request.body.gender.name;
                gender.students = request.body.gender.students;

                gender.save(function(error) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        response.json({gender: gender});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.update({"gender": request.params.gender_id}, {"$set": {"gender": null}}, false, 
        function(error, success){
            if (error){
                response.send(error);
            } else {
                models.Genders.findByIdAndRemove(request.params.gender_id, function(error, deleted) {
                    if (error)
                        response.send(error);
                    response.json({gender: deleted});
                });
            }
        });
        
    });

module.exports = router;