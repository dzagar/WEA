var express = require('express');
var router = express.Router();
var models = require('../models/studentsRecordsDB');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        //create a new gender
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        //get
    });

router.route('/:gender_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        //get
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        //put
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        //delete
    });

module.exports = router;