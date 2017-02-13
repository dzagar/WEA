var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new Student(request.body.student);
        student.save(function (error) {
            if (error) response.send(error);
            response.json({student: student});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        
        var dobFrom = request.query.DOBFrom;
        var dobTo = request.query.DOBTo;
        var firstName = request.query.firstName;
        var gender = request.query.gender;
        var l = parseInt(request.query.limit);
        var lastName = request.query.lastName;
        var number = request.query.number;
        var o = parseInt(request.query.offset);
        var residency = request.query.resInfo;
        var student = request.query.student;
        if (!student) {
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
                Student.find(conditions, function(error, students){
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
                Student.paginate({}, { offset: o, limit: l },
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
            Student.find({"residency": request.query.residency}, function (error, students) {
                if (error) response.send(error);
                response.json({student: students});
            });
        }
    });

router.route('/:student_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Student.findById(request.params.student_id, function (error, student) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({student: student});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Student.findById(request.params.student_id, function (error, student) {
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
        Student.findByIdAndRemove(request.params.student_id,
            function (error, deleted) {
                if (!error) {
                    response.json({student: deleted});
                }
            }
        );
    });
module.exports = router;
