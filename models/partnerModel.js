const mongoose = require('mongoose')
const partnerSchema = new mongoose.Schema({
    title : {type: String, required:true, trim:true},
    type : {
        type: String, 
         
        trim:true , 
        enum: ["PRIVATE INSTITUTIONS", "EDUCATIONAL INSTITUTIONS", "NON-GOVERMENTAL INSTITUTIONS", "CLUBS & ASSOCIATIONS", "PUBLIC INSTITUTIONS"] 
    },
    image: {type: String, required:false},
    public_id:{type:String},  
},{
    timestamps: true
  });
const  Partner = mongoose.model("partner",partnerSchema)
module.exports = Partner;