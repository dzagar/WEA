var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema(
    {
        name: String,
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: 'assessmentCode'}],
        faculty: {type: mongoose.Schema.ObjectId, ref: 'faculty'},
        programAdministrationss: {type: mongoose.Schema.ObjectId, ref: 'programAdministration'}
    },
    {
        
        versionKey: false
    }
);

module.exports = mongoose.model('department', departmentSchema);