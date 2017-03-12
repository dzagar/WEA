var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'programRecord'}],
        grades: [{type: mongoose.Schema.ObjectId, ref: 'grade'}],
        student: {type: mongoose.Schema.ObjectId, ref: 'student'}
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);