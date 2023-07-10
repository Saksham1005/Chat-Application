const express = require("express");
// const hbs=require("hbs");
const ejs = require("ejs");
const path = require("path");
const router = require("./routes/index");
const cookie_parser = require("cookie-parser");
const db = require("./config/mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const env = require("./config/environment");
const logger = require("morgan");
const app = express();
require("./config/view-helpers")(app);

const port = env.port || 3000;

// Storing our logs in a seperate file
app.use(logger(env.morgan.mode, env.morgan.options));

// setup the chat server to be used with socket.io
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
let chatServerPort = env.chatServer || 5000;
chatServer.listen(chatServerPort);
console.log("Chat Server is listening on Port: " + chatServerPort);

// Flash messages
const flash = require("connect-flash");
const customMware = require("./config/middleware");

const public_directory = path.join(__dirname, env.asset_path);
const views = path.join(__dirname, "./views");
const passport = require("passport");
const passportLocal = require("./config/passport");
const passportJWT = require("./config/passport-jwt");

app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.use(express.static(public_directory));
//making multer files to be accessible
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.set("view engine", "ejs");
app.set("views", views);
// hbs.registerPartials(partials)
app.use(express.json());

app.use(
  session({
    name: "chat_app",
    //Todo change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    //when user signs-in then the additional info should not be stored in the cookie
    resave: false,
    cookie: {
      maxAge: 1000 * 24 * 60 * 60,
    },
    //solving the problem of session cookies been removed after every server restart
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      (err) => {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passportLocal.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

app.use(router);

app.listen(port, () => {
  console.log("App is running on port: " + port);
});
