const axios = require("axios");
const fs = require("fs/promises");
const apiFiles = "https://www.googleapis.com/drive/v3/files";
const apiFilesUpload = "https://www.googleapis.com/upload/drive/v3/files";

const getRootFolderId = async (access_token) => {
  const result = await axios.get(apiFiles, {
    params: {
      q:
        "mimeType = 'application/vnd.google-apps.folder' and name = 'rights' and trashed = false",
      access_token,
    },
  });
  if (result.data.files.length === 0) {
    return await createRootFolderDrive(access_token);
  }
  return result.data.files[0].id;
};

const createRootFolderDrive = async (access_token) => {
  const response = await axios.post(
    apiFiles,
    { mimeType: "application/vnd.google-apps.folder", name: "rights" },
    {
      params: {
        access_token,
      },
    }
  );
  return response.data.id;
};

const createFolderDrive = async (folderName, rootId, access_token) => {
  const response = await axios.post(
    apiFiles,
    {
      mimeType: "application/vnd.google-apps.folder",
      name: folderName,
      parents: [rootId],
    },
    {
      params: {
        access_token,
      },
    }
  );
  return response.data.id;
};

const uploadFile = async (folderId, fileName, access_token) => {
  const metaData = {
    name: fileName,
    parents: [folderId],
  };
  const payload = await generateMultipartPayload(
    metaData,
    decodeURIComponent(`./temp/${fileName}`)
  );
  await axios.post(apiFilesUpload, payload, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    params: { access_token, uploadType: "multipart" },
    headers: {
      "Content-Type": "multipart/form-data; boundary=xxxxxxxxxx",
    },
  });
};

const idToUrl = (id) => {
  return `https://drive.google.com/open?id=${id}`;
};

const generateMultipartPayload = async (metadata, filePath) => {
  const file = await fs.readFile(filePath);
  const boundary = "xxxxxxxxxx";
  let body = "--" + boundary + "\r\n";
  body += 'Content-Disposition: form-data; name="metadata"\r\n';
  body += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
  body += JSON.stringify(metadata) + "\r\n";
  body += "--" + boundary + "\r\n";
  body += 'Content-Disposition: form-data; name="file"\r\n\r\n';
  return Buffer.concat([
    Buffer.from(body, "utf8"),
    Buffer.from(file),
    Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
  ]);
};

module.exports = {
  getRootFolderId,
  createFolderDrive,
  uploadFile,
  idToUrl,
};
