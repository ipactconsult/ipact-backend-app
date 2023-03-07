const mongoose = require('mongoose')
const headerSchema = new mongoose.Schema({
    title : {type: String, required:true, trim:true},
    description:{type: String, required:false},
    file_path: {type: String, required:true},
    public_id:{type:String},
    state: {type:String, default:""}  
},{
    timestamps: true
  });
const  Header = mongoose.model("header",headerSchema)
module.exports = Header;