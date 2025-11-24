const express =require("express");
const router= express.Router({mergeParams:true});
const Listing = require("../modles/listing.js")
const { reviewSchema}=require("../schema.js")// this file use to joi validate 
const wrapAsync= require("../util/errorusingwrapasync.js")
const ExpressError= require("../util/ExpressError.js")//express error file use 
const Review = require("../modles/review.js");



//here we crate middleware for joi validation
 const validateReview=(req,res,next)=>{
   let {error} = reviewSchema.validate(req.body)
    if(error){
    let errmsg=error.details.map((el)=>el.message).join(","); //use to formated the error
    throw new ExpressError(400,error)
  }else{
    next();
  }
 }
 //reviews routes
router.post("/",validateReview,wrapAsync( async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview= new Review({...req.body.review, listing: listing._id })
listing.reviews.push(newReview);

await newReview.save();
await listing.save();
req.flash("success","New review add")

res.redirect(`/listing/${listing._id}`); 
}))

 // Delete review route
router.delete("/:reviewId" ,wrapAsync (async(req,res)=>{
  let { id,reviewId}= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  await Review.findByIdAndDelete(reviewId);
   req.flash("success","review deleted")

  res.redirect(`/listing/${id}`)
}))

module.exports =router;