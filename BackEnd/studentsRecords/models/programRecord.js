var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String,
        term: {type: mongoose.Schema.ObjectId, ref: 'Term'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'PlanCode'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);