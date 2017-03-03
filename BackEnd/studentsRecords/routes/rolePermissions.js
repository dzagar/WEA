var express = require('express');
var router = express.Router();
var RolePermissions = require('../models/rolePermission');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var rolePermission = new RolePermissions.Model(request.body.rolePermission);
        rolePermission.save(function (error) {
            if (error) response.send(error);
            response.json({rolePermission: rolePermission});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var RoleCode = request.query.filter;
        if (!RoleCode) {
            RolePermissions.Model.find(function (error, rolePermissions) {
                if (error) response.send(error);
                response.json({rolePermission: rolePermissions});
            });
        } else {
            RolePermissions.Model.find({"roleCodes": RoleCode.roleCodes}, function (error, roleCodes) {
                if (error) response.send(error);
                response.json({rolePermission: roleCodes});
            });
        }
    });

router.route('/:rolePermission_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        RolePermissions.Model.findById(request.params.rolePermission_id, function (error, rolePermission) {
            if (error) response.send(error);
            response.json({rolePermission: rolePermission});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        RolePermissions.Model.findById(request.params.rolePermission_id, function (error, rolePermission) {
            if (error) {
                response.send({error: error});
            }
            else {
                rolePermission.sysFeature = request.body.rolePermission.sysFeature;
                rolePermission.roleCodes = request.body.rolePermission.roleCodes;
                rolePermission.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({rolePermission: rolePermission});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        RolePermissions.Model.findByIdAndRemove(request.params.rolePermission_id,
            function (error, deleted) {
                if (!error) {
                    response.json({rolePermission: deleted});
                };
            }
        );
    });

module.exports = router;
