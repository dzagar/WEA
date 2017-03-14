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