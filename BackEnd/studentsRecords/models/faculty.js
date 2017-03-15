var mongoose = require('mongoose');

var facultySchema = mongoose.Schema(
    {
        name: String,
        departments: [{type: mongoose.Schema.ObjectId, ref: 'department'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('faculty', facultySchema);