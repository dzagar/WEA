var mongoose = require('mongoose');

var asessmentCodeSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'adjudications'}],
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpressions'}],
        departments: [{type: mongoose.Schema.ObjectId, ref: 'departments'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('assessmentCode', asessmentCodeSchema);