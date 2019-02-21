var mongoose = require('mongoose');

var opportunitySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  oppName: String,
  stateName: String,
  cityName: String,
  oppCost: String,
  oppDebt: String,
  move: String,
  code: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
    collection: 'opportunities'
});

// create the mongoose model Opportunity for the rest of the app to see
mongoose.model('Opportunity', opportunitySchema);
