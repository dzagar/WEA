/**
 * Created by Abdelkader on 2017-02-23.
 */
var mongoose = require('mongoose');
var loginsSchema = mongoose.Schema(
    {
        userName: String,
        password: String,
        nonce: String,
        response: String,
        token: String,
        requestType: String,
        wrongUserName: Boolean,
        wrongPassword: Boolean,
        passwordMustChanged: Boolean,
        passwordReset: Boolean,
        loginFailed: Boolean,
        sessionIsActive: Boolean
    }
);

var Logins = mongoose.model('login', loginsSchema);
exports.Model = Logins;