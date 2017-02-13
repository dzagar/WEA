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