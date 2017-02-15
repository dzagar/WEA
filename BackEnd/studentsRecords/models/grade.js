var mongoose = require('mongoose');

var gradeSchema = mongoose.Schema(
    {
    	//currently a string because of things like WDN F etc.. can convert to number in front end for comparison
        mark: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('grade', gradeSchema);