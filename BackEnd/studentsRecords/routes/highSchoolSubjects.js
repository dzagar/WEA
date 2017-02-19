var express = require('express');
var router = express.Router();
var HighSchoolSubject = require('../models/highSchoolSubject');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var highSchoolSubject = new HighSchoolSubject(request.body.highSchoolSubject);
        highSchoolSubject.save(function(error) {
            if (error)
                response.send(error);
            response.json({highSchoolSubject: highSchoolSubject});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll)
        {
            HighSchoolSubject.remove({}, function(error) {
                if (error)
                {
                    response.send(error);
                }
                else{
                    HighSchoolSubject.find(function (err, highSchoolSubject){
                        if (err) response.send(err);
                        else{
                            response.json({highSchoolSubject: highSchoolSubject});
                        }console.log("removed subjects");
                    });
                }
            });
        }
        else{
          
            HighSchoolSubject.find({name: request.query.name, description: request.query.description}, function (error, subjects) {
                if (error)
                    response.send(error);
                response.json({highSchoolSubjects: subjects});
            });  
        }
    });

    router.route('/:highSchoolSubjects_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        // HighSchoolSubject.findById(request.params.highSchoolSubjects_id, function(error, highSchoolSubject) {
        //     if (error)
        //         response.send(error);
        //     response.json({highSchoolSubject: highSchoolSubject})
        // });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        //HighSchoolSubject.findById(request.params.highSchool_id, function(error, highSchoolSubject) {
            // if (error) {
            //     response.send({error: error});
            // } else {
            //     highSchoolSubject.name = request.body.highSchool.name;
            //     highSchoolSubject.students = request.body.highSchoolSubject.students;

            //     highSchoolSubject.save(function(error) {
            //         if (error) {
            //             response.send({error: error});
            //         } else {
            //             response.json({highSchool: highSchool});
            //         }
            //     });
            // }
        //});
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        // Student.update({"highSchool": request.params.highSchool_id}, {"$set": {"highSchool": null}}, false, 
        // function(error, success){
        //     if (error){
        //         response.send(error);
        //     } else {
        //         HighSchool.findByIdAndRemove(request.params.highSchool_id, function(error, deleted) {
        //             if (error)
        //                 response.send(error);
        //             response.json({highSchool: deleted});
        //         });
        //     }
        // });
        
    });

module.exports = router;
