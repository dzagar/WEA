var mongoose = require('mongoose');

var highSchoolCourseSchema = mongoose.Schema(
    {
        level: String,
        source: String,
        unit: Number,
        subject: {type: mongoose.Schema.ObjectId, ref: ('HighSchoolSubjects')},
        school: {type: mongoose.Schema.ObjectId, ref: ('HighSchools')}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('HighSchoolCourse', highSchoolCourseSchema);