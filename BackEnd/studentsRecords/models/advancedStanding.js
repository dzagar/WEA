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

// var AdvancedStandings = mongoose.model('advancedStandings', advancedStandingsSchema);

// mongoose.connect('mongodb://localhost/studentsRecords');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     exports.AdvancedStandings = AdvancedStandings;
// });