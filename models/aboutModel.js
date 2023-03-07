const mongoose = require('mongoose')
const aboutSchema = new mongoose.Schema({
    title : {type: String, required:true, trim:true},
    description:{type: String, required:false},
    file_path: {type: String, required:false},
    public_id:{type:String},
    state: {type:String, default:""}  
},{
    timestamps: true
  });
const  About = mongoose.model("about",aboutSchema)
module.exports = About;