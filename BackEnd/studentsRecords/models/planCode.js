var mongoose = require('mongoose');

var planCodeSchema = mongoose.Schema(
    {
        name: String
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('planCode', planCodeSchema);