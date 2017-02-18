var mongoose = require('mongoose');

var highSchoolCourseSchema = mongoose.Schema(
    {
        level: String,
        source: String,
        unit: Number
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('HighSchoolCourse', highSchoolCourseSchema);