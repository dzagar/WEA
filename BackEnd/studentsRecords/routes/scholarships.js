var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new scholarship
    .post(parseUrlencoded, parseJSON, function (request, response) {
    })
    //get all scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
    });

router.route('/:scholarship_id')
    //get specific scholarship
    .get(parseUrlencoded, parseJSON, function (request, response) {
    })
    //update scholarship
    .put(parseUrlencoded, parseJSON, function (request, response) {
        models.Scholarships.findById(request.params.scholarship_id, function (error, scholarship) {
        })
    })
    //removes user scholarship
    .delete(parseUrlencoded, parseJSON, function (request, response) {
    });
module.exports = router;
