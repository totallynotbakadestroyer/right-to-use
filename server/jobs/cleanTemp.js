const findRemove = require("find-remove");

const cleanTemp = () => {
  findRemove("./temp", { files: "*.*", age: { seconds: 300 } });
};

module.exports = cleanTemp;
