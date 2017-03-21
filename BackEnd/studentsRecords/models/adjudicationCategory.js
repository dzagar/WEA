var mongoose = require('mongoose');

var adjudicationCategorySchema = mongoose.Schema(
    {
        name: String,
        programYear: String,
        assessmentCodes: [{type: mongoose.Schema.ObjectId, ref: 'assessmentCode'}]
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('adjudicationCategory', adjudicationCategorySchema);