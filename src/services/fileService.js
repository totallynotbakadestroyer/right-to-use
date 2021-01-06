import axios from "axios";
import fileSaver from "file-saver";
const baseURL = "/upload";

const uploadFile = async (event, file, payload, auth) => {
  event.preventDefault();
  const data = new FormData();
  const accessToken = auth ? auth.accessToken : null;
  const formDataPayload = { ...payload, accessToken };
  data.append("payload", JSON.stringify(formDataPayload));
  data.append("file", file);
  if (!payload.upload) {
    const response = await axios.post(baseURL, data, {
      responseType: "blob",
    });
    return fileSaver(response.data, file.name);
  }
  await axios.post(baseURL, data);
};

export default uploadFile;
