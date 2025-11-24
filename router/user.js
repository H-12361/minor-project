const express=require("express")
const router =express.Router();
const User=require("../modles/user");

const wrapAsync=require("../util/errorusingwrapasync")
const passport=require("passport");
  

router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try {
          let {username,email,password}=req.body;
        const newUser= new User({email,username});
        const regiseteruser= await User.register(newUser,password);
        console.log(regiseteruser);
        req.flash("success","Welcome to Wonderlust");
        res.redirect("/listing");
        
    }
     catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
        
    }

}));

router.get("/login",(req,res)=>{
   res.render("user/login.ejs");
});
router.post("/login", passport.authenticate('local', { failureRedirect: '/login' , failureFlash : true, }),
    async(req , res)=>{
        req.flash( "success","Welcome back wounderlust You're login");
        res.redirect("/listing")

    })

    router.get("/logout",(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Logout Successful;")
        })
    })
module.exports=router;