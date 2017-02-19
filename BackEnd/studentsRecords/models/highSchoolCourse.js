var mongoose = require('mongoose');

var highSchoolCourseSchema = mongoose.Schema(
    {
        level: String,
        source: String,
        unit: Number,
        subject: {type: mongoose.Schema.ObjectId, ref: ('highSchoolSubject')},
        school: {type: mongoose.Schema.ObjectId, ref: ('highSchool')},
        grades: [{type: mongoose.Schema.ObjectId, ref: ('HighSchoolGrade')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('HighSchoolCourse', highSchoolCourseSchema);