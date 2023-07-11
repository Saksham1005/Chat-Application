const env = require("./environment");
const fs = require("fs");
const path = require("path");

// Making a global function to be used in the views so as to extract file name of different
// css , js , images files (if exist) to our view
module.exports = (app) => {
  app.locals.assetPath = function (filePath) {
    if (env.name == "development") {
      return filePath;
    }

    // return filePath;

    return (
      "/" +
      JSON.parse(
        fs.readFileSync(
          path.join(__dirname, "../public/assets/rev-manifest.json")
        )
      )[filePath]
    );
  };
};
