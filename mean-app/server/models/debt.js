var mongoose = require("mongoose");

var debtSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  principal: Number,
  rate: Number,
  annualCompounds: Number,
  monthlyPayment: Number,
  opportunity: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{
    collection: "debts"
});

//export the mongoose model Debt for the rest of the app to see
mongoose.model("Debt", debtSchema);
