var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
        adjudication: [{type: mongoose.Schema.ObjectId, ref: 'Adjudication'}],
        DOB: String,
        firstName: String,
        gender: {type: mongoose.Schema.ObjectId, ref: 'Gender'},
        lastName: String,
        studentNumber: String,
        photo: String,
        registrationComments: String,
        basisOfAdmission: String,
        admissionAverage: String,
        admissionComments: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residency'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'Scholarship'}],
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Terms'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}],
        highSchoolGrades: [{type: mongoose.Schema.ObjectId, ref: 'HighSchoolGrades'}],
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'Adjudications'}],
        cumAVG: String,
        cumUnitsPassed: String,
        cumUnitsTotal: String
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);