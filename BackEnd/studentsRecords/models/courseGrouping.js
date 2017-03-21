var mongoose = require('mongoose');

var courseGroupingSchema = mongoose.Schema(
    {
        name: String,
        courseCodes: [{type: mongoose.Schema.ObjectId, ref: 'CourseCode'}]
    },

    {
        versionKey: false
    }
);

module.exports = mongoose.model('courseGrouping', courseGroupingSchema);