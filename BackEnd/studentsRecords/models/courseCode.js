var mongoose = require('mongoose');

var courseCodeSchema = mongoose.Schema(
    {
        courseLetter: String,
        courseNumber: String,
        name: String,
        unit: Number,
        grades: [{type: mongoose.Schema.ObjectId, ref: 'Grade'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('courseCode', courseCodeSchema);