// Dependencies
var mongoose = require('mongoose');

// create a schema
var opportunitySchema = new mongoose.Schema({
  type: {
      type: String,
      required: true
  },
  oppName: {
    type: String,
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  oppCost: {
    type: String,
    required: true
  },
  oppDebt: {
    type: String,
    required: true
  },
  move: {
    type: String,
    required: true
  }
});
// create the mongoose model User for the rest of the app to see
mongoose.model('Form', opportunitySchema);
