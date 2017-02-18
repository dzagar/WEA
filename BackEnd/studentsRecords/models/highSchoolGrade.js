var mongoose = require('mongoose');

var highSchoolGradeSchema = mongoose.Schema(
    {
        mark: String,
        source: {type: mongoose.Schema.ObjectId, ref: ('HighSchoolCourse')},
        student: {type: mongoose.Schema.ObjectId, ref: ('Student')}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolGrade', highSchoolGradeSchema);