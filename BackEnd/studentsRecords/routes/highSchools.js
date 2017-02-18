var express = require('express');
var router = express.Router();
var HighSchool = require('../models/highSchool');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchool = new HighSchool(request.body.highSchool);
        highSchool.save(function(error) {
            if (error)
                response.send(error);
            else{
                response.json({highSchool: highSchool});

            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll)
        {
            console.log("delete All was true");
            HighSchool.remove({}, function(error) {
                    if (error)
                        response.send(error);
                        else{
                            console.log("deleted highschools");
                        }
                });
         }
        else{
             var Student = request.query.filter;
            if (!Student) {
                console.log("no Student passed into hs get");
                HighSchool.find({schoolName: request.query.schoolName}, function(error, highSchools) {
                    if (error)
                        response.send(error);
                        else{
                            response.json({highSchool: highSchools});
                        }
                });
            } else {
                HighSchool.find({"student": Student.student}, function (error, students) {
                    if (error)
                        response.send(error);
                    response.json({highSchool: students});
                });
            } 
        }
    });

    router.route('/:highSchool_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        HighSchool.findById(request.params.highSchool_id, function(error, highSchool) {
            if (error)
                response.send(error);
            response.json({highSchool: highSchool})
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        HighSchool.findById(request.params.highSchool_id, function(error, highSchool) {
            if (error) {
                response.send({error: error});
            } else {
                highSchool.name = request.body.highSchool.name;
                highSchool.students = request.body.highSchool.students;

                highSchool.save(function(error) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        response.json({highSchool: highSchool});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Student.update({"highSchool": request.params.highSchool_id}, {"$set": {"highSchool": null}}, false, 
        function(error, success){
            if (error){
                response.send(error);
            } else {
                HighSchool.findByIdAndRemove(request.params.highSchool_id, function(error, deleted) {
                    if (error)
                        response.send(error);
                    response.json({highSchool: deleted});
                });
            }
        });
        
    });

module.exports = router;
