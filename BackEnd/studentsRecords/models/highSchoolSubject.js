var mongoose = require('mongoose');

var highSchoolSubjectSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolSubject', highSchoolSubjectSchema);