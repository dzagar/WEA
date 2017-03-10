var mongoose = require('mongoose');

var termSchema = mongoose.Schema(
    {
        termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'},
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecord'}],
        grades: [{type: mongoose.Schema.ObjectId, ref: 'Grade'}],
        student: {type: mongoose.Schema.ObjectId, ref: 'Student'},
        termAVG: String,
        termUnitsPassed: String,
        termUnitsTotal: String
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('term',termSchema);