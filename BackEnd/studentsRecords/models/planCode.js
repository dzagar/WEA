var mongoose = require('mongoose');

var planCodeSchema = mongoose.Schema(
    {
        name: String,
        programRecord: {type: mongoose.Schema.ObjectId, ref: 'programRecord'}
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('planCode', planCodeSchema);