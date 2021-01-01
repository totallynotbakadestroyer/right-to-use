const signature = [0x38, 0x42, 0x50, 0x53];
const colorSectionIndex = 26;
const imageResourceSignature = [0x38, 0x42, 0x49, 0x4d];
const XMPMetadataId = [0x04, 0x24];
const XMPResourceDefault = [
  ...imageResourceSignature,
  ...XMPMetadataId,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
  0x00,
];

module.exports = {
  signature,
  colorSectionIndex,
  imageResourceSignature,
  XMPMetadataId,
  XMPResourceDefault
};
