var mongoose = require('mongoose');

var opportunitySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: String,
  name: String,
  state: String,
  city: String,
  region: String,
  income: Number,
  bonus: Number,
  move: String,
  principal: Number,
  rate: Number,
  annualCompounds: Number,
  monthlyPayment: Number,
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
