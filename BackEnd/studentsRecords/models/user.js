/**
 * Created by Abdelkader on 2017-02-23.
 */
var mongoose = require('mongoose');
var usersSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        enabled: Boolean,
        userShadow: {type: mongoose.Schema.ObjectId, ref: ('Passwords')},
        userRoles: [{type: mongoose.Schema.ObjectId, ref: 'UserRoles'}]
    }
);

var Users = mongoose.model('user', usersSchema);
exports.Model = Users;