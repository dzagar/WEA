var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String,
        termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'planCode'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);