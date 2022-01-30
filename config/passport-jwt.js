const passport=require("passport")
const JwtStrategy =require("passport-jwt").Strategy
const ExtractJwt=require("passport-jwt").ExtractJwt

const User=require("../model/user_model")

let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'codeial';

passport.use(new JwtStrategy(opts, function(jwtPayload,done){
    User.findById(jwtPayload._id, function(err,user){
        if(err){
            console.log("Error while authenticating!! JWT")
            return done(err,false);
        }

        if(user){
            return done(null, user);
        }

        else{
            return done(null, false);
        }
    })
}));

module.exports=passport;