var mongoose = require('mongoose');

var logicalExpressionSchema = mongoose.Schema(
    {
        booleanExpression: String,
        logicalLink: String,
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpressions'}],
        ownerExpression: {type: mongoose.Schema.ObjectId, ref: 'logicalExpressions'},
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'assessmentCodes'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('logicalExpression', logicalExpressionSchema);