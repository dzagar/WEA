var express = require('express');
var router = express.Router();
var TermCode = require('../models/termCode');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var termCode = new TermCode(request.body.termCode);
        termCode.save(function(error) {
            if (error)
                response.send(error);
            response.json({termCode: termCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll)
        {
            TermCode.remove({}, function(error) {
                if (error)
                    response.send(error);
                else
                {
                    TermCode.find(function(error, termCodes) {
                        if (error)
                            response.send(error);
                        else{
                            response.json({termCodes: termCodes});
                            console.log("removed term codes");
                        }
                    });
                }
            });
        }
        else if (request.query.studentNumber && request.query.name) {
            Student.find({studentNumber: request.query.studentNumber}, function(error, students) {
                if (error)
                    response.send(error);
                else{                    
                    let student = students[0];    //should only return one record anyway
                    if(student) {
                        TermCode.find({name: request.query.name, student: student.id}, function (error, termCode) {
                            if (error)
                                response.send(error);
                            else 
                                response.json({termCode: termCode});
                        });
                    } else
                        response.json({error: "No student was found"});
                }
            });
        }
        else{ 
            TermCode.find(function(error, termCodes) {
                    if (error)
                        response.send(error);
                    response.json({termCodes: termCodes});
            });
        }
    });
module.exports = router;

    //Expand later.
