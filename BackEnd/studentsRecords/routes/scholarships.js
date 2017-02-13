var express = require('express');
var router = express.Router();
var Scholarship = require('../models/scholarship');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new scholarship
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var scholarship = new Scholarship(request.body.scholarship);
        scholarship.save(function(error) {
            if (error)
            {
                response.send(error);
            } 
            else
            {
                response.json({scholarship: scholarship});                
            }
        });


    })
    //get all scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var Student = request.query.student;
        
        if (!Student) {

        }
        else
        {
            Scholarship.find({"student" : Student}, function(error, scholarships){
                if (error) response.send(error);
                    else response.json({scholarship: scholarships});
            });
        }
    });

// router.route('/:scholarship_id')
//     //get specific scholarship
//     .get(parseUrlencoded, parseJSON, function (request, response) {
//     })
//     //update scholarship
//     .put(parseUrlencoded, parseJSON, function (request, response) {
//         models.Scholarships.findById(request.params.scholarship_id, function (error, scholarship) {
//         })
//     })
//     //removes user scholarship
//     .delete(parseUrlencoded, parseJSON, function (request, response) {
//     });
module.exports = router;
