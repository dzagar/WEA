var express = require('express');
var router = express.Router();
var Faculty = require('../models/faculty');
var Department = require('../models/department');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var faculty = new Faculty(request.body.faculty);
        if (faculty.departments && faculty.departments.length > 0) {
            let completeDepts = 0;
            let failed = false;
            for (let i = 0; i < faculty.departments.length && !failed; i++) {
                Department.findById(faculty.departments[i], function (error, department) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (department) {
                        department.faculty = faculty._id;

                        department.save(function(error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completeDepts++;
                                if (completeDepts === faculty.departments.length && !failed) {
                                    faculty.save(function (error) {
                                        if (error) {
                                            response.send(error);
                                        } else {
                                            response.json({faculty: faculty});
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        completeDepts++;
                        if (completeDepts === faculty.departments.length && !failed) {
                            faculty.save(function (error) {
                                if (error) {
                                    response.send(error);
                                } else {
                                    response.json({faculty: faculty});
                                }
                            });
                        }
                    }
                });
            }
        } else {
            faculty.save(function (error) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({faculty: faculty});
                }
            });
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
        } else if (request.query.name) {
            Faculty.find({name: request.query.name}, function (error, faculties) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({faculties: faculties});
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