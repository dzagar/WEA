var mongoose = require('mongoose');

var residencySchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('Students')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('residency', residencySchema);

// var Residencies = mongoose.model('residency', residencySchema);

// mongoose.connect('mongodb://localhost/studentsRecords');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     exports.Residencies = Residencies;
// });