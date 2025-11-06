const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./modles/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./util/errorusingwrapasync.js")
 const ExpressError= require("./util/ExpressError.js")//express error file use 
const {listingSchema}=require("./schema.js")// this file use to joi validate 
const Mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  })

async function main() {
  await mongoose.connect(Mongo_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true })); // use to read undefined data post by post method
app.use(express.json()); // agar JSON body bhejni ho
app.use(methodOverride("_method")); //used to send put req 
app.engine("ejs", ejsMate);//use to templating
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
  res.send("hi root node");
});


//here we crate middleware for joi validation
 const validateListing=(req,res,next)=>{
   let {error} = listingSchema.validate(req.body)
 
  if(error){
    let errmsg=error.details.map((el)=>el.message).join(","); //use to formated the error
    throw new ExpressError(400,error)
  }else{
    next();
  }
 }




//  1. Index route - show all listings
app.get("/listing", wrapAsync(async (req, res) => {
 const alllisting = await Listing.find({});
  res.render("listing/index", { alllisting });
}));

//  2. New route - form to create listing (MUST come before :id route)
app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});

// 3. Create route - add listing to DB
//  Remove the extra spaces after "/listing"

  app.post("/listing",validateListing,  wrapAsync(async (req, res,next) => {
   await new_list.save();
  res.redirect("/listing");

  }));



// 4. Edit route - show edit form
app.get("/listing/:id/edit",wrapAsync( async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
}));

// 5. Update route - apply changes
app.put("/listing/:id",validateListing, wrapAsync(async (req, res) => {
   const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));

// 6. Show route - show one listing (MUST come after /new and /:id/edit)
app.get("/listing/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show",{ listing });
}));

// 7. Delete route
app.delete("/listing/:id",  wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}));


// // test the expresserror
// // app.all * means all route check and no route prensent in your backend 
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//middleware
app.use((err,req,res,next)=>{
  let{ status =500,message ="something went wrong"} = err
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{message})
})



app.listen(8080, () => {
  console.log("Server working port 8080 well");

});

 
