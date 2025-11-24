const mongoose = require("mongoose")

const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

//  note : if we use PassportLocalMongoose automatic create the username and password field and also adding hasing salting all require thing we don't need to add manutal
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);