const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    title: { type: String },
    image: { type: String },
    description: { type: String },
  link_project : {type: String},
  group_name : {type: String},
  file_path : {type: String},
  public_id:{type:String},
   
  state: { type: String },
});

 const  Project = mongoose.model("Project",projectSchema)
module.exports = Project;
