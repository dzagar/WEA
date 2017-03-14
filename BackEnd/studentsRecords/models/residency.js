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