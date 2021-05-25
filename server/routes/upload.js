const express = require("express");
const router = express.Router();
const fileServices = require("../services/fileServices");

module.exports = (sse) => {
  router.post("/", async (req, res) => {
    try {
      await sse.send('Processing file...', 'statusUpdate')
      const { file } = req.files;
      console.log(req.body);
      const { metadata, folderName, upload, accessToken } = JSON.parse(
        req.body.payload
      );
      sse.send('Updating XMP...', 'statusUpdate')
      await fileServices.putXMP(file, metadata);
      if (upload) {
        sse.send('Uploading to Google Drive...', 'statusUpdate')
        const createdData = await fileServices.uploadToDrive(
          folderName,
          file.name,
          accessToken
        );
        return res.json({ link: createdData });
      }
      return res.download(decodeURIComponent(`./temp/${file.name}`));
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e.message });
    }
  });
  return router;
};
