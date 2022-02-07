const express=require("express");
// const hbs=require("hbs");
const ejs=require("ejs");
const path=require("path");
const port=3000;
const router=require("./routes/index");
const cookie_parser=require("cookie-parser")
const db=require("./config/mongoose");
const session=require("express-session")
const MongoStore=require('connect-mongo')(session);
const passportGoogle=require("./config/passport-google-oauth2-strategy");
// const helpers = require('handlebars-helpers')({
//     handlebars: hbs
// });

// Flash messages
const flash=require('connect-flash')
const customMware=require('./config/middleware')
// const sassMiddleware=require('no')

const app=express();
const public_directory=path.join(__dirname,"./public")
const views=path.join(__dirname,"./views")
// const partials=path.join(__dirname,"./partials")
const passport=require("passport")
const passportLocal=require("./config/passport")
const passportJWT=require("./config/passport-jwt")

app.use(express.urlencoded({ extended: true }))
app.use(cookie_parser())

app.use(express.static(public_directory));
//making multer files to be accessible
app.use('/uploads',express.static(path.join(__dirname,"/uploads")));
app.set("view engine","ejs");
app.set("views",views)
// hbs.registerPartials(partials)
app.use(express.json())

app.use(session({
    name:'chat_app',
    //Todo change the secret before deployment in production mode
    secret:'something',
    saveUninitialized:false,
    //when user signs-in then the additional info should not be stored in the cookie 
    resave:false,
    cookie:{
        maxAge:(1000*24*60*60)
    },
    //solving the problem of session cookies been removed after every server restart 
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },
    (err)=>{
        console.log(err || 'connect-mongodb setup ok');
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passportLocal.setAuthenticatedUser);

app.use(flash())
app.use(customMware.setFlash)

app.use(router)
// app.use(helpers)


app.listen(port,()=>{
    console.log("App is running on port: "+port);
})