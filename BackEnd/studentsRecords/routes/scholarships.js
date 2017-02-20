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
            student.scholarships.push(scholarship._id);

            scholarship.save(function(error) {
                if (error)
                    response.send(error);
                
                student.save(function (error) {
                    if (error)
                        response.send(error);

                    response.json({scholarship: scholarship}); 
                });               
            });
        });
    })
    //get all scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        var Student = parseInt(request.query.student);
        if (deleteAll){
            Scholarship.remove({}, function(err){
                if (err) response.send(err);
                else console.log('removed scholarships');
            });
        }
        if (!Student) {
            Scholarship.find(function(err, scholarships){
                if (err)
                    response.send(err);
                response.json({scholarships: scholarships});
            });
        }
        else
        {
            
            Scholarship.find({"studentNumber" : Student}, function(error, scholarships){
                if (error) response.send(error);
                else {
                    response.json({scholarship: scholarships});
                }
            });
        }
    });

router.route('/:scholarship_id')
//     //get specific scholarship
//     .get(parseUrlencoded, parseJSON, function (request, response) {
//     })
//     //update scholarship
//     .put(parseUrlencoded, parseJSON, function (request, response) {
//         models.Scholarships.findById(request.params.scholarship_id, function (error, scholarship) {
//         })
//     })
//     //removes user scholarship
    // .delete(parseUrlencoded, parseJSON, function (request, response) {
    //     Scholarship.findByIdAndRemove(request.params.scholarship_id, function(error, deleted) {
    //         if (error)
    //             response.send(error);
    //         response.json({scholarship: deleted});
    //     });
    // });
module.exports = router;
