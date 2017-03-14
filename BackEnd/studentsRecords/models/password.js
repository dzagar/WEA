/**
 * Created by Abdelkader on 2017-02-23.
 */
var mongoose = require('mongoose');
var passwordsSchema = mongoose.Schema(
    {
        userName: String,
        salt: String,
        encryptedPassword: String,
        userAccountExpiryDate: Date,
        passwordMustChanged : Boolean,
        passwordReset: Boolean,
        user: {type: mongoose.Schema.ObjectId, ref: ('Users')}
    }
);

var Passwords = mongoose.model('password', passwordsSchema);
exports.Model = Passwords;