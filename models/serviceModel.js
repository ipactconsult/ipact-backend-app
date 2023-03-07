const mongoose = require('mongoose')
const serviceSchema = new mongoose.Schema({
    title : {type: String, required:true, trim:true},
    description:{type: String, required:false},
    file_path: {type: String, required:false},
        public_id:{type:String},

    state: {type:String, default:""}  ,
    subservices:[{type:mongoose.Types.ObjectId, ref: "Subservice" , required:true}]

},{
    timestamps: true
  });
const  Service = mongoose.model("Service",serviceSchema)
module.exports = Service;