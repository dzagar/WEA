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
            CourseGrouping.findAll({courseCodes: request.query.courseCodes}, function(error, courseGrouping)
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
                    //console.log("no course groupings exist...");
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
                response.send(error);
            } else {
                response.json({courseGrouping: courseGrouping});
            }
        });
    })

    .put(parseUrlencoded, parseJSON, function (request, response) {
        CourseGrouping.findById(request.params.courseGrouping_id, function (error, courseGrouping){

            if(error)
            {
                response.send(error);
            }

            else {
                //delete all references to the courseGrouping in courseCodes
                for (var i = 0; i < courseGrouping.courseCodes.length; i++){
                    CourseCode.findById(courseGrouping.courseCodes[i], function(error, courseCode){
                        var indexOfCourseGrouping  = courseCode.courseGroupings.indexOf(courseGrouping.id);
                        //they have a reference
                        if (indexOfCourseGrouping > -1){
                            courseCode.courseGroupings.splice(indexOfCourseGrouping, 1);
                            courseCode.save();
                        }                        
                    });
                }
                for (var i = 0; i < request.body.courseGrouping.courseCodes.length; i++)
                {
                    CourseCode.findById(request.body.courseGrouping.courseCodes[i], function(error, courseCode){
                        courseCode.courseGroupings.push(request.params.courseGrouping_id);
                        courseCode.save();
                    });                    
                }


                if(request.body.courseGrouping.courseCodes)
                {
                    courseGrouping.courseCodes=request.body.courseGrouping.courseCodes.slice();
                }
                courseGrouping.name=request.body.courseGrouping.name;                
                courseGrouping.save(function(error){
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
                            var indexOfCourseGrouping = courseCode.courseGroupings.indexOf(request.params.courseGrouping_id);
                            courseCode.courseGroupings.splice(indexOfCourseGrouping, 1);

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
                                        response.json({courseGrouping: courseGrouping});
                                    }
                                }
                            });
                        }

                        else
                        {
                            completed++;
                            if(completed==courseGrouping.courseCodes.length && !failed)
                            {
                                response.json({courseGrouping: courseGrouping});
                            }
                        }
                    });
                }

            }   else
                {
                    response.json({courseGrouping:courseGrouping});
                }
        
        });

    });

module.exports = router;
