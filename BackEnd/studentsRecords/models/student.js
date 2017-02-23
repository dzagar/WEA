var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
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
        termCodes: [{type: mongoose.Schema.ObjectId, ref: 'TermCode'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'AdvancedStandings'}],
        highSchoolGrades: [{type: mongoose.Schema.ObjectId, ref: 'HighSchoolGrades'}]
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);