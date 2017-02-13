var mongoose = require('mongoose');

var scholarshipSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        name: String,
        note: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('scholarship',scholarshipSchema);

// var Scholarships = mongoose.model('scholarship',scholarshipSchema);

// mongoose.connect('mongodb://localhost/studentsRecords');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     exports.Scholarships = Scholarships;
// });