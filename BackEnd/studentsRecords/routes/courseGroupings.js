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

module.exports = router;
