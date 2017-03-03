var express = require('express');
var router = express.Router();
var RoleCodes = require('../models/roleCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var roleCode = new RoleCodes.Model(request.body.roleCode);
        roleCode.save(function (error) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({roleCode: roleCode});
            }
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        RoleCodes.Model.find(function (error, codes) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({roleCode: codes});
            }
        });
    });

router.route('/:roleCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        RoleCodes.Model.findById(request.params.roleCode_id, function (error, role) {
            if (error) {
                response.send({error: error});
            }
            else {
                response.json({roleCode: role});
            }
        });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        RoleCodes.Model.findById(request.params.roleCode_id, function (error, role) {
            if (error) {
                response.send({error: error});
            }
            else {
                // update the role info
                role.name = request.body.roleCode.name;
                role.userRoles = request.body.roleCode.userRoles;
                role.functions = request.body.roleCode.functions;

                role.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({roleCode: role});
                    }
                });
            }
        });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        RoleCodes.Model.findByIdAndRemove(request.params.roleCode_id,
            function (error, deleted) {
                if (!error) {
                    response.json({roleCode: deleted});
                };
            }
        );
    });


module.exports = router;
