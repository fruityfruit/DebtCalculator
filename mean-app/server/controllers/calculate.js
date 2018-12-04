import { OpportunityformService, TokenPayload } from '../opportunityform.service';
import { MathService } from '../math.service';
var mongoose = require('mongoose');
var Form = mongoose.model('Form');
module.exports.getDebt = function(req , res){
  Form.findOne({}, function (err, opportunity){
      res.json(opportunity.oppDebt);
  });
}
