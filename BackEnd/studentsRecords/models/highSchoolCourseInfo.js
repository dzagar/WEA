var mongoose = require('mongoose');

var highSchoolCourseInfoSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        schoolName: String,
        level: Number,
        subject: String,
        description: String,
        source: String,
        units: Number,
        grade: Number
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolCourseInfo', highSchoolCourseInfoSchema);