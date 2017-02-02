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
        //get
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        //put
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        //delete
    });

module.exports = router;