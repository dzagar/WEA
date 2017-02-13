var mongoose = require('mongoose');

var genderSchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('gender', genderSchema);

// var Genders = mongoose.model('gender',genderSchema);

// mongoose.connect('mongodb://localhost/studentsRecords');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     exports.Genders = Genders;
// });