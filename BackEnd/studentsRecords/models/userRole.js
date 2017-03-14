/**
 * Created by Abdelkader on 2017-02-23.
 */
var mongoose = require('mongoose');
var userRoleSchema = mongoose.Schema(
    {
        dateAssigned: Date,
        user: {type: mongoose.Schema.ObjectId, ref: ('user')},
        role: {type: mongoose.Schema.ObjectId, ref: ('roleCode')}
    }
);

var UserRoles = mongoose.model('userRole', userRoleSchema);
exports.Model = UserRoles;