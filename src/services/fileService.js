import axios from "axios";
import fileSaver from "file-saver";
const baseURL = "http://localhost:3001";

const uploadFile = async (event, file, payload, auth) => {
  event.preventDefault();
  const data = new FormData();
  const formDataPayload = { ...payload, accessToken: auth.accessToken };
  data.append("payload", JSON.stringify(formDataPayload));
  data.append("file", file);
  if (!payload.upload) {
    const response = await axios.post(`${baseURL}/upload`, data, {
      responseType: "blob",
    });
    return fileSaver(response.data, file.name);
  }
  await axios.post(`${baseURL}/upload`, data);
};

export default uploadFile;
