
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    nameOfEvent: {type: String, required: true},
    notes: {type: String, required: true},
    location: {type: String, required: true},
    date: {type: Date, required: true},
    newEvent: {type: Object, required: true},
});

module.exports = mongoose.model('Event', schema);
