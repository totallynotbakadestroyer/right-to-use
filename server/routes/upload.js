const express = require("express");
const router = express.Router();
const { addXMP, isPSD } = require("../utils.js");

router.post("/", async (req, res) => {
  const { file } = req.files;
  if (!isPSD(file)) {
    return res.status(400).json({
      error: "Provided file is not a .PDF",
    });
  }
  await addXMP(file, JSON.parse(req.body.metadata));
  res.end();
});

module.exports = router;
