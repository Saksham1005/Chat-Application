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

const env=require("./config/environment");
const logger=require("morgan")
const app=express();

// Storing our logs in a seperate file
app.use(logger(env.morgan.mode, env.morgan.options))

// setup the chat server to be used with socket.io
// app.use(require('cors')())
const chatServer=require("http").Server(app);
const chatSockets=require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("chat server is listening on port 5000");

// Flash messages
const flash=require('connect-flash')
const customMware=require('./config/middleware')

// We only want to scss files to transpile only once!!!!!!!!!!!!!!
// const sassMiddleware=require('no')
// var sass = require('node-sass');
// var result = sass.renderSync({
//     file: './public/scss',
//     // outputStyle: 'compressed',
//     outFile: './public/css',
//     sourceMap: true // or an absolute or relative (to outFile) path
// });

const gulp=require("gulp")
const sass=require("gulp-sass")(require('sass'));

gulp.task('css', () => {
    console.log("gulp sass");
    gulp.src('./public/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css.css'));
});

gulp.task('clean', () => {
    return del([
        'css/main.css',
    ]);
});

gulp.task('default', gulp.series(['clean','css']));

gulp.task('watch', () => {
    gulp.watch('sass/**/*.scss', (done) => {
        gulp.series(['clean', 'styles'])(done);
    });
});
// buildStyles();

const public_directory=path.join(__dirname, env.asset_path);
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
    secret: env.session_cookie_key,
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