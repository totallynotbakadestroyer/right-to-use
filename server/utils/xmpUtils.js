const { XMPResourceDefault } = require("../constants/constants.js");
const DOMParser = require("xmldom").DOMParser;
const parser = new DOMParser();
const XMLSerializer = require("xmldom").XMLSerializer;

const XMP_TEMPLATE = `
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="TNTBKD">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about="">
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>`;

const XPACKET_FOOTER = '<?xpacket end="w"?>';

const XPACKET_HEADER = '<?xpacket begin="п»ї" id="W5M0MpCehiHzreSzNTczkc9d"?>';

const generateLines = () => {
  let lines = "";
  for (let i = 0; i < 10; i++) {
    lines +=
      "                                                                                                  \n";
  }
  return lines;
};

const addFields = (xml, fields) => {
  const xmp = parser.parseFromString(xml, "text/xml").documentElement;
  console.log(xml)
  let descriptionTag = xmp.getElementsByTagName("rdf:Description")[0];
  if (!descriptionTag) {
    const description = xmp.createElement("rdf:Description");
    xmp.getElementsByTagName("rdf:RDF")[0].appendChild(description);
    descriptionTag = xmp.getElementsByTagName("rdf:Description")[0];
  }
  const currentTime = new Date().toISOString();
  for (const field of fields) {
    console.log(field);
    descriptionTag.setAttribute(field.name, field.data);
  }
  descriptionTag.setAttribute("xmp:ModifyDate", currentTime);
  descriptionTag.setAttribute("xmp:CreateDate", currentTime);
  descriptionTag.setAttribute("xmp:MetadataDate", currentTime);
  return XPACKET_HEADER +
    new XMLSerializer().serializeToString(xmp) +
    generateLines() +
    XPACKET_FOOTER;
};

const xmpToImageResource = (xmp) => {
  let XMPBuffer = Buffer.from(new TextEncoder().encode(xmp));
  const XMPResourceSignatureBuffer = Buffer.from(XMPResourceDefault);
  const XMPLength = XMPBuffer.length;
  if (XMPLength % 2 !== 0) {
    XMPBuffer = Buffer.concat([XMPBuffer, Buffer.from([0x00])]);
  }
  XMPResourceSignatureBuffer.writeIntBE(XMPLength, 8, 4);
  const XMPResourceBuffer = Buffer.concat([
    XMPResourceSignatureBuffer,
    XMPBuffer,
  ]);
  return { XMPResourceBuffer, length: XMPResourceBuffer.length };
};

const addToXMP = (fields, originalXMP = XMP_TEMPLATE) => {
  const XMP = addFields(originalXMP, fields);
  console.log(XMP)
  const { XMPResourceBuffer, length } = xmpToImageResource(XMP);
  return { XMPResourceBuffer, length };
};

module.exports = {
  addToXMP,
};
