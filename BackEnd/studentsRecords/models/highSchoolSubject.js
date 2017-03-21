var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var highSchoolSubjectSchema = mongoose.Schema(
    {
        name: String,
        description: String,
        courses: [{type: mongoose.Schema.ObjectId, ref: ('HighSchoolCourses')}]
    },
    {
        versionKey: false
    }
);

highSchoolSubjectSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('highSchoolSubject', highSchoolSubjectSchema);