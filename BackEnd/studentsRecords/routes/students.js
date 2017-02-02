var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new models.Students(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var l = parseInt(request.query.limit);
        var o = parseInt(request.query.offset);
        var number = request.query.number;
        var firstName = request.query.firstName;
        var lastName = request.query.lastName;
        var gender = parseInt(request.query.gender);
        var dobFrom = request.query.DOBFrom;
        var dobTo = request.query.DOBTo;
        var residency = request.query.resInfo;
        var Student = request.query.student;
        if (!Student) {
            if (firstName != null)
            {
                var conditions = {
                    "firstName": 
                        {"$regex": firstName, "$options": "imx" },
                    "lastName": 
                        {"$regex": lastName, "$options": "imx" },
                    "DOB": {"$gte": new Date(dobFrom), "$lt": new Date(dobTo)}
                };
                if (number != ""){
                    conditions["number"] = {"$regex": number, "$options": "imx" };
                    //conditions.push({"number": number});
                }
                if (residency != -1){
                    conditions["resInfo"] = residency;
                    //conditions.push({"resInfo": residency});
                }
                if (gender != 0){
                    conditions["gender"] = gender;
                    //conditions.push({"gender": gender});
                }
                models.Students.find(conditions, function(error, students){
                    if (error) response.send(error);
                    else response.json({student: students});
                });

                // if (residency == -1)
                // {
                //     if (gender == 0)
                //     {
                //         models.Students.find(
                //             {"firstName": {"$regex": firstName, "$options": "imx" },
                //             "lastName": {"$regex": lastName, "$options": "imx" }}, function (error, students) {
                //                 if (error) response.send(error);
                //                     response.json({student: students});
                //         });
                //     }
                //     else
                //     {
                //         models.Students.find(
                //             {"firstName": {"$regex": firstName, "$options": "imx" },
                //             "lastName": {"$regex": lastName, "$options": "imx" },
                //             "gender": gender}, function (error, students) {
                //                 if (error) response.send(error);
                //                     response.json({student: students});
                //         });
                //     }
                // }
                // else
                // {
                //     if (gender == 0)
                //     {
                //         models.Students.find(
                //             {"firstName": {"$regex": firstName, "$options": "imx" },
                //             "lastName": {"$regex": lastName, "$options": "imx" },
                //             "resInfo": residency}, function (error, students) {
                //                 if (error) response.send(error);
                //                     response.json({student: students});
                //         });
                //     }
                //     else
                //     {
                //         models.Students.find(
                //             {"firstName": {"$regex": firstName, "$options": "imx" },
                //             "lastName": {"$regex": lastName, "$options": "imx" },
                //             "resInfo": residency,
                //             "gender": gender}, function (error, students) {
                //                 if (error) response.send(error);
                //                     response.json({student: students});
                //         });
                //     }
                // }
            }
            else
            { 
                models.Students.paginate({}, { offset: o, limit: l },
                    function (error, students) {
                        if (error) response.send(error);
                        response.json({student: students.docs});
                    });

            }
            //models.Students.find(function (error, students) {
            //    if (error) response.send(error);
            //    response.json({student: students});
            //});
        } else {
            //        if (Student == "residency")
            models.Students.find({"residency": request.query.residency}, function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                student.number = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;

                student.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({student: student});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        models.Students.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    response.json({student: deleted});
                }
            }
        );
    });
module.exports = router;
