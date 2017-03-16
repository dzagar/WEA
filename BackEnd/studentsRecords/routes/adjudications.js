var express = require('express');
var router = express.Router();
var Adjudication = require('../models/adjudication');
var Student = require('../models/student');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    //posting new advanced standing
    .post(parseUrlencoded, parseJSON, function (request, response) {
        
    })

    .get(parseUrlencoded, parseJSON, function (request, response) {
        if(request.query.deleteAll) {
            Adjudication.remove({}, function (error) {
                if (error) {
                    response.send(error);
                } else {
                    Adjudication.find(function (error, adjudications) {
                        if (error) {
                            response.send(error);
                        } else {
                            response.json({adjudications: adjudications});
                        }
                    });
                }
            });
        } else {
            Adjudication.find(function(error, adjudications) {
                if (error) {
                    response.send(error);
                } else {
                    response.json({adjudications: adjudications});
                }
            })
        }
    });

router.route('/:adjudication_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        Adjudication.findById(request.params.adjudication_id, function(error, adjudication) {
            if (error) {
                response.send(error);
            } else {
                response.json({adjudication: adjudication});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        
    });

module.exports = router;
