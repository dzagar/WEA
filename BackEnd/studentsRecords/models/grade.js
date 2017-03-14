var mongoose = require('mongoose');

var gradeSchema = mongoose.Schema(
    {
    	//currently a string because of things like WDN F etc.. can convert to number in front end for comparison
        mark: String,
        note: String,
<<<<<<< HEAD
        term: {type: mongoose.Schema.ObjectId, ref: 'Term'},
        courseCode: {type: mongoose.Schema.ObjectId, ref: 'CourseCode'}
=======
        termCode: {type: mongoose.Schema.ObjectId, ref: 'termCode'},
        courseCode: {type: mongoose.Schema.ObjectId, ref: 'courseCode'}
>>>>>>> FinishingLab3
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('grade', gradeSchema);