const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: "http://localhost:3001",
  },
  outputDir: path.resolve(__dirname, "../server/public"),
};
