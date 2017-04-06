var express = require('express');
var router = express.Router();
var AssessmentCode = require('../models/assessmentCode');
var Adjudication = require('../models/adjudication');
var AdjudicationCategory = require('../models/adjudicationCategory');
var LogicalExpression = require('../models/logicalExpression');
var Department = require('../models/department');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var assessmentCode = new AssessmentCode(request.body.assessmentCode);
        let completed = 0;
        let failed = false;

        if (assessmentCode.adjudications && assessmentCode.adjudications.length > 0) {
            let completedAdj = 0;
            for (let i = 0; i < assessmentCode.adjudications.length && !failed; i++) {
                Adjudication.findById(assessmentCode.adjudications[i], function (error, adjudication) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (adjudication) {
                        adjudication.assessmentCode = assessmentCode._id;

                        adjudication.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedAdj++;
                                if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        assessmentCode.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({assessmentCode: assessmentCode});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedAdj++;
                        if (completedAdj === assessmentCode.adjudications.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
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
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }

        if (assessmentCode.logicalExpression) {
            LogicalExpression.findById(assessmentCode.logicalExpression, function (error, logExp) {
                if (error && !failed) {
                    failed = true;
                    response.send(error);
                } else if (logExp) {
                    logExp.assessmentCode = assessmentCode._id;

                    logExp.save(function(error) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    completed++;
                    if (completed === 3 && !failed) {
                        assessmentCode.save(function(error) {
                            if (error) {
                                response.send(error);
                            } else {
                                response.json({assessmentCode: assessmentCode});
                            }
                        });
                    }
                }
            });
        } else {
            completed++;
            if (completed === 3 && !failed) {
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }

        if (assessmentCode.departments && assessmentCode.departments.length > 0) {
            let completedDept = 0;
            for (let i = 0; i < assessmentCode.departments.length && !failed; i++) {
                Department.findById(assessmentCode.departments[i], function (error, department) {
                    if (error && !failed) {
                        failed = true;
                        response.send(error);
                    } else if (department) {
                        department.assessmentCodes.push(assessmentCode._id);

                        department.save(function (error) {
                            if (error && !failed) {
                                failed = true;
                                response.send(error);
                            } else {
                                completedDept++;
                                if (completedDept === assessmentCode.departments.length && !failed) {
                                    completed++;
                                    if (completed === 3 && !failed) {
                                        assessmentCode.save(function(error) {
                                            if (error) {
                                                response.send(error);
                                            } else {
                                                response.json({assessmentCode: assessmentCode});
                                            }
                                        });
                                    }
                                }
                            }
                        });
                    } else {
                        completedDept++;
                        if (completedDept === assessmentCode.departments.length && !failed) {
                            completed++;
                            if (completed === 3 && !failed) {
                                assessmentCode.save(function(error) {
                                    if (error) {
                                        response.send(error);
                                    } else {
                                        response.json({assessmentCode: assessmentCode});
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
                assessmentCode.save(function(error) {
                    if (error) {
                        response.send(error);
                    } else {
                        ////console.log('assessment code is ' + assessmentCode);
                        response.json({assessmentCode: assessmentCode});
                    }
                });
            }
        }
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        if (request.query.deleteAll) {
            AssessmentCode.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    AssessmentCode.find(function(error, assessmentCodes) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({assessmentCodes: assessmentCodes});
                        }
                    });
                }
            });
        } else if (request.query.adjudicationCategory) {
            AssessmentCode.find({adjudicationCategory: request.query.adjudicationCategory}, function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        } else if (request.query.noCategory == "true") {
            AssessmentCode.find({adjudicationCategory: null}, function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        } else {
            AssessmentCode.find(function(error, assessmentCodes) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({assessmentCodes: assessmentCodes});
                }
            });
        }
    });

router.route('/:assessmentCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        AssessmentCode.findById(request.params.assessmentCode_id, function(error, assessmentCode){
            if (error)
            {
                response.send(error);
            }
            else{
                response.send({assessmentCode:assessmentCode});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        AssessmentCode.findById(request.params.assessmentCode_id, function(error, assessmentCode){
            if (error)
            {
                response.send(error);
            }
            else{
                ////console.log(assessmentCode);
                //if the code was previously linked to a category
                if (assessmentCode.adjudicationCategory){
                    ////console.log(assessmentCode.adjudicationCategory);
                    AdjudicationCategory.findById(assessmentCode.adjudicationCategory, function(error, adjudicationCategory){
                        //if the category already has a reference to the assessment code we are saving
                        ////console.log(adjudicationCategory);
                        var indexOfAssessmentCode = adjudicationCategory.assessmentCodes.indexOf(assessmentCode.id);
                        if (indexOfAssessmentCode > -1){
                            adjudicationCategory.assessmentCodes.slice(indexOfAssessmentCode, 1);
                        }
                        adjudicationCategory.save(function(error){
                            if (error){
                                response.send(error);
                            }
                            else{
                                //if the new AssessmentCode has a category
                                if (request.body.assessmentCode.adjudicationCategory){
                                    AdjudicationCategory.findById(request.body.assessmentCode.adjudicationCategory, function(error, newAdjudcationCategory){
                                        newAdjudcationCategory.assessmentCodes.push(assessmentCode.id);
                                        newAdjudcationCategory.save();
                                    });
                                }
                                assessmentCode.code = request.body.assessmentCode.code;
                                assessmentCode.name = request.body.assessmentCode.name;
                                if (request.body.assessmentCode.adjudications) assessmentCode.adjudications = request.body.assessmentCode.adjudications.slice();
                                assessmentCode.logicalExpression = request.body.assessmentCode.logicalExpression;
                                if (request.body.assessmentCode.departments){
                                    assessmentCode.departments = request.body.assessmentCode.departments.slice();
                                    for (var i = 0; i < assessmentCode.departments.length; i++){
                                        Department.findById(assessmentCode.departments[i], function(error, department){
                                            if (department.assessmentCodes.indexOf(request.params.assessmentCode_id) < 0)
                                            {
                                                department.assessmentCodes.push(request.params.assessmentCode_id);
                                                department.save();
                                            }
                                        });
                                    }                    
                                }
                                assessmentCode.adjudicationCategory = request.body.assessmentCode.adjudicationCategory;
                                assessmentCode.flagForReview = request.body.assessmentCode.flagForReview;
                                assessmentCode.save(function(error){
                                    if (error)
                                        response.send(error);
                                    else{
                                        response.send({assessmentCode: assessmentCode});
                                    }
                                });
                            }
                        });
                    });

                }
                else{
                    //if the new AssessmentCode has a category
                    if (request.body.assessmentCode.adjudicationCategory){
                        ////console.log(request.body.assessmentCode.adjudicationCategory.id);
                        AdjudicationCategory.findById(request.body.assessmentCode.adjudicationCategory, function(error, newAdjudcationCategory){
                            newAdjudcationCategory.assessmentCodes.push(assessmentCode.id);
                            newAdjudcationCategory.save();
                        });
                    }
                    assessmentCode.code = request.body.assessmentCode.code;
                    assessmentCode.name = request.body.assessmentCode.name;
                    if (request.body.assessmentCode.adjudications) assessmentCode.adjudications = request.body.assessmentCode.adjudications.slice();
                    assessmentCode.logicalExpression = request.body.assessmentCode.logicalExpression;
                    if (request.body.assessmentCode.departments){
                        assessmentCode.departments = request.body.assessmentCode.departments.slice();
                        for (var i = 0; i < assessmentCode.departments.length; i++){
                            Department.findById(assessmentCode.departments[i], function(error, department){
                                if (department.assessmentCodes.indexOf(request.params.assessmentCode_id) < 0)
                                {
                                    department.assessmentCodes.push(request.params.assessmentCode_id);
                                    department.save();
                                }
                            });
                        }                    
                    }
                    assessmentCode.adjudicationCategory = request.body.assessmentCode.adjudicationCategory;
                    assessmentCode.flagForReview = request.body.assessmentCode.flagForReview;
                    assessmentCode.save(function(error){
                        if (error)
                            response.send(error);
                        else{
                            response.send({assessmentCode: assessmentCode});
                        }
                    });

                }                
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        AssessmentCode.findByIdAndRemove(request.params.assessmentCode_id, function(error, assessmentCode) {
            let completed = 0;
            let failed = false;

            if (assessmentCode.adjudications && assessmentCode.adjudications.length > 0) {
                let completedAdj = 0;
                for (let i = 0; i < assessmentCode.adjudications.length && !failed; i++) {
                    Adjudication.findById(assessmentCode.adjudications[i], function (error, adjudication) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (adjudication) {
                            adjudication.assessmentCode = null;

                            adjudication.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedAdj++;
                                    if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({assessmentCode: assessmentCode});
                                        }
                                    }
                                }
                            });
                        } else {
                            completedAdj++;
                            if (completedAdj === assessmentCode.adjudications.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({assessmentCode: assessmentCode});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }

            if (assessmentCode.logicalExpression) {
                let finishCallback = (logExp) => {
                    completed++;
                    if (completed === 3 && !failed){
                        response.json({assessmentCode: assessmentCode});
                    }
                }
                DestroyLogExp(request.params.logicalExpression_id, finishCallback);
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }

            if (assessmentCode.departments && assessmentCode.departments.length > 0) {
                let completedDept = 0;
                for (let i = 0; i < assessmentCode.departments.length && !failed; i++) {
                    Department.findById(assessmentCode.departments[i], function (error, department) {
                        if (error && !failed) {
                            failed = true;
                            response.send(error);
                        } else if (department) {
                            let index = department.assessmentCodes.indexOf(assessmentCode._id);
                            if (index > -1) {
                                department.assessmentCodes.splice(index, 1);
                            }

                            department.save(function (error) {
                                if (error && !failed) {
                                    failed = true;
                                    response.send(error);
                                } else {
                                    completedDept++;
                                    if (completedDept === assessmentCode.departments.length && !failed) {
                                        completed++;
                                        if (completed === 3 && !failed) {
                                            response.json({assessmentCode: assessmentCode});
                                        }
                                    }
                                }
                            });
                        } else {
                            completedDept++;
                            if (completedDept === assessmentCode.departments.length && !failed) {
                                completed++;
                                if (completed === 3 && !failed) {
                                    response.json({assessmentCode: assessmentCode});
                                }
                            }
                        }
                    });
                }
            } else {
                completed++;
                if (completed === 3 && !failed) {
                    response.json({assessmentCode: assessmentCode});
                }
            }
        });
    });

function DestroyLogExp (id, callback) {
    LogicalExpression.findByIdAndRemove(id, function (error, logExp) {
        ////console.log('Deleteing LogExp in RULE ' + id);
        if (logExp && logExp.logicalExpressions && logExp.logicalExpressions.length > 0) {
            let childCount = logExp.logicalExpressions.length;
            let finishCallback = () => {
                childCount--;
                if (childCount === 0) {
                    callback(logExp);
                }
            }
            for (let i = 0; i < logExp.logicalExpressions.length; i++) {
                ////console.log('Deleteing child ' + i + '/' + logExp.logicalExpressions + ' (owned by ' + id + ')');
                DestroyLogExp(logExp.logicalExpressions[i], finishCallback);
            }
        } else {
            ////console.log('Could not find LogExp ' + id + ', or it had no children');
            callback(logExp);
        }
    });
}


module.exports = router;