var mongoose = require('mongoose');

var scholarshipSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'student'},
        note: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('scholarship',scholarshipSchema);