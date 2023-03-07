const mongoose = require("mongoose");

const contactformSchema = new mongoose.Schema({
 subject : {type:String},
 email : {type:String},
 message : {type:String},
 
},
{
    timestamps: true
  },);

module.exports  = mongoose.model("ContactForm", contactformSchema);