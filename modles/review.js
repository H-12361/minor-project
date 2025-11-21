const { string, types, number } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        type: Number,
        min:1,
        max:5

    },
    createdAt:{
        type:Date,
        default:Date.now()
    }, 
    listing: {                // ⭐ Required
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
});

module.exports=mongoose.model("Review", reviewSchema)