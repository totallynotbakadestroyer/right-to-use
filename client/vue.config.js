const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "http://localhost:3001",
  },
  outputDir: path.resolve(__dirname, "../server/public"),
};
