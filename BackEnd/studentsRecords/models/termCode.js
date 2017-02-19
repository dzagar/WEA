var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecord: [{type: mongoose.Schema.ObjectId, ref: 'ProgramRecord'}]
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);