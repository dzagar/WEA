var mongoose = require('mongoose');

var highSchoolSchema = mongoose.Schema(
    {
        schoolName: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchool', highSchoolSchema);