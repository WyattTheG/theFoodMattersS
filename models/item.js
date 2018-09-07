var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    dimensions: {type: String, required: true},
    color: {type: String, required: true},
    numberOf: {type: Number, required: true},
    location: {type: String, required: true},
    img: { data: Buffer, contentType: String },
    available : {type: Boolean, required: true},
    quantityForEvent : {type: String, required: false},
    notes : {type: String, required: true}
});

module.exports = mongoose.model('Item', schema);
