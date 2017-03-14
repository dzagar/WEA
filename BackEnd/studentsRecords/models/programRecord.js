var mongoose = require('mongoose');

var programRecordSchema = mongoose.Schema(
    {
        name: String,
        level: String,
        load: String,
<<<<<<< HEAD
        term: {type: mongoose.Schema.ObjectId, ref: 'Term'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'PlanCode'}]
=======
        termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'},
        planCodes: [{type: mongoose.Schema.ObjectId, ref: 'planCode'}]
>>>>>>> FinishingLab3
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programRecord', programRecordSchema);