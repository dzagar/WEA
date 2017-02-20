var express = require('express');
var router = express.Router();
var PlanCode = require('../models/planCode');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();

router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        var planCode = new PlanCode(request.body.planCode);
        planCode.save(function(error) {
            if (error)
                response.send(error);
            response.json({planCode: planCode});
        });
    })
    .get(parseUrlencoded, parseJSON, function (request, response) {
        var deleteAll = request.query.deleteAll;
        if (deleteAll){
            PlanCode.remove({}, function(err){
                if (err) response.send(err);
                else console.log('all plan Codes removed');
            })
        }
        else {
            PlanCode.find({}, function (error, planCodes) {
                if (error)
                    response.send(error);
                response.json({planCodes: planCodes});
            });
        }
    });

router.route('/:planCode_id')
    .get(parseUrlencoded, parseJSON, function (request, response) {
        // Gender.findById(request.params.gender_id, function(error, gender) {
        //     if (error)
        //         response.send(error);
        //     response.json({gender: gender})
        // });
    })
    .put(parseUrlencoded, parseJSON, function (request, response) {
        // Gender.findById(request.params.gender_id, function(error, gender) {
        //     if (error) {
        //         response.send({error: error});
        //     } else {
        //         gender.name = request.body.gender.name;
        //         gender.students = request.body.gender.students;

        //         gender.save(function(error) {
        //             if (error) {
        //                 response.send({error: error});
        //             } else {
        //                 response.json({gender: gender});
        //             }
        //         });
        //     }
        // });
    })
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        // Student.update({"gender": request.params.gender_id}, {"$set": {"gender": null}}, false, 
        // function(error, success){
        //     if (error){
        //         response.send(error);
        //     } else {
        //         Gender.findByIdAndRemove(request.params.gender_id, function(error, deleted) {
        //             if (error)
        //                 response.send(error);
        //             response.json({gender: deleted});
        //         });
        //     }
        // });
        
    });

module.exports = router;