const mongoose = require("mongoose");
const subserviceSchema = new mongoose.Schema({
  name: { type: String },
  description : {type: String},
  file_path : {type: String},
  public_id:{type:String},
  //serviceType: { type: Array, ref: "Service" },
  serviceType: {type:mongoose.Types.ObjectId, ref: "Service" , required:true},
  trainingSkill: {type: String},
  squads:[{type:mongoose.Types.ObjectId, ref: "Squad", required:true}],
  state: { type: String },
});


const Subservice = mongoose.model("Subservice",subserviceSchema)
module.exports = Subservice;