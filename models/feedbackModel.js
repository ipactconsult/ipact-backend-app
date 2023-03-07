const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    username : {type:String},
    role : {type:String},
    message : {type:String},
    active : {type:Boolean},
});

module.exports  = mongoose.model("Feedback", feedbackSchema);