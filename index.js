const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./util/ExpressError.js"); //express error file use
const Mongo_Url = "mongodb://127.0.0.1:27017/wonderlust";

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modles/user.js");
const UserRouter =require("./router/user.js");
const listingRouter = require("./router/listing.js");
const reviewsRouter = require("./router/review.js");


main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // use to read undefined data post by post method
app.use(express.json()); // agar JSON body bhejni ho
app.use(methodOverride("_method")); //used to send put req
app.engine("ejs", ejsMate); //use to templating
app.use(express.static(path.join(__dirname, "/public")));

// use session concept
const sessionOption = {
  secret: "mjjshjdnsam",
  resave: false,
  saveUninitialized: true,
  Cookie: {
    expries: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
//use the session
app.use(session(sessionOption));
//use flash
app.use(flash());

//authencation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.send("hi root node");
});

//here carate middleware for flash use
app.use((req, res, next) => {
  (res.locals.success = req.flash("success")),
    (res.locals.error = req.flash("error")),
    next();
});
app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/",UserRouter);


//middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "something went wrong" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { message });
});

// app.get("/demouser", async (req, res) => {
//   let Fakeuser = new User({
//     email: "harsh@gmial.com",
//     username: "anna",
//   });
//   let regiseteruser = await User.register(Fakeuser, "hellowrold");
//   res.send(regiseteruser);
// });
// // test the expresserror
// // app.all * means all route check and no route prensent in your backend
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});


app.listen(8080, () => {
  console.log("Server working port 8080 well");
});
