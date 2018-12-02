// Dependencies
var mongoose = require('mongoose');

// create a schema
var opportunitySchema = new mongoose.Schema({
  type: String,
  oppName: String,
  cityName: String,
  oppCost: String,
  oppDebt: String,
  move: String
},
{
    collection: 'opportunity'
});
// create the mongoose model Form for the rest of the app to see
mongoose.model('Form', opportunitySchema);
