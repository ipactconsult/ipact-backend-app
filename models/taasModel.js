const mongoose = require('mongoose')
const taasSchema = new mongoose.Schema({
    title : {type: String, required:true, trim:true},
    description:{type: String, required:true},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" , required:true}],
    tools:[{type:String, required:true}],  
},{
    timestamps: true
  });
const  Taas = mongoose.model("taas",taasSchema)
module.exports = Taas;