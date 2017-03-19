var mongoose = require('mongoose');

var logicalExpressionSchema = mongoose.Schema(
    {
        booleanExpression: String,
        logicalLink: String,
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}],
        assessmentCode: {type: mongoose.Schema.ObjectId, ref: 'assessmentCode'},
        ownerExpression: {type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('logicalExpression', logicalExpressionSchema);