const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");

const logDirectory = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDirectory,
});

const production = {
  port: process.env.PORT,
  chatServer: process.env.chatServer,
  name: "production",
  asset_path: process.env.chat_app_asset_path,
  session_cookie_key: process.env.chat_app_session_cookie_key,
  db: process.env.chat_app_db,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.gmail,
      pass: process.env.password,
    },
  },
  google_clientID: process.env.chat_app_google_clientID,
  google_clientSecret: process.env.chat_app_google_clientSecret,
  google_callbackURL: process.env.chat_app_google_callbackURL,
  jwt_secret: process.env.chat_app_jwt_secret,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports = production;
