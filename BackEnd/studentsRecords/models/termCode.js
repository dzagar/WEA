var mongoose = require('mongoose');

var termCodeSchema = mongoose.Schema(
    {
        name: String
        // Program Record
        // Adjudication
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('termCode',termCodeSchema);