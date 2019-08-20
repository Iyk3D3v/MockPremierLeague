const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    teamOne: String,
    teamTwo: String,
    date:String
});

module.exports  = mongoose.model('Fixtures', fixtureSchema);