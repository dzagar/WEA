var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
        DOB: String,
        firstName: String,
        gender: {type: mongoose.Schema.ObjectId, ref: 'gender'},
        lastName: String,
        studentNumber: String,
        photo: String,
        registrationComments: String,
        basisOfAdmission: String,
        admissionAverage: String,
        admissionComments: String,
<<<<<<< HEAD
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residency'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'Scholarship'}],
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Terms'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}],
        highSchoolGrades: [{type: mongoose.Schema.ObjectId, ref: 'HighSchoolGrades'}],
        cumAVG: String,
        cumUnitsPassed: String,
        cumUnitsTotal: String
=======
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'residency'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'scholarship'}],
        termCodes: [{type: mongoose.Schema.ObjectId, ref: 'termCode'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'advancedStanding'}],
        highSchoolGrades: [{type: mongoose.Schema.ObjectId, ref: 'highSchoolGrade'}]
>>>>>>> FinishingLab3
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);