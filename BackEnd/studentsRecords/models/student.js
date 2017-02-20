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
        admissionAverage: Number,
        admissionComments: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residency'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'Scholarship'}],
        termCodes: [{type: mongoose.Schema.ObjectId, ref: 'TermCode'}]
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);