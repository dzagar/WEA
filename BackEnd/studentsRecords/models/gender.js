var mongoose = require('mongoose');

var genderSchema = mongoose.Schema(
    {
        name: String,
        students: [{type: mongoose.Schema.ObjectId, ref: ('student')}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('gender', genderSchema);