const passport=require("passport");
const googleStrategy=require("passport-google-oauth").OAuth2Strategy;
const crypto=require("crypto")
const User=require("../model/user_model");

passport.use(new googleStrategy({
        clientID:"841667385445-jfn1nh525g3r8hhvvqjpj0gph4579jgn.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:3000/user/auth/google/callback"
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