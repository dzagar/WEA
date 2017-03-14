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
                    department.programAdministration = null;
                }
            });
        } else {
            response.json({ProgramAdministration: progAdmin});
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            Department.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    Department.find(function (error, departments) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({departments: departments});
                        }
                    });
                }
            });
        } else {
            Department.find(function (error, departments) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({departments: departments});
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