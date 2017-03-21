var express = require('express');
var router = express.Router();
var CourseCode = require('../models/courseCode');
var CourseGrouping = require('../models/courseGrouping');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var courseGrouping = new CourseGrouping(request.body.courseGrouping);
        courseGrouping.save(function(error) {
            if (error) {
                response.send(error);
            } else {
                response.json({courseGrouping: courseGrouping});
            }
        });
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        var o = parseInt(request.query.offset);
        var l = parseInt(request.query.limit);
        if(request.query.deleteAll){
            CourseGrouping.remove({}, function(error) {
                if(error)
                {
                    response.send(error);
                }
                else
                {
                    CourseGrouping.find(function (error,courseGrouping)
                    {
                        if(error)
                        {
                            response.send(error);
                        }
                        else
                        {
                            response.json({courseGrouping : courseGrouping});
                        }
                    });
                }

            });
        }

        else if(request.query.name)
        {
            CourseGrouping.find({name: request.query.name}, function(error, courseGrouping)
            {
                if(error)
                {
                    response.send(error);
                }
                else
                {
                    response.json({courseGrouping : courseGrouping});
                }
            });
        }

        else if(request.query.name && request.query.courseCodes)
        {
            CourseGrouping.find({name: request.query.name, courseCodes: request.query.courseCodes}, function(error, courseGrouping)
            {
                if(error)
                {
                    response.send(error);
                }

                else
                {
                    response.json({courseGrouping : courseGrouping});
                }
            });
        }

        else if(request.query.courseCodes)
        {
            CourseGrouping.find({courseCodes: request.query.courseCodes}, function(error, courseGrouping)
            {
                if(error)
                {
                    response.send(error);
                }
                else
                {
                    response.json({courseGrouping : courseGrouping});
                }

            });
        }

        else
        {
            CourseGrouping.find({}, null, {sort: 'name'}, function(error, courseGrouping)
            {
                if(error)
                {
                    console.log("no course groupings exist...");
                    response.send(error);
                }
                
                else
                {
                    response.json({courseGrouping : courseGrouping});
                }
            });
        }
    })

    router.route('/:courseGrouping_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        CourseGrouping.findById(request.params.courseGrouping_id, function (error, courseGrouping) {
            if (error) {
                console.log("In here!");
                response.send(error);
            } else {
                response.send({courseGrouping: courseGrouping});
            }
        });
    })

    .put(parseUrlencoded, parseJSON, function (request, response) {
        CourseGrouping.findById(request.params.courseGrouping_id, function (error, courseGrouping){

            courseGrouping.name=request.body.courseGrouping.name;
            courseGrouping.courseCodes=request.body.courseGrouping.courseCodes;

            courseGrouping.save(function(error){
            if(error)
            {
                response.send(error);
            }

            else
            {
                response.send({courseGrouping: courseGrouping});
            }

            });
        });

    })

    .delete(parseUrlencoded, parseJSON, function (request, response) {
        var failed=false;
        var completed=0;
        CourseGrouping.findByIdAndRemove(request.params.courseGrouping_id , function(error, courseGrouping) {
            if(error)
            {
                failed=true;
                response.send(error);
            }

            else if(courseGrouping && courseGrouping.courseCodes.length >0) {
                for(var i=0; i<courseGrouping.courseCodes.length && !failed; i++ )
                {
                    CourseCode.findById(courseGrouping.courseCodes[i], function(error, courseCode) {
                        if(error && !failed)
                        {
                            failed=true;
                            response.send(error);
                        }

                        else if(courseCode)
                        {
                            courseCode.courseGroupings=null;

                            courseCode.save(function(error){
                                if(error)
                                {
                                    response.send(error);
                                }
                                
                                else
                                {
                                    completed++;
                                    if(completed==courseGrouping.courseCodes.length && !failed)
                                    {
                                        response.json({deleted: courseGrouping});
                                    }
                                }
                            });
                        }

                        else
                        {
                            completed++;
                            if(completed==courseGrouping.courseCodes.length && !failed)
                            {
                                response.json({deleted: courseGrouping});
                            }
                        }
                    });
                }

            }   else
                {
                    response.json({deleted:courseGrouping});
                }
        
        });

    });

module.exports = router;
