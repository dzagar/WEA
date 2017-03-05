var mongoose = require('mongoose');

var adjudicationSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'Students'},
        termCode: {type: mongoose.Schema.ObjectId, ref: 'TermCodes'},
        date: String,
        termAVG: Number,
        termUnitPassed: Number,
        termUnitTotal: Number,
        note: String,
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'AssessmentCodes'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('adjudication', adjudicationSchema);