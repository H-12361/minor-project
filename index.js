const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./modles/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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





// ✅ 1. Index route - show all listings
app.get("/listing", async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listing/index", { alllisting });
});

// ✅ 2. New route - form to create listing (MUST come before :id route)
app.get("/listing/new", (req, res) => {
  res.render("listing/new.ejs");
});

// ✅ 3. Create route - add listing to DB
// ⚠️ Remove the extra spaces after "/listing"
app.post("/listing", async (req, res) => {
  const new_list = new Listing(req.body.listing); // make sure your form uses name="listing[title]" etc.
  await new_list.save();
  res.redirect("/listing");
});

// ✅ 4. Edit route - show edit form
app.get("/listing/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });
});

// ✅ 5. Update route - apply changes
app.put("/listing/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
});

// ✅ 6. Show route - show one listing (MUST come after /new and /:id/edit)
app.get("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/show", { listing });
});

// ✅ 7. Delete route
app.delete("/listing/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

// //index route
// app.get("/listing", async (req, res) => {
//   const alllisting = await Listing.find({});
//   res.render("listing/index", { alllisting });
// });
// //create new list
// app.get("/listing/new", (req, res) => {
//   res.render("listing/new.ejs");
// });
// // add existing main table
// app.post("/listing", async (req, res) => {
//   const new_list = new Listing(req.body);
//   await new_list.save();
//   res.redirect("/listing");
// });
// //edit route
// app.get("/listing/:id/edit", async (req, res) => {
//   let { id } = req.params;
//   console.log(id);
//   const listing = await Listing.findById(id);
//   console.log(listing);
//   res.render("listing/edit.ejs", { listing })
// });

// //show route 
// app.get("/listing/:id", async (req, res) => {
//   let { id } = req.params;
//   const listing = await Listing.findById(id);
//   res.render("listing/show", { listing });
// });





// //update route
// app.put("/listing/:id", async (req, res) => {
//   let { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing })
//   res.redirect("/listing");
// });
// //delete route
// app.delete("/listing/:id", async (req, res) => {
//   let { id } = req.params;
//   let delteddata = await Listing.findByIdAndDelete(id);
//   console.log(delteddata);
//   res.redirect("/listing");
// });

app.listen(8080, () => {
  console.log("Server working port 8080 well");

});

 
