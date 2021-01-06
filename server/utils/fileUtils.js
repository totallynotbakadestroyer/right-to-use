const fs = require("fs").promises;
const constants = require("../constants/constants.js");
const { addToXMP } = require("./xmpUtils.js");

/**
 *
 * @param data[] - ByteArray representation of file
 * @param byteSequence[] - ByteArray representation of sequence of bytes we need to find
 * @param limit - limit number of bytes the function searching through   - optional (default is data.length)
 * @returns {number} - index of first byte of the sequence in the file otherwise -1
 */
const findByteSequence = (data, byteSequence, limit = data.length) => {
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

const getResourceSection = ({ data }) => {
  const colorLength = data.readUIntBE(constants.colorSectionIndex, 4);
  const resourceIndex = constants.colorSectionIndex + 4 + colorLength;
  const resourceLength = data.readUIntBE(resourceIndex, 4);
  const XMPIndex = findByteSequence(data, [
    ...constants.imageResourceSignature,
    ...constants.XMPMetadataId,
  ]);
  return { resourceIndex, resourceLength, XMPIndex };
};

const createXMP = ({ resourceLength, resourceIndex }, file, fields) => {
  const { XMPResourceBuffer, length } = addToXMP(fields);
  file.data.writeIntBE(length + resourceLength, resourceIndex, 4);
  const beforeResource = file.data.slice(0, resourceIndex + 4);
  const afterResource = file.data.slice(resourceIndex + 4);
  file.data = Buffer.concat([beforeResource, XMPResourceBuffer, afterResource]);
  return file;
};

const updateXMP = (
  { XMPIndex, resourceLength, resourceIndex },
  file,
  fields
) => {
  const XMPLength = file.data.readIntBE(XMPIndex + 8, 4);
  const XMP = file.data
    .slice(XMPIndex + 12, XMPIndex + 12 + XMPLength)
    .toString("utf8");
  const { XMPResourceBuffer, length } = addToXMP(fields, XMP);
  file.data.writeIntBE(resourceLength - XMPLength + length, resourceIndex, 4);
  const beforeXMP = file.data.slice(0, XMPIndex + 12);
  const afterXMP = file.data.slice(XMPIndex + 12 + XMPLength);
  file.data = Buffer.concat([beforeXMP, XMPResourceBuffer, afterXMP]);
  return file;
};

const writeFile = async (file) => {
  await fs.mkdir("./temp", { recursive: true });
  await fs.writeFile(`./temp/${file.name}`, file.data);
};

const isPSD = (file) => {
  return (
    file.name.toLowerCase().endsWith(".psd") &&
    findByteSequence(
      file,
      [...constants.signature, 0, 1, 0, 0, 0, 0, 0, 0],
      12
    ) !== -1
  );
};

const parseMetadata = (metadata) => {
  const parsedMetadata = [];
  for (const field of metadata) {
    if (field.name === "") {
      throw new Error("Fields cannot be empty!");
    }
    if (field.name.startsWith("xmp:")) {
      parsedMetadata.push(field);
      continue;
    }
    field.name = "xmp:" + field.name;
    parsedMetadata.push(field);
  }
  return parsedMetadata;
};

module.exports = {
  findByteSequence,
  isPSD,
  getResourceSection,
  writeFile,
  createXMP,
  updateXMP,
  parseMetadata,
};
