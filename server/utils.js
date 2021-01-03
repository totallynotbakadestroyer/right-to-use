const { addToXMP } = require("./xmp.js");
const fs = require("fs/promises");
const constants = require("./constants/constants.js");
const { signature } = require("./constants/constants.js");
const axios = require("axios");
/**
 *
 * @param data[] - ByteArray representation of file
 * @param byteSequence[] - ByteArray representation of sequence of bytes we need to find
 * @param limit - limit number of bytes the function searching through   - optional (default is data.length)
 * @returns {number} - index of first byte of the sequence in the file otherwise -1
 */
const findByteSequence = ({ data }, byteSequence, limit = data.length) => {
  for (let i = 0; i < limit; i++) {
    if (data[i] === byteSequence[0]) {
      for (let j = 1; j < byteSequence.length; j++) {
        if (j === byteSequence.length - 1 && byteSequence[j] === data[i + j]) {
          return i;
        } else if (byteSequence[j] !== data[i + j]) {
          i += j;
          break;
        }
      }
    }
  }
  return -1;
};

const addXMP = async (file, fields) => {
  const colorLength = file.data.readUIntBE(constants.colorSectionIndex, 4);
  const resourceIndex = constants.colorSectionIndex + 4 + colorLength;
  const resourceLength = file.data.readUIntBE(resourceIndex, 4);
  const XMPIndex = findByteSequence(file, [
    ...constants.imageResourceSignature,
    ...constants.XMPMetadataId,
  ]);
  if (XMPIndex === -1) {
    const { XMPResourceBuffer, length } = addToXMP(fields);
    file.data.writeIntBE(length + resourceLength, resourceIndex, 4);
    const beforeResource = file.data.slice(0, resourceIndex + 4);
    const afterResource = file.data.slice(resourceIndex + 4);
    file.data = Buffer.concat([
      beforeResource,
      XMPResourceBuffer,
      afterResource,
    ]);
  } else {
    const XMPLength = file.data.readIntBE(XMPIndex + 8, 4);
    const XMP = file.data.slice(XMPIndex + 12, XMPLength).toString("utf8");
    const { XMPResourceBuffer, length } = addToXMP(fields, XMP);
    file.data.writeIntBE(resourceLength - XMPLength + length, resourceIndex, 4);
    const beforeXMP = file.data.slice(0, XMPIndex + 12);
    const afterXMP = file.data.slice(XMPIndex + 12 + length);
    file.data = Buffer.concat([beforeXMP, XMPResourceBuffer, afterXMP]);
  }
  await writeFile(file);
};

const writeFile = async (file) => {
  await fs.mkdir("./temp", { recursive: true });
  await fs.writeFile(`./temp/${file.name}`, file.data);
};

const getRootFolderId = async (access_token) => {
  const result = await axios.get("https://www.googleapis.com/drive/v3/files", {
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

const createRootFolderDrive = async (
  access_token
) => {
  const response = await axios.post(
    "https://www.googleapis.com/drive/v3/files",
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
    "https://www.googleapis.com/drive/v3/files",
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
  const data = await fs.readFile(`./temp/${fileName}`);
  const boundary = "xxxxxxxxxx";
  let body = "--" + boundary + "\r\n";
  body += 'Content-Disposition: form-data; name="metadata"\r\n';
  body += "Content-Type: application/json; charset=UTF-8\r\n\r\n";
  body += JSON.stringify(metaData) + "\r\n";
  body += "--" + boundary + "\r\n";
  body += 'Content-Disposition: form-data; name="file"\r\n\r\n';
  const payload = Buffer.concat([
    Buffer.from(body, "utf8"),
    Buffer.from(data),
    Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
  ]);
  await axios.post(
    "https://www.googleapis.com/upload/drive/v3/files",
    payload,
    {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      params: { access_token, uploadType: "multipart" },
      headers: {
        "Content-Type": "multipart/form-data; boundary=" + boundary,
      },
    }
  );
};

const uploadToDrive = async (folderName, fileName, access_token) => {
  const rootId = await getRootFolderId(access_token);
  const buyerFolder = await createFolderDrive(folderName, rootId, access_token);
  await uploadFile(buyerFolder, fileName, access_token);
  return buyerFolder;
};

const isPSD = (file) => {
  return (
    file.name.toLowerCase().endsWith(".psd") &&
    findByteSequence(file, [...signature, 0, 1, 0, 0, 0, 0, 0, 0], 12) !== -1
  );
};

module.exports = {
  findByteSequence,
  addXMP,
  isPSD,
  uploadToDrive,
};
