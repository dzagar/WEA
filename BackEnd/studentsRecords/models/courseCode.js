var mongoose = require('mongoose');

var courseCodeSchema = mongoose.Schema(
    {
        //Program Record,
        courseLetter: String,
        courseNumber: String,
        name: String,
        unit: Number,
        programRecord: [{type: mongoose.Schema.ObjectId, ref: 'Grade'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('courseCode', courseCodeSchema);