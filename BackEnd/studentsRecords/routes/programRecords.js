var express = require('express');
var router = express.Router();
var ProgramRecord = require('../models/programRecord');
var Student = require('../models/student');
var TermCode = require('../models/termCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var programRecord = new ProgramRecord(request.body.programRecord);
        programRecord.save(function(error) {
            if (error)
                response.send(error);
            response.json({programRecord: programRecord});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            ProgramRecord.remove({}, function(err){
                if (err) response.send(err);
                else console.log('all program Records removed');
            })
        }
        else if (request.query.studentNumber &&request.query.termName &&request.query.programName &&request.query.level &&request.query.load)
        {
            //student.find
            Student.findOne({studentNumber: request.query.studentNumber}, function(error, student) {
                TermCode.findOne({name: request.query.termName, student: student.id}, function(error, term) {
                    ProgramRecord.findOne({termCode: term, name: request.query.programName, level: request.query.level, load: request.query.load}, function(error, programRecord) {
                        if (error){
                            response.send({error: error});
                        }
                        else{
                            response.send({programRecord: programRecord});
                        }
                    });
                });
            });
            //then term.find
            //then PR.find

        }
        // studentNumber: planStudentNumber,
        // termName: planTerm,
        // programName: planProgramName,
        // level: planLevel,
        // load: planLoad
        else {
            ProgramRecord.find({}, function (error, programRecords) {
                if (error)
                    response.send(error);
                response.json({programRecords: programRecords});
            });
        }
    });

router.route('/:programRecord_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        // Gender.findById(request.params.gender_id, function(error, gender) {
        //     if (error)
        //         response.send(error);
        //     response.json({gender: gender})
        // });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        // Gender.findById(request.params.gender_id, function(error, gender) {
        //     if (error) {
        //         response.send({error: error});
        //     } else {
        //         gender.name = request.body.gender.name;
        //         gender.students = request.body.gender.students;

        //         gender.save(function(error) {
        //             if (error) {
        //                 response.send({error: error});
        //             } else {
        //                 response.json({gender: gender});
        //             }
        //         });
        //     }
        // });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        // Student.update({"gender": request.params.gender_id}, {"$set": {"gender": null}}, false, 
        // function(error, success){
        //     if (error){
        //         response.send(error);
        //     } else {
        //         Gender.findByIdAndRemove(request.params.gender_id, function(error, deleted) {
        //             if (error)
        //                 response.send(error);
        //             response.json({gender: deleted});
        //         });
        //     }
        // });
        
    });

module.exports = router;