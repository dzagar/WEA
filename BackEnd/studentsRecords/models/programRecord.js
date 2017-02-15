var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);