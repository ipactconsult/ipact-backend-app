const mongoose = require("mongoose");
const squadSchema = new mongoose.Schema({
    description : {type: String},
    price: {type: Number},
    members:{type:[String]},
    subService: {type:mongoose.Types.ObjectId, ref: "Subservice" , required:true},
});


const Subservice = mongoose.model("Squad",squadSchema)
module.exports = Subservice;