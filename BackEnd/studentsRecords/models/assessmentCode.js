var mongoose = require('mongoose');

var asessmentCodeSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'adjudication'}],
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}],
        departments: [{type: mongoose.Schema.ObjectId, ref: 'department'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('assessmentCode', asessmentCodeSchema);