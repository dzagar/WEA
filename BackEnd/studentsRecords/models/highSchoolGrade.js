var mongoose = require('mongoose');

var highSchoolGradeSchema = mongoose.Schema(
    {
        mark: String,
        source: {type: mongoose.Schema.ObjectId, ref: ('highSchoolCourse')},
        student: {type: mongoose.Schema.ObjectId, ref: ('student')}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolGrade', highSchoolGradeSchema);