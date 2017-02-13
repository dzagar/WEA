var mongoose = require('mongoose');

var advancedStandingsSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        course: String,
        description: String,
        units: String,
        grade: Number,
        from: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('advancedStandings', advancedStandingsSchema);