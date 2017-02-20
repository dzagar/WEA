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

        TermCode.findById(programRecord.termCode, function (error, termCode) {
            if(error)
                response.send(error);
                
            termCode.programRecords.push(programRecord._id);

            programRecord.save(function(error) {
                if (error)
                    response.send(error);

                termCode.save(function (error) {
                    if (error)
                        response.send(error);

                    response.json({programRecord: programRecord});
                });
            });
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
        ProgramRecord.findById(request.params.programRecord_id, function(error, programRecord) {
            if (error)
                response.send(error);
            response.json({programRecord: programRecord});
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        ProgramRecord.findById(request.params.programRecord_id, function(error, programRecord) {
            if (error) {
                response.send(error);
            } else {
                programRecord.name = request.body.programRecord.name;
                programRecord.level = request.body.programRecord.level;
                programRecord.load = request.body.programRecord.load;
                programRecord.termCode = request.body.programRecord.termCode;
                programRecord.planCodes = request.body.programRecord.planCodes;

                programRecord.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({programRecord: programRecord});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        ProgramRecord.findByIdAndRemove(request.params.programRecord_id, function(error, programRecord) {
            if (error)
                response.send(error);
            response.json({deleted: programRecord});
        });        
    });

module.exports = router;