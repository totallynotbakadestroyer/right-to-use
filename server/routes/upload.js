const express = require("express");
const router = express.Router();
const fileServices = require("../services/fileServices");

router.post("/", async (req, res) => {
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
});

module.exports = router;
