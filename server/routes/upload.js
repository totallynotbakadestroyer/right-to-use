const express = require("express");
const router = express.Router();
const { addXMP } = require("../utils.js");

router.post("/", async (req, res) => {
  const { file } = req.files;
  await addXMP(file, JSON.parse(req.body.metadata));
  res.end();
});

module.exports = router;
