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
        var deleteAll = request.query.deleteAll;
        var firstName = request.query.firstName;
        var gender = request.query.gender;
        var l = parseInt(request.query.limit);
        var lastName = request.query.lastName;
        var studentNumber = request.query.number;
        var o = parseInt(request.query.offset);
        var residency = request.query.resInfo;
        var student = request.query.student;

        if (deleteAll) {
            Student.remove({}, function(err){
                if (err) response.send(err);
                else console.log('killed all students');
            });
        }

        if (!student) {
            if (firstName != null || lastName != null || studentNumber != null)
            {
                var regexFName = new RegExp(firstName, "img");
                var regexLName = new RegExp(lastName, "img");
                var regexStudentNum = new RegExp(studentNumber, "img");
                var conditions = {};
                if (firstName != "") conditions["firstName"] = regexFName;
                if (lastName != "") conditions["lastName"] = regexLName;
                if (studentNumber != "") conditions["studentNumber"] = regexStudentNum;

                Student.find(conditions, function(error, students){
                    if (error) response.send(error);
                    else {
                        console.log(students);
                        response.json({student: students});
                    }
                });
            }
            else
            { 
                Student.paginate({}, { offset: o, limit: l },
                    function (error, students) {
                        if (error) response.send(error);
                        Student.count({}, function(err, num) {
                            response.json({student: students.docs, meta: {total: num}});
                        });
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
