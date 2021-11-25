const passport=require("passport")
const LocalStrategy=require("passport-local").Strategy
const User=require("../model/user_model")

//signing up the user
passport.use(new LocalStrategy({
    usernameField:'user_email'
},
    function(user_email,password,done){
        User.findOne({user_email},(err,user)=>{
            if(err){
                console.log("Error while finding the user!!");
               return done(err)
            }
            if(!user || user.password!=password){
                return done(null,false)
            }
            return done(null,user)

        })   
    }
));

//putting the user._id in the cookie and depositing the cookie in the browser
passport.serializeUser((user,done)=>{
    done(null,user._id)
});

//Extracting the user from the _id in the cookie to establish identi
passport.deserializeUser((_id,done)=>{
    User.findOne({_id},(err,user)=>{
        if(err){
            console.log("Error while finding the user!!");
           return done(err)
        }
        if(user)
        done(null,user)
    })
});

// check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is signed in, then pass on the request to the next function(controller's funciton)
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/user/sign-in')
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this
        // to the locals for the views
        res.locals.user=req.user;
    }
    next();
}

module.exports=passport