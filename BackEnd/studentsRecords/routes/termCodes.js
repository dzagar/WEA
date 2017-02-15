var express = require('express');
var router = express.Router();
var TermCode = require('../models/termCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
	.post(parseUrlencoded, parseJSON, function (request, response) {
        var termCode = new TermCode(request.body.termCode);
        termCode.save(function(error) {
            if (error)
                response.send(error);
            response.json({termCode: termCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        TermCode.find(function(error, termCodes) {
                if (error)
                    response.send(error);
                response.json({termCodes: termCodes});
        });
    });

    //Expand later.
