var express = require('express');
var router = express.Router();
var Department = require('../models/department');
var ProgramAdministration = require('../models/programAdministration');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var progAdmin = new ProgramAdministration(request.body.programAdministration);

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
                            progAdmin.save(function (error) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    response.json({programAdministration: progAdmin});
                                }
                            });
                        }
                    });
                } else {
                    progAdmin.save(function (error) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({programAdministration: progAdmin});
                        }
                    }); 
                }
            });
        } else {
            progAdmin.save(function (error) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({programAdministration: progAdmin});
                }
            });
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

router.route('/:progAdmin_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        ProgramAdministration.findById(request.params.progAdmin_id, function (error, progAdmin) {
            if (error) {
                response.send(error);
            } else {
                response.json({programAdministration: progAdmin});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        ProgramAdministration.findById(request.params.progAdmin_id, function (error, progAdmin) {
            if (error){
                response.send(error);
            } else if (progAdmin) {                
                function savePut(){  
                    progAdmin.name = request.body.programAdministration.name;
                    progAdmin.position = request.body.programAdministration.position;
                    progAdmin.department = request.body.programAdministration.department;

                    progAdmin.save(function (error) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({programAdministration: progAdmin});
                        }
                    });
                }
                if (progAdmin.department != request.body.programAdministration.department)
                {
                    var completed = 0;
                    var failed = false;
                    Department.findById(request.body.programAdministration.department, function(error, newDepartment){
                        if (error && !failed){
                            failed = true;
                            response.send(error);
                        }
                        else if (newDepartment){                            
                            newDepartment.programAdministrations.push(request.params.progAdmin_id);
                            newDepartment.save(function(error){
                                if (error && !failed){
                                    failed = true;
                                    response.send(error);
                                }else{
                                    completed++
                                    if (!failed && completed == 2){
                                        savePut();
                                    }
                                }
                            });
                        } else{
                            completed++;
                            if (completed == 2 && !failed){
                                savePut();
                            }
                        }
                    });
                    Department.findById(progAdmin.department, function(error, oldDepartment){
                        if (error && !failed){
                            failed = true;
                            response.send(error);
                        }else if (oldDepartment){
                            var indexOfAdmin = oldDepartment.programAdministrations.indexOf(request.params.progAdmin_id);
                            if (indexOfAdmin >= 0){
                                oldDepartment.programAdministrations.splice(indexOfAdmin, 1);
                                oldDepartment.save(function(error){
                                    if (error && !failed){
                                        failed  = true;
                                        response.send(error);
                                    } else if (!failed){
                                        completed++;
                                        if (completed == 2){
                                            savePut();
                                        }
                                    }
                                });
                            } else{
                                completed++;
                                if (!failed && completed == 2){
                                    savePut();
                                }
                            }

                        }else{
                            completed++;
                            if (!failed && completed == 2){
                                savePut();
                            }
                        }
                    });

                }
                else{
                    savePut();
                }
            } else {
                response.json({programAdministration: progAdmin});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        ProgramAdministration.findByIdAndRemove(request.params.progAdmin_id, function (error, progAdmin) {
            if (progAdmin) {
                if (progAdmin.department) {
                    Department.findById(progAdmin.department, function (error, department) {
                        if (error) {
                            response.send(error);
                        } else if (department) {
                            let index = department.programAdministrations.indexOf(progAdmin._id);
                            if (index > -1) {
                                department.programAdministrations.splice(index, 1);
                            }

                            department.save(function (error) {
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
            } else {
                response.json({programAdministration: progAdmin});
            }
        });
    });

module.exports = router;