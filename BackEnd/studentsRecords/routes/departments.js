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
                                        response.json({department: department});
                                    }
                                }
                            }
                        });
                    } else {
                        completeAC++;
                        if (completeAC === department.assessmentCodes.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                response.json({department: department});
                            }
                        }
                    }
                });
            }
        } else {
            completed++;
            if (completed === 3 && !failed) {
                response.json({department: department});
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
                                response.json({department: department});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({department: department});
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                response.json({department: department});
            }
        }

        if (department.programAdministration) {
            ProgramAdministration.findById(department.programAdministration, function (error, progAdmin) {
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
                            completed++;
                            if (completed === 3 && !failed) {
                                response.json({department: department});
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        response.json({department: department});
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                response.json({department: department});
            }
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            Faculty.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    Faculty.find(function (error, faculties) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({faculties: faculties});
                        }
                    });
                }
            });
        } else {
            Faculty.find(function (error, faculties) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({faculties: faculties});
                }
            });
        }
    });

router.route('/:faculty_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Faculty.findById(request.params.faculty_id, function (error, faculty) {
            if (error) {
                response.send(error);
            } else {
                response.json({faculty: faculty});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        Faculty.findById(request.params.faculty_id, function(error, faculty) {
            if (error) {
                response.send(error);
            } else if (faculty) {
                faculty.name = request.body.faculty.name;
                faculty.departments = request.body.faculty.departments;

                faculty.save(function (error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({faculty: faculty});
                    }
                });
            } else {
                response.json({faculty: faculty});
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Faculty.findByIdAndRemove(request.params.faculty_id, function (error, faculty) {
            if (faculty && faculty.departments && faculty.departments.length > 0) {
                let completeDepts = 0;
                let failed = false;
                for (let i = 0; i < faculty.departments.length && !failed; i++) {
                    Department.findById(faculty.departments[i], function (error, department) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (department) {
                            department.faculty = null;

                            department.save(function(error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completeDepts++;
                                    if (completeDepts === faculty.departments.length && !failed) {
                                        response.json({deleted: faculty});
                                    }
                                }
                            });
                        } else {
                            completeDepts++;
                            if (completeDepts === faculty.departments.length && !failed) {
                                response.json({deleted: faculty});
                            }
                        }
                    });
                }
            } else {
                response.json({deleted: faculty});
            }
        });
    });

module.exports = router;