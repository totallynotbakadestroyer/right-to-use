const express = require("express");
const router = express.Router();
const fileServices = require("../services/fileServices");

router.post("/", async (req, res) => {
  try {
    const { file } = req.files;
    const { metadata, folderName, upload, accessToken } = JSON.parse(
      req.body.payload
    );
    await fileServices.putXMP(file, metadata);
    if (upload) {
      const createdData = await fileServices.uploadToDrive(
        folderName,
        file.name,
        accessToken
      );
      return res.json(createdData);
    }
    return res.download(decodeURIComponent(`./temp/${file.name}`));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = router;
