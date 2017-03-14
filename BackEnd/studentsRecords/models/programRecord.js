var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String,
        term: {type: mongoose.Schema.ObjectId, ref: 'term'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'planCode'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);