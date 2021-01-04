const findRemove = require("find-remove");

const cleanTemp = () => {
  console.log("cleaning temp");
  findRemove("./temp", { files: "*.*", age: { seconds: 300 } });
};

module.exports = cleanTemp;
