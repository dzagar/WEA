var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var highSchoolSchema = mongoose.Schema(
    {
        schoolName: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    },
    {
        versionKey: false
    }
);

highSchoolSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('highSchool', highSchoolSchema);