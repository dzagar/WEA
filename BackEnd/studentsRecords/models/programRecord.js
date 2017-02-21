var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String,
        termCode: {type: mongoose.Schema.ObjectId, ref: 'TermCode'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'PlanCode'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);