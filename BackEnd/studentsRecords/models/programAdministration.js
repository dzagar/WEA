var mongoose = require('mongoose');

var programAdministrationSchema = mongoose.Schema(
    {
        name: String,
        position: String,
        department: {type: mongoose.Schema.ObjectId, ref: 'departments'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('programAdministration', programAdministrationSchema);