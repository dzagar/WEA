var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
<<<<<<< HEAD
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'Adjudication'}],
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Term'}]
=======
        programRecords: [{type: mongoose.Schema.ObjectId, ref: 'programRecord'}],
        grades: [{type: mongoose.Schema.ObjectId, ref: 'grade'}],
        student: {type: mongoose.Schema.ObjectId, ref: 'student'}
>>>>>>> FinishingLab3
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);