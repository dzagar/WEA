var mongoose = require('mongoose');

var highSchoolSchema = mongoose.Schema(
    {
        schoolName: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('highSchool', highSchoolSchema);