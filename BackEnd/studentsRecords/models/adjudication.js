var mongoose = require('mongoose');

var adjudicationSchema = mongoose.Schema(
    {
        student: {type: mongoose.Schema.ObjectId, ref: 'student'},
        termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'},
        date: String,
        note: String,
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'assessmentCode'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('adjudication', adjudicationSchema);