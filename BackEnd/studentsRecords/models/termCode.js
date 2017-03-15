var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'programRecord'}],
        ajudications: [{type: mongoose.Schema.ObjectId, ref: 'Adjudication'}],
        terms: [{type: mongoose.Schema.ObjectId, ref:'Term'}]
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);