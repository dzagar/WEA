var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecord'}],
        grades: [{type: mongoose.Schema.ObjectId, ref: 'Grade'}],
        student: {type: mongoose.Schema.ObjectId, ref: 'Student'}
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);