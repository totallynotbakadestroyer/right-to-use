const express = require("express");
const router = express.Router();
const fileServices = require("../services/fileServices");

router.post("/", async (req, res) => {
  const { file } = req.files;
  const { accessToken, folderName } = req.body;
  const metadata = JSON.parse(req.body.metadata);
  await fileServices.putXMP(file, metadata);
  if (accessToken && folderName) {
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
