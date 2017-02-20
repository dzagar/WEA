var express = require('express');
var router = express.Router();
var Student = require('../models/student');
var Gender = require('../models/gender');
var Residency = require('../models/residency');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var student = new Student(request.body.student);

        Gender.findById(student.gender, function(error, gender) {
            if (error)
                response.send(error);
            
            gender.students.push(student._id);

            Residency.findById(student.resInfo, function (error, residency) {
                if (error)
                    response.send(error);

                residency.students.push(student._id);

                student.save(function (error) {
                    if (error) 
                        response.send(error);
                    
                    gender.save(function (error) {
                        if (error)
                            response.send(error);

                        residency.save(function (error) {
                            if (error)
                                response.send(error);

                            response.json({student: student});
                        });
                    });
                });
            });
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
                student.studentNumber = request.body.student.number;
                student.firstName = request.body.student.firstName;
                student.lastName = request.body.student.lastName;
                student.gender = request.body.student.gender;
                student.DOB = request.body.student.DOB;
                student.photo = request.body.student.photo;
                student.resInfo = request.body.student.resInfo;
                student.registrationComments = request.body.student.registrationComments;
                student.basisOfAdmission = request.body.student.basisOfAdmission;
                student.admissionAverage = request.body.student.admissionAverage;
                student.admissionComments = request.body.student.admissionComments;
                student.scholarships = request.body.student.scholarships;
                student.termCodes = request.body.student.termCodes;

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
            function (error, student) {
                if (error)
                    response.send(error);

                for(let tc = 0; tc < student.termCodes.length; tc++)
                {
                    console.log(student.termCodes[tc]);
                }

                response.json({deleted: student});
            }
        );
    });
module.exports = router;
