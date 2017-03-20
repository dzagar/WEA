var mongoose = require('mongoose');

var asessmentCodeSchema = mongoose.Schema(
    {
        code: String,
        name: String,
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'adjudications'}],
        logicalExpression: {type: mongoose.Schema.ObjectId, ref: 'logicalExpressions'},
        departments: [{type: mongoose.Schema.ObjectId, ref: 'departments'}],
        adjudicationCategory: {type: mongoose.Schema.ObjectId, ref: 'adjudicationCategories'},
        flagForReview: Boolean
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('assessmentCode', asessmentCodeSchema);