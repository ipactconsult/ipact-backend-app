const mongoose = require('mongoose')
const ipuserSchema = new mongoose.Schema({
    firstname : {type: String, required:true, trim:true},
    lastname : {type: String, required:true, trim:true},
    email : {type: String, required:true, trim:true, unique:true},
    password:{type:String, required:true},
    role:{type:String},
    avatar: {type:String, default:""},
    public_id:{type:String},
    resetLink:{type:String, default:""},
    phone : {type: String,default:""},
    birthday:{type:Date, default:""},
    country:{type:String, default:""},
});
module.exports = mongoose.model('ipact-user', ipuserSchema);