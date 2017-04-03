var express = require('express');
var router = express.Router();
var AssessmentCodes = require('../models/assessmentCode');
var Faculty = require('../models/faculty');
var Department = require('../models/department');
var ProgramAdministration = require('../models/programAdministration');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        let completed = 0;
        let failed = false;

        var department = new Department(request.body.department);
        if (department.assessmentCodes && department.assessmentCodes.length > 0) {
            let completeAC = 0;
            for (let i = 0; i < department.assessmentCodes.length && !failed; i++) {
                AssessmentCodes.findById(department.assessmentCodes[i], function (error, assessmentCode) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (assessmentCode) {
                        assessmentCode.departments.push(department._id);

                        assessmentCode.save(function(error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completeAC++;
                                if (completeAC === department.assessmentCodes.length && !failed) {
                                    completed++
                                    if (completed === 3 && !failed) {
                                        department.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({department: department});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completeAC++;
                        if (completeAC === department.assessmentCodes.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                department.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({department: department});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        } else {
            completed++;
            if (completed === 3 && !failed) {
                department.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({department: department});
                    }
                });
            }
        }

        if (department.faculty) {
            Faculty.findById(department.faculty, function (error, faculty) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (faculty) {
                    faculty.departments.push(department._id);

                    faculty.save(function (error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                department.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({department: department});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        department.save(function (error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({department: department});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                department.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({department: department});
                    }
                });
            }
        }

        if (department.programAdministrations && department.programAdministrations.length > 0) {
            let completePA = 0;

            for (let i = 0; i < department.programAdministrations.length && !failed; i++) {
                ProgramAdministration.findById(department.programAdministrations[i], function (error, progAdmin) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (progAdmin) {
                        progAdmin.department = department._id;

                        progAdmin.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completePA++;
                                if (completePA === department.programAdministrations.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        department.save(function (error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({department: department});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedPA++;
                        if (completePA === department.programAdministrations.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                department.save(function (error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({department: department});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        } else {
            completed++;
            if (completed === 3 && !failed) {
                department.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({department: department});
                    }
                });
            }
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
        }else if (request.query.name){
            Department.find({name: request.query.name}, function (error, departments) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({departments: departments});
                }
            });
        }else {
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
        Department.findById(request.params.department_id, function(error, department) {
            if (error) {
                response.send(error);
            } else if (department) {
                function savePut(){  
                    department.name = request.body.department.name;
                    if (request.body.department.assessmentCodes) department.assessmentCodes = request.body.department.assessmentCodes.splice();
                    department.faculty = request.body.department.faculty;
                    department.programAdministration = request.body.department.programAdministration;

                    department.save(function (error) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({department: department});
                        }
                    });
                }
                if (department.faculty != request.body.department.faculty){
                    var completed = 0;
                    var failed = false;
                    Faculty.findById(request.body.department.faculty, function(error, newFaculty){
                        if (error && !failed){
                            failed = true;
                            response.send(error);
                        }
                        else if (newFaculty){  
                            newFaculty.departments.push(request.params.department_id);
                            newFaculty.save(function(error){
                                if (error && !failed){
                                    failed = true;
                                    response.send(error);
                                }
                                else{
                                    completed++;
                                    if (completed == 2 && !failed){
                                        savePut();
                                    }
                                }
                            });                            
                        }
                        else{
                            completed++;
                            if (completed == 2 && !failed){
                                savePut();
                            }
                        }
                    });
                    Faculty.findById(department.faculty, function(error, oldFaculty){
                        if (error && !failed){
                            failed = true;
                            response.send(error);
                        }
                        else if (oldFaculty){  
                            var indexOfDept = oldFaculty.departments.indexOf(request.params.department_id);
                            if (indexOfDept >= 0){
                                oldFaculty.departments.splice(indexOfDept, 1);
                                oldFaculty.save(function(error){
                                    if (error && !failed){
                                        failed = true;
                                        response.send(error);
                                    }
                                    else{
                                        completed++;
                                        if (completed == 2 && !failed){
                                            savePut();
                                        }
                                    }
                                });
                            }
                            else{                                
                                completed++;
                                if (!failed && completed == 2){
                                    savePut();
                                }
                            }                     
                        }
                        else{
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
                response.json({department: department});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        let completed = 0;
        let failed = false;

        Department.findByIdAndRemove(request.params.department_id, function (error, department) {
            if (department.assessmentCodes && department.assessmentCodes.length > 0) {
                let completeAC = 0;
                for (let i = 0; i < department.assessmentCodes.length && !failed; i++) {
                    AssessmentCodes.findById(department.assessmentCodes[i], function(error, assessmentCode) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (assessmentCode) {
                            let index = assessmentCode.departments.indexOf(department._id);
                            if (index > -1) {
                                assessmentCode.departments.splice(index, 1);
                            }

                            assessmentCode.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completeAC++;
                                    if (completedAC === department.assessmentCode.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({deleted: department});
                                        }
                                    }
                                }
                            });
                        } else {
                            completeAC++;
                            if (completedAC === department.assessmentCode.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: department});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({deleted: department});
                }
            }

            if (department.faculty) {
                Faculty.findById(department.faculty, function (error, faculty) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (faculty) {
                        faculty.department = null;

                        faculty.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: department});
                                }
                            }
                        });
                    } else {
                        completed++;
                        if (completed === 3 && !failed) {
                            response.json({deleted: department});
                        }
                    }
                });
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({deleted: department});
                }
            }

            if (department.programAdministrations && department.programAdministrations.length > 0) {
                let completePA = 0;

                for (let i = 0; i < department.programAdministrations.length && !failed; i++) {
                    ProgramAdministration.findById(department.programAdministrations[i], function (error, progAdmin) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (progAdmin) {
                            progAdmin.department = null;

                            progAdmin.save(function(error){
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completePA++;
                                    if (completePA === department.programAdministrations.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({deleted: department});
                                        }
                                    }
                                }
                            });
                        } else {
                            completePA++;
                            if (completePA === department.programAdministrations.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({deleted: department});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({deleted: department});
                }
            }
        });
    });

module.exports = router;