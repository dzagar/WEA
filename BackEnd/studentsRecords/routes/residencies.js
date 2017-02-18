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
            if (error) response.send(error);
            response.json({residency: residency});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var Student = request.query.filter;
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            Residency.remove({}, function(err){
                if (err) response.send(err);
                else console.log('residencies removed');
            });
        }
        if (!Student) {
            Residency.find(function (error, residencies) {
                if (error) response.send(error);
                response.json({residency: residencies});
            });
        } else {
            Residency.find({"student": Student.student}, function (error, students) {
                if (error) response.send(error);
                response.json({residency: students});
            });
        }
    });

router.route('/:residency_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Residency.findById(request.params.residency_id, function (error, residency) {
            if (error) response.send(error);
            response.json({residency: residency});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Residency.findById(request.params.residency_id, function (error, residency) {
            if (error) {
                response.send({error: error});
            }
            else {
                residency.name = request.body.residency.name;
                residency.students = request.body.residency.students;

                residency.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({residency: residency});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Student.update({"resInfo": request.params.residency_id}, {"$set": {"resInfo": null}}, false, 
        function(error, success){
            if (error){
                response.send(error);
            } else {
                Residency.findByIdAndRemove(request.params.residency_id, function(error, deleted) {
                    if (error)
                        response.send(error);
                    response.json({residency: deleted});
                });
            }
        });
    });

module.exports = router;
