var mongoose = require('mongoose');

var departmentSchema = mongoose.Schema(
    {
        name: String,
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'}],
        faculty: {type: mongoose.Schema.ObjectId, ref: 'Faculties'},
        programAdministrations: [{type: mongoose.Schema.ObjectId, ref: 'ProgramAdministrations'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('department', departmentSchema);