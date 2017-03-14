var mongoose = require('mongoose');

var advancedStandingsSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        course: String,
        description: String,
        units: Number,
        grade: String,
        from: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('advancedStanding', advancedStandingsSchema);