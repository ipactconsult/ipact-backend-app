const mongoose = require('mongoose')
const devSchema = new mongoose.Schema({
    firstname : {type: String, required:true, trim:true},
    lastname : {type: String, required:true, trim:true},
    country : {type: String, required:false, trim:true},
    phone : {type: String, required:true, trim:true, unique:true},
    email : {type: String, required:true, trim:true, unique:true},
    description : {type: String},
    role:{type:String, default:""},
    avatar: {type:String, default:""},
    public_id:{type:String},
    birthday:{type: Date, default:""},
    bio : {type : String, default: ''},
    fb_link : {type: String, required:false},
    linkedin_link : {type: String, required:false},
    state : {type: String}
});
const Developer = mongoose.model("developer",devSchema)
module.exports = Developer;