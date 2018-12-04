// Dependencies
var mongoose = require('mongoose');

// create a schema
var opportunitySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  oppName: String,
  stateName: String, //TODO this needs to be added for zillow to work
  cityName: String,
  oppCost: String,
  oppDebt: String,
  move: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
    collection: 'opportunities'
});
// create the mongoose model Form for the rest of the app to see
mongoose.model('Form', opportunitySchema);
