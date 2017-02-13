var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var studentsSchema = mongoose.Schema(
    {
        DOB: String,
        firstName: String,
        gender: {type: mongoose.Schema.ObjectId, ref: 'Genders'},
        lastName: String,
        number: Number,
        photo: String,
        resInfo: {type: mongoose.Schema.ObjectId, ref: 'Residencies'},
        scholarships: [{type: mongoose.Schema.ObjectId, ref: 'Scholarships'}]
    },
    {
        versionKey: false
    }
);
studentsSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('student', studentsSchema);

// var Students = mongoose.model('student', studentsSchema);

// mongoose.connect('mongodb://localhost/studentsRecords');
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     exports.Students = Students;
// });