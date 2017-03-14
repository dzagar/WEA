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
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'residency'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'scholarship'}],
        term: [{type: mongoose.Schema.ObjectId, ref: 'term'}],
        advancedStandings: [{type: mongoose.Schema.ObjectId, ref: 'advancedStanding'}],
        highSchoolGrades: [{type: mongoose.Schema.ObjectId, ref: 'highSchoolGrade'}]
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);