    var express = require('express');
var router = express.Router();
var UserRoles = require('../models/userRole');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var userRole = new UserRoles.Model(request.body.userRole);
        userRole.save(function (error) {
            if (error) response.send(error);
            response.json({userRole: userRole});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var User = request.query.filter;
        if (!User) {
            UserRoles.Model.find(function (error, userRoles) {
                if (error) response.send(error);
                response.json({userRole: userRoles});
            });
        } else {
            if (!User.user) {
                UserRoles.Model.find({"role": User.role}, function (error, userRoles) {
                    if (error) response.send(error);
                    response.json({userRole: userRoles});
                });
            } else {
                if (!User.role) {
                    UserRoles.Model.find({"user": User.user}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userRole: userRoles});
                    });
                } else {
                    UserRoles.Model.find({"user": User.user, "role": User.role}, function (error, userRoles) {
                        if (error) response.send(error);
                        response.json({userRole: userRoles});
                    });
                }
            }
        }

    });

router.route('/:userRole_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findById(request.params.userRole_id, function (error, userRole) {
            if (error) response.send(error);
            response.json({userRole: userRole});
        })
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findById(request.params.userRole_id, function (error, userRole) {
            if (error) {
                response.send({error: error});
            }
            else {
                userRole.dateAssigned = request.body.userRole.dateAssigned;
                userRole.user = request.body.userRole.user;
                userRole.role = request.body.userRole.role;
                userRole.save(function (error) {
                    if (error) {
                        response.send({error: error});
                    }
                    else {
                        response.json({userRole: userRole});
                    }
                });
            }
        })
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        UserRoles.Model.findByIdAndRemove(request.params.userRole_id,
            function (error, deleted) {
                if (!error) {
                    response.json({userRole: deleted});
                };
            }
        );
    });

module.exports = router;
