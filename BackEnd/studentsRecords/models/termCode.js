var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var termCodeSchema = mongoose.Schema(
    {
        name: String,
        adjudications: [{type: mongoose.Schema.ObjectId, ref: 'Adjudication'}],
        terms: [{type: mongoose.Schema.ObjectId, ref: 'Term'}]
        // Adjudication
    },
    {
        versionKey: false
    }
);
termCodeSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('termCode',termCodeSchema);