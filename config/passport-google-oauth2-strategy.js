const passport=require("passport");
const googleStrategy=require("passport-google-oauth").OAuth2Strategy;
const crypto=require("crypto")
const User=require("../model/user_model");
const env=require("./environment")

passport.use(new googleStrategy({
    clientID:env.google_clientID,
    clientSecret:env.google_clientSecret,
    callbackURL:env.google_callbackURL
    },
    function(accessToken,refreshToken,profile,done){
        User.findOne({user_email:profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("Error in google strategy-passport",err);
                return;
            }
            // console.log(profile);

            if(user){
                return done(null, user);
            }
            else{
                User.create({
                    user_email:profile.emails[0].value,
                    name:profile.displayName,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err,user){
                    if(err){
                        console.log("Error in google strategy-passport",err);
                        return;
                    }
                    return done(null,user);
                })
            }
        })
}));

module.exports=passport;