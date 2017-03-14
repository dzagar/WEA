var express = require('express');
var router = express.Router();
var Department = require('../models/department');
var ProgramAdministration = require('../models/programAdministration');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var progAdmin = new ProgramAdministration(request.body.ProgramAdministration);

        if (progAdmin.department) {
            Department.findById(progAdmin.department, function(error, department) {
                if (error) {
                    response.send(error);
                } else if (department) {
                    department.programAdministrations.push(progAdmin._id);

                    department.save(function(error) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({programAdministration: progAdmin});
                        }
                    });
                } else {
                    response.json({programAdministration: progAdmin});
                }
            });
        } else {
            response.json({programAdministration: progAdmin});
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            ProgramAdministration.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    ProgramAdministration.find(function (error, progAdmins) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({programAdministrations: progAdmins});
                        }
                    });
                }
            });
        } else {
            ProgramAdministration.find(function (error, progAdmins) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({programAdministrations: progAdmins});
                }
            });
        }
    });

router.route('/:department_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Department.findById(request.params.department_id, function (error, department) {
            if (error) {
                response.send(error);
            } else {
                response.json({department: department});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        
    });

module.exports = router;