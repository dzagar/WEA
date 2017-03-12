var mongoose = require('mongoose');

var logicalExpressionSchema = mongoose.Schema(
    {
        logicalExpression: String,
        logicalLink: String,
        logicalExpressions: [{type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}],
        ownerExpression: {type: mongoose.Schema.ObjectId, ref: 'logicalExpression'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('logicalExpression', logicalExpressionSchema);