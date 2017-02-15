var mongoose = require('mongoose');

var highSchoolSubjectSchema = mongoose.Schema(
    {
        name: String,
        description: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolSubject', highSchoolSubjectSchema);