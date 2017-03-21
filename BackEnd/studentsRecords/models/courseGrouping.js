var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var courseGroupingSchema = mongoose.Schema(
    {
        name: String,
        courseCodes: [{type: mongoose.Schema.ObjectId, ref: 'CourseCode'}]
    },

    {
        versionKey: false
    }
);

courseGroupingSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('courseGrouping', courseGroupingSchema);