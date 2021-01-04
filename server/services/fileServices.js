const {
  getResourceSection,
  createXMP,
  updateXMP,
  writeFile,
} = require("../utils/fileUtils.js");
const {
  uploadFile,
  getRootFolderId,
  createFolderDrive,
  idToUrl,
} = require("../utils/driveUtils.js");

const uploadToDrive = async (folderName, fileName, access_token) => {
  const rootId = await getRootFolderId(access_token);
  const buyerFolder = await createFolderDrive(folderName, rootId, access_token);
  await uploadFile(buyerFolder, fileName, access_token);
  return idToUrl(buyerFolder);
};

const putXMP = async (file, fields) => {
  const resourceSection = getResourceSection(file);
  let updatedFile;
  if (resourceSection.XMPIndex === -1) {
    updatedFile = createXMP(resourceSection, file, fields);
  } else {
    updatedFile = updateXMP(resourceSection, file, fields);
  }
  await writeFile(updatedFile);
};

module.exports = {
  uploadToDrive,
  putXMP,
};
