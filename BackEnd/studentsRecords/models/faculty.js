var mongoose = require('mongoose');

var facultySchema = mongoose.Schema(
    {
        name: String,
        departments: [{type: mongoose.Schema.ObjectId, ref: 'Departments'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('faculty', facultySchema);