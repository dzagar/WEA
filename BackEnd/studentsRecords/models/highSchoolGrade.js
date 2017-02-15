var mongoose = require('mongoose');

var highSchoolGradeSchema = mongoose.Schema(
    {
        mark: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchoolGrade', highSchoolGradeSchema);