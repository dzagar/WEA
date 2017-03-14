var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema(
    {
        name: String,
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'}],
        faculty: {type: mongoose.Schema.ObjectId, ref: 'Faculties'},
        programAdministrationss: {type: mongoose.Schema.ObjectId, ref: 'ProgramAdministrationss'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('department', departmentSchema);