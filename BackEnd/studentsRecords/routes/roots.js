var express = require('express');
var router = express.Router();
var Roots = require('../models/root');
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false});
var parseJSON = bodyParser.json();
const crypto = require('crypto');
var rand = require('csprng');

function hash(text) {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('binary');
};

function encrypt(plainText) {
    var cipher = crypto.createCipher('aes256', 'SE3350b Winter 2016');
    var crypted = cipher.update(plainText, 'ascii', 'binary');
    crypted += cipher.final('binary');
    return crypted;
};

function decrypt(cipherText) {
    var decipher = crypto.createDecipher('aes256', 'SE3350b Winter 2016');
    var dec = decipher.update(cipherText, 'binary', 'ascii');
    dec += decipher.final('ascii');
    return dec;
};


router.route('/')
    .post(parseUrlencoded, parseJSON, function (request, response) {
        if (request.body.root.password === null || request.body.root.nonce === null) {
            // make sure to delete any leftover from any previous session for the same user if any.
            Roots.Model.find({}, function (error, oldLogins) {
                oldLogins.forEach(function (record) {
                    Roots.Model.findByIdAndRemove(record.id,
                        function (error, deleted) {
                        }
                    );
                });
            });

            if (request.body.root.nonce === null) {
                var newLogin = new Roots.Model({
                    password: null,
                    nonce: rand(256, 36),
                    response: null
                });
                newLogin.save(function (error) {
                    if (error) return console.error(error);
                    response.json({root: newLogin});
                });
            }
        }

        else {
            if (request.body.root.response !== null) {
                // Now we need to verfiy the nonce and the password
                var recievedNonce = decrypt(request.body.root.response);
                var storedNonce = null;
                Roots.Model.findOne({}, function (error, message4) {
                    if (!error) {
                        storedNonce = message4.nonce;
                        if (recievedNonce === storedNonce) {
                            // Now this session is confirmed fresh. Let us authenticate the user.
                            var recievedPassword = request.body.root.password;

                            // This stored encrypted password needs to be saved in
                            // an external protected file, that can be mahaged by external tool
                            // other than SAS application.
                            var stored = encrypt(hash("root"));
                            var storedPassword = stored;

                            if (recievedPassword === storedPassword) {
                                message4.sessionIsActive = true;
                                message4.save(function (error) {
                                    if (error) return console.error(error);

                                    response.json({root: message4});
                                });
                            }
                        } else {
                            // password must be wrong, server will send "wrong password" message
                            message4.nonce = null;
                            message4.response = null;
                            message4.wrongPassword = true;
                            response.json({root: message4});
                        }
                    } else {
                        message4.nonce = null;
                        message4.response = null;
                        message4.wrongPassword = true;
                        response.json({root: message4});
                    }
                });
            }
        }
    });


router.route('/:root_id')
    .delete(parseUrlencoded, parseJSON, function (request, response) {
        Roots.Model.findByIdAndRemove(request.params.root_id,
            function (error, deleted) {
                if (!error) {
                    response.json({root: deleted});
                }
            }
        );
    });

module.exports = router;
